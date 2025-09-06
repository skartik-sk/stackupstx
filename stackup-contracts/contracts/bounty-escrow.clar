;; title: stackup-bounty-escrow
;; version: 1.0.0
;; summary: Escrow contract for one-time bounty payments in the Stack Up platform
;; description: Manages the creation, approval, and cancellation of bounties with secure escrow functionality

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-BOUNTY-NOT-FOUND (err u101))
(define-constant ERR-BOUNTY-ALREADY-APPROVED (err u102))
(define-constant ERR-BOUNTY-ALREADY-CANCELLED (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))
(define-constant ERR-INVALID-AMOUNT (err u105))

;; data vars
(define-data-var next-bounty-id uint u1)

;; data maps
(define-map bounty-data 
    { bounty-id: uint } 
    { 
        amount: uint, 
        owner: principal, 
        worker: principal, 
        status: (string-ascii 10) 
    }
)

;; public functions
(define-public (create-bounty (worker principal) (amount uint))
    (let 
        (
            (bounty-id (var-get next-bounty-id))
        )
        (asserts! (> amount u0) ERR-INVALID-AMOUNT)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (map-set bounty-data 
            { bounty-id: bounty-id }
            {
                amount: amount,
                owner: tx-sender,
                worker: worker,
                status: "active"
            }
        )
        (var-set next-bounty-id (+ bounty-id u1))
        (ok bounty-id)
    )
)

(define-public (approve-bounty (bounty-id uint))
    (let 
        (
            (bounty (unwrap! (map-get? bounty-data { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner bounty)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status bounty) "active") ERR-BOUNTY-ALREADY-APPROVED)
        (try! (as-contract (stx-transfer? (get amount bounty) tx-sender (get worker bounty))))
        (map-set bounty-data 
            { bounty-id: bounty-id }
            (merge bounty { status: "approved" })
        )
        (ok true)
    )
)

(define-public (cancel-bounty (bounty-id uint))
    (let 
        (
            (bounty (unwrap! (map-get? bounty-data { bounty-id: bounty-id }) ERR-BOUNTY-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner bounty)) ERR-NOT-OWNER)
        (asserts! (is-eq (get status bounty) "active") ERR-BOUNTY-ALREADY-CANCELLED)
        (try! (as-contract (stx-transfer? (get amount bounty) tx-sender (get owner bounty))))
        (map-set bounty-data 
            { bounty-id: bounty-id }
            (merge bounty { status: "cancelled" })
        )
        (ok true)
    )
)

;; read only functions
(define-read-only (get-bounty (bounty-id uint))
    (map-get? bounty-data { bounty-id: bounty-id })
)

(define-read-only (get-next-bounty-id)
    (var-get next-bounty-id)
)

;; private functions
;;

