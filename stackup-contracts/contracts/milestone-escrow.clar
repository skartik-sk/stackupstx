;; title: stackup-milestone-escrow
;; version: 1.0.0
;; summary: Escrow contract for milestone-based project payments in the Stack Up platform
;; description: Manages multi-part projects with milestone-based payments and tracking

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u200))
(define-constant ERR-PROJECT-NOT-FOUND (err u201))
(define-constant ERR-MILESTONE-OUT-OF-BOUNDS (err u202))
(define-constant ERR-MILESTONE-ALREADY-PAID (err u203))
(define-constant ERR-INSUFFICIENT-FUNDS (err u204))
(define-constant ERR-INVALID-MILESTONES (err u205))
(define-constant ERR-EMPTY-MILESTONES (err u206))

;; data vars
(define-data-var next-project-id uint u1)

;; data maps
(define-map project-data 
    { project-id: uint } 
    { 
        owner: principal,
        worker: principal,
        total-amount: uint,
        milestone-count: uint,
        status: (string-ascii 10)
    }
)

(define-map milestone-data
    { project-id: uint, milestone-index: uint }
    {
        amount: uint,
        is-paid: bool
    }
)

;; private functions
(define-private (setup-milestone-entry (amount uint) (acc (response { project-id: uint, index: uint } uint)))
    (match acc
        success-data
        (let 
            (
                (project-id (get project-id success-data))
                (index (get index success-data))
            )
            (map-set milestone-data 
                { project-id: project-id, milestone-index: index }
                { amount: amount, is-paid: false }
            )
            (ok { project-id: project-id, index: (+ index u1) })
        )
        error-val (err error-val)
    )
)

(define-private (setup-milestones (project-id uint) (amounts (list 10 uint)) (index uint))
    (fold setup-milestone-entry amounts (ok { project-id: project-id, index: u0 }))
)

;; public functions
(define-public (create-project (worker principal) (milestone-amounts (list 10 uint)))
    (let 
        (
            (project-id (var-get next-project-id))
            (total-amount (fold + milestone-amounts u0))
            (milestone-count (len milestone-amounts))
        )
        (asserts! (> milestone-count u0) ERR-EMPTY-MILESTONES)
        (asserts! (> total-amount u0) ERR-INVALID-MILESTONES)
        (try! (stx-transfer? total-amount tx-sender (as-contract tx-sender)))
        
        ;; Store project data
        (map-set project-data 
            { project-id: project-id }
            {
                owner: tx-sender,
                worker: worker,
                total-amount: total-amount,
                milestone-count: milestone-count,
                status: "active"
            }
        )
        
        ;; Store milestone data
        (try! (setup-milestones project-id milestone-amounts u0))
        
        (var-set next-project-id (+ project-id u1))
        (ok project-id)
    )
)

(define-public (approve-milestone (project-id uint) (milestone-index uint))
    (let 
        (
            (project (unwrap! (map-get? project-data { project-id: project-id }) ERR-PROJECT-NOT-FOUND))
            (milestone (unwrap! (map-get? milestone-data { project-id: project-id, milestone-index: milestone-index }) ERR-MILESTONE-OUT-OF-BOUNDS))
        )
        (asserts! (is-eq tx-sender (get owner project)) ERR-NOT-OWNER)
        (asserts! (< milestone-index (get milestone-count project)) ERR-MILESTONE-OUT-OF-BOUNDS)
        (asserts! (not (get is-paid milestone)) ERR-MILESTONE-ALREADY-PAID)
        
        ;; Transfer funds to worker
        (try! (as-contract (stx-transfer? (get amount milestone) tx-sender (get worker project))))
        
        ;; Mark milestone as paid
        (map-set milestone-data 
            { project-id: project-id, milestone-index: milestone-index }
            (merge milestone { is-paid: true })
        )
        
        (ok true)
    )
)

;; read only functions
(define-read-only (get-project (project-id uint))
    (map-get? project-data { project-id: project-id })
)

(define-read-only (get-milestone (project-id uint) (milestone-index uint))
    (map-get? milestone-data { project-id: project-id, milestone-index: milestone-index })
)

(define-read-only (get-next-project-id)
    (var-get next-project-id)
)

(define-read-only (get-project-progress (project-id uint))
    (match (map-get? project-data { project-id: project-id })
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
            (milestone-0 (map-get? milestone-data { project-id: project-id, milestone-index: u0 }))
            (milestone-1 (map-get? milestone-data { project-id: project-id, milestone-index: u1 }))
            (milestone-2 (map-get? milestone-data { project-id: project-id, milestone-index: u2 }))
            (milestone-3 (map-get? milestone-data { project-id: project-id, milestone-index: u3 }))
            (milestone-4 (map-get? milestone-data { project-id: project-id, milestone-index: u4 }))
        )
        (+ 
            (if (and (is-some milestone-0) (get is-paid (unwrap-panic milestone-0))) u1 u0)
            (if (and (is-some milestone-1) (get is-paid (unwrap-panic milestone-1))) u1 u0)
            (if (and (is-some milestone-2) (get is-paid (unwrap-panic milestone-2))) u1 u0)
            (if (and (is-some milestone-3) (get is-paid (unwrap-panic milestone-3))) u1 u0)
            (if (and (is-some milestone-4) (get is-paid (unwrap-panic milestone-4))) u1 u0)
        )
    )
)

