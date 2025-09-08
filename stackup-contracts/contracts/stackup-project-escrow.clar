;; title: stackup-project-escrow
;; version: 3.0.0
;; summary: Enhanced project system with milestone-based escrow and payments
;; description: Secure project management with milestone-based payments after developer selection

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u200))
(define-constant ERR-PROJECT-NOT-FOUND (err u201))
(define-constant ERR-MILESTONE-OUT-OF-BOUNDS (err u202))
(define-constant ERR-MILESTONE-ALREADY-PAID (err u203))
(define-constant ERR-INVALID-MILESTONES (err u204))
(define-constant ERR-EMPTY-MILESTONES (err u205))
(define-constant ERR-DEVELOPER-ALREADY-SELECTED (err u206))
(define-constant ERR-NO-DEVELOPER-SELECTED (err u207))
(define-constant ERR-PROJECT-NOT-ACTIVE (err u208))
(define-constant ERR-INSUFFICIENT-FUNDS (err u209))

;; data vars
(define-data-var next-project-id uint u1)
(define-data-var contract-owner principal tx-sender)

;; data maps
(define-map project-details 
    { project-id: uint } 
    { 
        owner: principal,
        title: (string-ascii 100),
        description: (string-ascii 500),
        category: (string-ascii 50),
        developer: (optional principal),
        total-amount: uint,
        milestone-count: uint,
        status: (string-ascii 15),
        created-at: uint,
        selected-at: (optional uint),
        deadline: (optional uint)
    }
)

(define-map milestone-details
    { project-id: uint, milestone-index: uint }
    {
        title: (string-ascii 100),
        description: (string-ascii 200),
        amount: uint,
        is-paid: bool,
        completed-at: (optional uint)
    }
)

;; Project escrow tracking
(define-map project-escrow
    { project-id: uint }
    {
        total-locked: uint,
        total-paid: uint,
        is-fully-released: bool
    }
)

;; Helper functions
(define-private (setup-milestone-entry (milestone-info { title: (string-ascii 100), description: (string-ascii 200), amount: uint }) (acc (response { project-id: uint, index: uint } uint)))
    (match acc
        success-data
        (let 
            (
                (project-id (get project-id success-data))
                (index (get index success-data))
            )
            (map-set milestone-details 
                { project-id: project-id, milestone-index: index }
                { 
                    title: (get title milestone-info),
                    description: (get description milestone-info),
                    amount: (get amount milestone-info),
                    is-paid: false,
                    completed-at: none
                }
            )
            (ok { project-id: project-id, index: (+ index u1) })
        )
        error-val (err error-val)
    )
)

(define-private (setup-milestones (project-id uint) (milestones (list 10 { title: (string-ascii 100), description: (string-ascii 200), amount: uint })))
    (fold setup-milestone-entry milestones (ok { project-id: project-id, index: u0 }))
)

(define-private (calculate-total-amount (milestones (list 10 { title: (string-ascii 100), description: (string-ascii 200), amount: uint })))
    (fold + (map get-amount milestones) u0)
)

(define-private (get-amount (milestone { title: (string-ascii 100), description: (string-ascii 200), amount: uint }))
    (get amount milestone)
)

;; public functions

;; Create project with milestones (no funds locked until developer selected)
(define-public (create-project 
    (title (string-ascii 100)) 
    (description (string-ascii 500))
    (category (string-ascii 50))
    (milestones (list 10 { title: (string-ascii 100), description: (string-ascii 200), amount: uint }))
    (deadline (optional uint)))
    (let 
        (
            (project-id (var-get next-project-id))
            (total-amount (calculate-total-amount milestones))
            (milestone-count (len milestones))
        )
        (asserts! (> milestone-count u0) ERR-EMPTY-MILESTONES)
        (asserts! (> total-amount u0) ERR-INVALID-MILESTONES)
        
        ;; Store project details
        (map-set project-details 
            { project-id: project-id }
            {
                owner: tx-sender,
                title: title,
                description: description,
                category: category,
                developer: none,
                total-amount: total-amount,
                milestone-count: milestone-count,
                status: "open",
                created-at: stacks-block-height,
                selected-at: none,
                deadline: deadline
            }
        )
        
        ;; Setup milestones
        (try! (setup-milestones project-id milestones))
        
        ;; Initialize escrow tracking
        (map-set project-escrow
            { project-id: project-id }
            {
                total-locked: u0,
                total-paid: u0,
                is-fully-released: false
            }
        )
        
        (var-set next-project-id (+ project-id u1))
        (ok project-id)
    )
)

