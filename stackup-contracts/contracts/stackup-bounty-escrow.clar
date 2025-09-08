;; title: stackup-bounty-escrow
;; version: 3.0.0
;; summary: Enhanced bounty system with proper escrow and automatic payments
;; description: Secure bounty management where funds are locked until winner is selected and paid automatically

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-BOUNTY-NOT-FOUND (err u101))
(define-constant ERR-BOUNTY-ALREADY-COMPLETED (err u102))
(define-constant ERR-BOUNTY-ALREADY-CANCELLED (err u103))
(define-constant ERR-INVALID-AMOUNT (err u104))
(define-constant ERR-WINNER-ALREADY-SELECTED (err u105))
(define-constant ERR-NO-WINNER-SELECTED (err u106))
(define-constant ERR-UNAUTHORIZED (err u107))

;; data vars
(define-data-var next-bounty-id uint u1)
(define-data-var contract-owner principal tx-sender)

;; data maps
(define-map bounty-details 
    { bounty-id: uint } 
    { 
        owner: principal,
        title: (string-ascii 100),
        description: (string-ascii 500),
        category: (string-ascii 50),
        amount: uint,
        winner: (optional principal),
        status: (string-ascii 15),
        created-at: uint,
        completed-at: (optional uint),
        deadline: (optional uint)
    }
)

;; Escrow tracking - tracks locked funds per bounty
(define-map bounty-escrow
    { bounty-id: uint }
    { 
        locked-amount: uint,
        is-released: bool
    }
)

;; public functions

;; Create a new bounty with locked escrow
(define-public (create-bounty 
    (title (string-ascii 100)) 
    (description (string-ascii 500))
    (category (string-ascii 50))
    (amount uint)
    (deadline (optional uint)))
    (let 
        (
            (bounty-id (var-get next-bounty-id))
        )
        (asserts! (> amount u0) ERR-INVALID-AMOUNT)
        
        ;; Transfer STX from owner to contract (escrow)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        
        ;; Store bounty details
        (map-set bounty-details 
            { bounty-id: bounty-id }
            {
                owner: tx-sender,
                title: title,
                description: description,
                category: category,
                amount: amount,
                winner: none,
                status: "open",
                created-at: stacks-block-height,
                completed-at: none,
                deadline: deadline
            }
        )
        
        ;; Track escrow
        (map-set bounty-escrow
            { bounty-id: bounty-id }
            {
                locked-amount: amount,
                is-released: false
            }
        )
        
        (var-set next-bounty-id (+ bounty-id u1))
        (ok bounty-id)
    )
)

;; Owner selects winner and funds automatically transfer
(define-public (select-winner (bounty-id uint) (winner-address principal))
    (let 
        (
            (bounty (unwrap! (map-get? bounty-details { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
            (escrow (unwrap! (map-get? bounty-escrow { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner bounty)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status bounty) "open") ERR-BOUNTY-ALREADY-COMPLETED)
        (asserts! (is-none (get winner bounty)) ERR-WINNER-ALREADY-SELECTED)
        (asserts! (not (get is-released escrow)) ERR-BOUNTY-ALREADY-COMPLETED)
        
        ;; Transfer funds directly to winner
        (try! (as-contract (stx-transfer? (get locked-amount escrow) tx-sender winner-address)))
        
        ;; Update bounty with winner and completed status
        (map-set bounty-details 
            { bounty-id: bounty-id }
            (merge bounty { 
                winner: (some winner-address),
                status: "completed",
                completed-at: (some stacks-block-height)
            })
        )
        
        ;; Mark escrow as released
        (map-set bounty-escrow
            { bounty-id: bounty-id }
            (merge escrow { is-released: true })
        )
        
        (ok true)
    )
)

;; Cancel bounty and refund owner (only if no winner selected)
(define-public (cancel-bounty (bounty-id uint))
    (let 
        (
            (bounty (unwrap! (map-get? bounty-details { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
            (escrow (unwrap! (map-get? bounty-escrow { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner bounty)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status bounty) "open") ERR-BOUNTY-ALREADY-CANCELLED)
        (asserts! (is-none (get winner bounty)) ERR-WINNER-ALREADY-SELECTED)
        (asserts! (not (get is-released escrow)) ERR-BOUNTY-ALREADY-COMPLETED)
        
        ;; Refund owner
        (try! (as-contract (stx-transfer? (get locked-amount escrow) tx-sender (get owner bounty))))
        
        ;; Update status
        (map-set bounty-details 
            { bounty-id: bounty-id }
            (merge bounty { status: "cancelled" })
        )
        
        ;; Mark escrow as released
        (map-set bounty-escrow
            { bounty-id: bounty-id }
            (merge escrow { is-released: true })
        )
        
        (ok true)
    )
)

;; read only functions
(define-read-only (get-bounty (bounty-id uint))
    (map-get? bounty-details { bounty-id: bounty-id })
)

(define-read-only (get-bounty-escrow (bounty-id uint))
    (map-get? bounty-escrow { bounty-id: bounty-id })
)

(define-read-only (get-bounty-full-details (bounty-id uint))
    (match (map-get? bounty-details { bounty-id: bounty-id })
        bounty-info
        (match (map-get? bounty-escrow { bounty-id: bounty-id })
            escrow-info
            (some {
                bounty-id: bounty-id,
                owner: (get owner bounty-info),
                title: (get title bounty-info),
                description: (get description bounty-info),
                category: (get category bounty-info),
                amount: (get amount bounty-info),
                winner: (get winner bounty-info),
                status: (get status bounty-info),
                created-at: (get created-at bounty-info),
                completed-at: (get completed-at bounty-info),
                deadline: (get deadline bounty-info),
                locked-amount: (get locked-amount escrow-info),
                is-released: (get is-released escrow-info)
            })
            none
        )
        none
    )
)

(define-read-only (get-next-bounty-id)
    (var-get next-bounty-id)
)

(define-read-only (get-bounty-count)
    (- (var-get next-bounty-id) u1)
)

(define-read-only (is-bounty-open (bounty-id uint))
    (match (map-get? bounty-details { bounty-id: bounty-id })
        bounty-info
        (is-eq (get status bounty-info) "open")
        false
    )
)

(define-read-only (get-contract-balance)
    (stx-get-balance (as-contract tx-sender))
)

;; Get bounties by owner
(define-read-only (is-bounty-owner (bounty-id uint) (user principal))
    (match (map-get? bounty-details { bounty-id: bounty-id })
        bounty-info
        (is-eq (get owner bounty-info) user)
        false
    )
)

;; private functions
;;
