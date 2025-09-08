;; title: stackup-grant-escrow
;; version: 3.0.0
;; summary: Enhanced grant system with 50% upfront and 50% completion payments with escrow
;; description: Secure grant management with automatic 50/50 payment structure

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u200))
(define-constant ERR-GRANT-NOT-FOUND (err u201))
(define-constant ERR-GRANT-NOT-ACTIVE (err u202))
(define-constant ERR-RECIPIENT-ALREADY-SELECTED (err u203))
(define-constant ERR-GRANT-ALREADY-COMPLETED (err u204))
(define-constant ERR-NO-RECIPIENT-SELECTED (err u205))
(define-constant ERR-UPFRONT-ALREADY-PAID (err u206))
(define-constant ERR-FINAL-ALREADY-PAID (err u207))
(define-constant ERR-UPFRONT-NOT-PAID (err u208))
(define-constant ERR-INVALID-AMOUNT (err u209))
(define-constant ERR-INSUFFICIENT-FUNDS (err u210))

;; data vars
(define-data-var next-grant-id uint u1)
(define-data-var contract-owner principal tx-sender)

;; data maps
(define-map grant-details 
    { grant-id: uint } 
    { 
        owner: principal,
        title: (string-ascii 100),
        description: (string-ascii 500),
        category: (string-ascii 50),
        recipient: (optional principal),
        total-amount: uint,
        upfront-amount: uint,
        final-amount: uint,
        status: (string-ascii 15),
        created-at: uint,
        selected-at: (optional uint),
        completed-at: (optional uint),
        deadline: (optional uint)
    }
)

;; Grant payment tracking
(define-map grant-payments
    { grant-id: uint }
    {
        upfront-paid: bool,
        upfront-paid-at: (optional uint),
        final-paid: bool,
        final-paid-at: (optional uint),
        total-paid: uint
    }
)

;; Grant escrow tracking
(define-map grant-escrow
    { grant-id: uint }
    {
        total-locked: uint,
        is-fully-released: bool
    }
)

;; public functions

;; Create a grant and lock funds in escrow immediately
(define-public (create-grant 
    (title (string-ascii 100)) 
    (description (string-ascii 500))
    (category (string-ascii 50))
    (total-amount uint)
    (deadline (optional uint)))
    (let 
        (
            (grant-id (var-get next-grant-id))
            (upfront-amount (/ total-amount u2))  ;; 50% upfront
            (final-amount (- total-amount upfront-amount))  ;; Remaining amount (handles odd numbers)
        )
        (asserts! (> total-amount u1) ERR-INVALID-AMOUNT) ;; Must be at least 2 microSTX for 50/50 split
        
        ;; Lock total amount in escrow immediately
        (try! (stx-transfer? total-amount tx-sender (as-contract tx-sender)))
        
        ;; Store grant details
        (map-set grant-details 
            { grant-id: grant-id }
            {
                owner: tx-sender,
                title: title,
                description: description,
                category: category,
                recipient: none,
                total-amount: total-amount,
                upfront-amount: upfront-amount,
                final-amount: final-amount,
                status: "open",
                created-at: stacks-block-height,
                selected-at: none,
                completed-at: none,
                deadline: deadline
            }
        )
        
        ;; Initialize payment tracking
        (map-set grant-payments
            { grant-id: grant-id }
            {
                upfront-paid: false,
                upfront-paid-at: none,
                final-paid: false,
                final-paid-at: none,
                total-paid: u0
            }
        )
        
        ;; Initialize escrow tracking with funds already locked
        (map-set grant-escrow
            { grant-id: grant-id }
            {
                total-locked: total-amount,
                is-fully-released: false
            }
        )
        
        (var-set next-grant-id (+ grant-id u1))
        (ok grant-id)
    )
)

