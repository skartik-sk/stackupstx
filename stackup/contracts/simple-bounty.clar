;; Simple Bounty Contract for Testing
;; This is a minimal contract for testing the StackUp platform

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-BOUNTY-NOT-FOUND (err u101))
(define-constant ERR-INVALID-AMOUNT (err u102))

(define-data-var bounty-counter uint u0)

(define-map bounties
  uint
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-ascii 500),
    amount: uint,
    completed: bool
  }
)

;; Create a new bounty
(define-public (create-bounty (title (string-ascii 100)) (description (string-ascii 500)) (amount uint))
  (let ((bounty-id (+ (var-get bounty-counter) u1)))
    (begin
      (asserts! (> amount u0) ERR-INVALID-AMOUNT)
      (map-set bounties bounty-id {
        creator: tx-sender,
        title: title,
        description: description,
        amount: amount,
        completed: false
      })
      (var-set bounty-counter bounty-id)
      (ok bounty-id)
    )
  )
)

;; Get bounty details
(define-read-only (get-bounty (bounty-id uint))
  (map-get? bounties bounty-id)
)

;; Get bounty counter
(define-read-only (get-bounty-counter)
  (var-get bounty-counter)
)

;; Award bounty (simplified)
(define-public (award-bounty (bounty-id uint) (recipient principal))
  (let ((bounty (unwrap! (map-get? bounties bounty-id) ERR-BOUNTY-NOT-FOUND)))
    (begin
      (asserts! (is-eq (get creator bounty) tx-sender) ERR-NOT-AUTHORIZED)
      (asserts! (not (get completed bounty)) ERR-BOUNTY-NOT-FOUND)
      (map-set bounties bounty-id (merge bounty { completed: true }))
      (ok true)
    )
  )
)