;; Owner selects developer and locks total funds in escrow
(define-public (select-developer (project-id uint) (developer-address principal))
    (let 
        (
            (project (unwrap! (map-get? project-details { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
            (escrow (unwrap! (map-get? project-escrow { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner project)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status project) "open") ERR-PROJECT-NOT-ACTIVE)
        (asserts! (is-none (get developer project)) ERR-DEVELOPER-ALREADY-SELECTED)
        
        ;; Lock total project funds in contract escrow
        (try! (stx-transfer? (get total-amount project) tx-sender (as-contract tx-sender)))
        
        ;; Update project with selected developer
        (map-set project-details 
            { project-id: project-id }
            (merge project { 
                developer: (some developer-address),
                status: "active",
                selected-at: (some stacks-block-height)
            })
        )
        
        ;; Update escrow
        (map-set project-escrow
            { project-id: project-id }
            (merge escrow { 
                total-locked: (get total-amount project)
            })
        )
        
        (ok true)
    )
)

;; Owner approves milestone completion and releases payment
(define-public (approve-milestone (project-id uint) (milestone-index uint))
    (let 
        (
            (project (unwrap! (map-get? project-details { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
            (milestone (unwrap! (map-get? milestone-details { project-id: project-id, milestone-index: milestone-index }) ERR-MILESTONE-OUT-OF-BOUNDS))
            (escrow (unwrap! (map-get? project-escrow { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner project)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status project) "active") ERR-PROJECT-NOT-ACTIVE)
        (asserts! (< milestone-index (get milestone-count project)) ERR-MILESTONE-OUT-OF-BOUNDS)
        (asserts! (not (get is-paid milestone)) ERR-MILESTONE-ALREADY-PAID)
        (asserts! (is-some (get developer project)) ERR-NO-DEVELOPER-SELECTED)
        
        ;; Transfer milestone payment to developer
        (try! (as-contract (stx-transfer? (get amount milestone) tx-sender (unwrap-panic (get developer project)))))
        
        ;; Mark milestone as paid
        (map-set milestone-details 
            { project-id: project-id, milestone-index: milestone-index }
            (merge milestone { 
                is-paid: true,
                completed-at: (some stacks-block-height)
            })
        )
        
        ;; Update escrow tracking
        (let 
            ((new-total-paid (+ (get total-paid escrow) (get amount milestone))))
            (map-set project-escrow
                { project-id: project-id }
                (merge escrow { 
                    total-paid: new-total-paid,
                    is-fully-released: (is-eq new-total-paid (get total-locked escrow))
                })
            )
        )
        
        (ok true)
    )
)

;; Cancel project (only if no developer selected)
(define-public (cancel-project (project-id uint))
    (let 
        (
            (project (unwrap! (map-get? project-details { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner project)) ERR-NOT-OWNER)
        (asserts! (is-none (get developer project)) ERR-DEVELOPER-ALREADY-SELECTED)
        
        ;; Update status to cancelled
        (map-set project-details 
            { project-id: project-id }
            (merge project { status: "cancelled" })
        )
        
        (ok true)
    )
)

;; read only functions
(define-read-only (get-project (project-id uint))
    (map-get? project-details { project-id: project-id })
)

(define-read-only (get-milestone (project-id uint) (milestone-index uint))
    (map-get? milestone-details { project-id: project-id, milestone-index: milestone-index })
)

(define-read-only (get-project-escrow (project-id uint))
    (map-get? project-escrow { project-id: project-id })
)

(define-read-only (get-project-full-details (project-id uint))
    (match (map-get? project-details { project-id: project-id })
        project-info
        (match (map-get? project-escrow { project-id: project-id })
            escrow-info
            (some {
                project-id: project-id,
                owner: (get owner project-info),
                title: (get title project-info),
                description: (get description project-info),
                category: (get category project-info),
                developer: (get developer project-info),
                total-amount: (get total-amount project-info),
                milestone-count: (get milestone-count project-info),
                status: (get status project-info),
                created-at: (get created-at project-info),
                selected-at: (get selected-at project-info),
                deadline: (get deadline project-info),
                total-locked: (get total-locked escrow-info),
                total-paid: (get total-paid escrow-info),
                is-fully-released: (get is-fully-released escrow-info)
            })
            none
        )
        none
    )
)

(define-read-only (get-project-progress (project-id uint))
    (match (map-get? project-details { project-id: project-id })
        project 
        (let 
            (
                (milestone-count (get milestone-count project))
                (paid-count (get-paid-milestone-count project-id milestone-count))
            )
            (some { 
                total-milestones: milestone-count,
                paid-milestones: paid-count,
                progress-percentage: (if (> milestone-count u0) (/ (* paid-count u100) milestone-count) u0)
            })
        )
        none
    )
)

(define-read-only (get-paid-milestone-count (project-id uint) (total-count uint))
    (let 
        (
            (milestone-0 (if (< u0 total-count) (if (is-milestone-paid project-id u0) u1 u0) u0))
            (milestone-1 (if (< u1 total-count) (if (is-milestone-paid project-id u1) u1 u0) u0))
            (milestone-2 (if (< u2 total-count) (if (is-milestone-paid project-id u2) u1 u0) u0))
            (milestone-3 (if (< u3 total-count) (if (is-milestone-paid project-id u3) u1 u0) u0))
            (milestone-4 (if (< u4 total-count) (if (is-milestone-paid project-id u4) u1 u0) u0))
            (milestone-5 (if (< u5 total-count) (if (is-milestone-paid project-id u5) u1 u0) u0))
            (milestone-6 (if (< u6 total-count) (if (is-milestone-paid project-id u6) u1 u0) u0))
            (milestone-7 (if (< u7 total-count) (if (is-milestone-paid project-id u7) u1 u0) u0))
            (milestone-8 (if (< u8 total-count) (if (is-milestone-paid project-id u8) u1 u0) u0))
            (milestone-9 (if (< u9 total-count) (if (is-milestone-paid project-id u9) u1 u0) u0))
        )
        (+ milestone-0 milestone-1 milestone-2 milestone-3 milestone-4 milestone-5 milestone-6 milestone-7 milestone-8 milestone-9)
    )
)

;; Remove the private function
;; (define-private (count-paid-milestones (milestone-index uint) (acc uint))
;;     (if (< milestone-index total-count)
;;         (if (is-milestone-paid project-id milestone-index) 
;;             (+ acc u1) 
;;             acc)
;;         acc
;;     )
;; )

(define-read-only (is-milestone-paid (project-id uint) (milestone-index uint))
    (match (map-get? milestone-details { project-id: project-id, milestone-index: milestone-index })
        milestone-info
        (get is-paid milestone-info)
        false
    )
)

(define-read-only (get-next-project-id)
    (var-get next-project-id)
)

(define-read-only (get-project-count)
    (- (var-get next-project-id) u1)
)

(define-read-only (is-project-open (project-id uint))
    (match (map-get? project-details { project-id: project-id })
        project-info
        (is-eq (get status project-info) "open")
        false
    )
)

(define-read-only (get-contract-balance)
    (stx-get-balance (as-contract tx-sender))
)

;; private functions
;;