;; Owner selects recipient and pays 50% upfront immediately
(define-public (select-recipient (grant-id uint) (recipient-address principal))
    (let 
        (
            (grant (unwrap! (map-get? grant-details { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (payments (unwrap! (map-get? grant-payments { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (escrow (unwrap! (map-get? grant-escrow { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner grant)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status grant) "open") ERR-GRANT-NOT-ACTIVE)
        (asserts! (is-none (get recipient grant)) ERR-RECIPIENT-ALREADY-SELECTED)
        
        ;; Pay 50% upfront to recipient (funds already in escrow)
        (try! (as-contract (stx-transfer? (get upfront-amount grant) tx-sender recipient-address)))
        
        ;; Update grant with recipient
        (map-set grant-details 
            { grant-id: grant-id }
            (merge grant { 
                recipient: (some recipient-address),
                status: "active",
                selected-at: (some stacks-block-height)
            })
        )
        
        ;; Update payment tracking
        (map-set grant-payments
            { grant-id: grant-id }
            (merge payments {
                upfront-paid: true,
                upfront-paid-at: (some stacks-block-height),
                total-paid: (get upfront-amount grant)
            })
        )
        
        (ok true)
    )
)

;; Owner approves completion and releases final 50%
(define-public (approve-completion (grant-id uint))
    (let 
        (
            (grant (unwrap! (map-get? grant-details { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (payments (unwrap! (map-get? grant-payments { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (escrow (unwrap! (map-get? grant-escrow { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner grant)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status grant) "active") ERR-GRANT-NOT-ACTIVE)
        (asserts! (is-some (get recipient grant)) ERR-NO-RECIPIENT-SELECTED)
        (asserts! (get upfront-paid payments) ERR-UPFRONT-NOT-PAID)
        (asserts! (not (get final-paid payments)) ERR-FINAL-ALREADY-PAID)
        
        ;; Transfer final amount to recipient
        (try! (as-contract (stx-transfer? (get final-amount grant) tx-sender (unwrap-panic (get recipient grant)))))
        
        ;; Mark as completed
        (map-set grant-details 
            { grant-id: grant-id }
            (merge grant { 
                status: "completed",
                completed-at: (some stacks-block-height)
            })
        )
        
        ;; Update payment tracking
        (map-set grant-payments
            { grant-id: grant-id }
            (merge payments {
                final-paid: true,
                final-paid-at: (some stacks-block-height),
                total-paid: (get total-amount grant)
            })
        )
        
        ;; Update escrow tracking
        (map-set grant-escrow
            { grant-id: grant-id }
            (merge escrow {
                is-fully-released: true
            })
        )
        
        (ok true)
    )
)

;; Cancel grant and refund if recipient selected
(define-public (cancel-grant (grant-id uint))
    (let 
        (
            (grant (unwrap! (map-get? grant-details { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (payments (unwrap! (map-get? grant-payments { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
            (escrow (unwrap! (map-get? grant-escrow { grant-id: grant-id }) ERR-GRANT-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner grant)) ERR-NOT-OWNER)
        (asserts! (not (is-eq (get status grant) "completed")) ERR-GRANT-ALREADY-COMPLETED)
        (asserts! (not (is-eq (get status grant) "cancelled")) ERR-GRANT-NOT-ACTIVE)
        
        ;; If recipient was selected and funds locked, refund remaining amount to owner
        (if (and (is-some (get recipient grant)) (> (get total-locked escrow) u0))
            (begin
                ;; Calculate refund amount (total locked minus what's already paid)
                (let ((refund-amount (- (get total-locked escrow) (get total-paid payments))))
                    (if (> refund-amount u0)
                        (try! (as-contract (stx-transfer? refund-amount tx-sender (get owner grant))))
                        true
                    )
                )
            )
            true
        )
        
        ;; Update status to cancelled
        (map-set grant-details 
            { grant-id: grant-id }
            (merge grant { status: "cancelled" })
        )
        
        (ok true)
    )
)

;; read only functions
(define-read-only (get-grant (grant-id uint))
    (map-get? grant-details { grant-id: grant-id })
)

(define-read-only (get-grant-payments (grant-id uint))
    (map-get? grant-payments { grant-id: grant-id })
)

(define-read-only (get-grant-escrow (grant-id uint))
    (map-get? grant-escrow { grant-id: grant-id })
)

(define-read-only (get-grant-full-details (grant-id uint))
    (match (map-get? grant-details { grant-id: grant-id })
        grant-info
        (match (map-get? grant-payments { grant-id: grant-id })
            payment-info
            (match (map-get? grant-escrow { grant-id: grant-id })
                escrow-info
                (some {
                    grant-id: grant-id,
                    owner: (get owner grant-info),
                    title: (get title grant-info),
                    description: (get description grant-info),
                    category: (get category grant-info),
                    recipient: (get recipient grant-info),
                    total-amount: (get total-amount grant-info),
                    upfront-amount: (get upfront-amount grant-info),
                    final-amount: (get final-amount grant-info),
                    status: (get status grant-info),
                    created-at: (get created-at grant-info),
                    selected-at: (get selected-at grant-info),
                    completed-at: (get completed-at grant-info),
                    deadline: (get deadline grant-info),
                    upfront-paid: (get upfront-paid payment-info),
                    upfront-paid-at: (get upfront-paid-at payment-info),
                    final-paid: (get final-paid payment-info),
                    final-paid-at: (get final-paid-at payment-info),
                    total-paid: (get total-paid payment-info),
                    total-locked: (get total-locked escrow-info),
                    is-fully-released: (get is-fully-released escrow-info)
                })
                none
            )
            none
        )
        none
    )
)

(define-read-only (get-grant-payment-status (grant-id uint))
    (match (map-get? grant-details { grant-id: grant-id })
        grant-info
        (match (map-get? grant-payments { grant-id: grant-id })
            payment-info
            (some {
                upfront-paid: (get upfront-paid payment-info),
                final-paid: (get final-paid payment-info),
                upfront-amount: (get upfront-amount grant-info),
                final-amount: (get final-amount grant-info),
                total-paid: (get total-paid payment-info),
                completion-percentage: (if (get final-paid payment-info) u100 (if (get upfront-paid payment-info) u50 u0))
            })
            none
        )
        none
    )
)

(define-read-only (get-next-grant-id)
    (var-get next-grant-id)
)

(define-read-only (get-grant-count)
    (- (var-get next-grant-id) u1)
)

(define-read-only (is-grant-open (grant-id uint))
    (match (map-get? grant-details { grant-id: grant-id })
        grant-info
        (is-eq (get status grant-info) "open")
        false
    )
)

(define-read-only (get-contract-balance)
    (stx-get-balance (as-contract tx-sender))
)

;; Check if user is grant owner
(define-read-only (is-grant-owner (grant-id uint) (user principal))
    (match (map-get? grant-details { grant-id: grant-id })
        grant-info
        (is-eq (get owner grant-info) user)
        false
    )
)

;; Get upfront amount for a grant
(define-read-only (get-upfront-amount (grant-id uint))
    (match (map-get? grant-details { grant-id: grant-id })
        grant-info
        (get upfront-amount grant-info)
        u0
    )
)

;; private functions
;;
