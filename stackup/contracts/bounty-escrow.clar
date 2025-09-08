;; Bounty Escrow Contract
;; A simple escrow contract for handling bounty payments

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_BOUNTY_NOT_FOUND (err u101))
(define-constant ERR_BOUNTY_ALREADY_COMPLETED (err u102))
(define-constant ERR_INSUFFICIENT_FUNDS (err u103))
(define-constant ERR_INVALID_RECIPIENT (err u104))

;; Define data variables
(define-data-var bounty-counter uint u0)

;; Define data maps
(define-map bounties
  { bounty-id: uint }
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-ascii 500),
    reward-amount: uint,
    recipient: (optional principal),
    completed: bool,
    created-at: uint
  }
)

(define-map bounty-funds
  { bounty-id: uint }
  { amount: uint }
)

;; Public functions

;; Create a new bounty
(define-public (create-bounty (title (string-ascii 100)) (description (string-ascii 500)) (reward-amount uint))
  (let
    (
      (bounty-id (+ (var-get bounty-counter) u1))
      (creator tx-sender)
    )
    (try! (stx-transfer? reward-amount creator (as-contract tx-sender)))
    (map-set bounties
      { bounty-id: bounty-id }
      {
        creator: creator,
        title: title,
        description: description,
        reward-amount: reward-amount,
        recipient: none,
        completed: false,
        created-at: block-height
      }
    )
    (map-set bounty-funds
      { bounty-id: bounty-id }
      { amount: reward-amount }
    )
    (var-set bounty-counter bounty-id)
    (ok bounty-id)
  )
)

;; Award bounty to a recipient
(define-public (award-bounty (bounty-id uint) (recipient principal))
  (let
    (
      (bounty (unwrap! (map-get? bounties { bounty-id: bounty-id }) ERR_BOUNTY_NOT_FOUND))
      (funds (unwrap! (map-get? bounty-funds { bounty-id: bounty-id }) ERR_BOUNTY_NOT_FOUND))
    )
    (asserts! (is-eq tx-sender (get creator bounty)) ERR_NOT_AUTHORIZED)
    (asserts! (not (get completed bounty)) ERR_BOUNTY_ALREADY_COMPLETED)
    (asserts! (> (get amount funds) u0) ERR_INSUFFICIENT_FUNDS)
    
    ;; Transfer funds to recipient
    (try! (as-contract (stx-transfer? (get amount funds) tx-sender recipient)))
    
    ;; Update bounty status
    (map-set bounties
      { bounty-id: bounty-id }
      (merge bounty { recipient: (some recipient), completed: true })
    )
    
    ;; Clear funds
    (map-set bounty-funds
      { bounty-id: bounty-id }
      { amount: u0 }
    )
    
    (ok true)
  )
)

;; Cancel bounty and refund creator
(define-public (cancel-bounty (bounty-id uint))
  (let
    (
      (bounty (unwrap! (map-get? bounties { bounty-id: bounty-id }) ERR_BOUNTY_NOT_FOUND))
      (funds (unwrap! (map-get? bounty-funds { bounty-id: bounty-id }) ERR_BOUNTY_NOT_FOUND))
    )
    (asserts! (is-eq tx-sender (get creator bounty)) ERR_NOT_AUTHORIZED)
    (asserts! (not (get completed bounty)) ERR_BOUNTY_ALREADY_COMPLETED)
    (asserts! (> (get amount funds) u0) ERR_INSUFFICIENT_FUNDS)
    
    ;; Refund creator
    (try! (as-contract (stx-transfer? (get amount funds) tx-sender (get creator bounty))))
    
    ;; Update bounty status
    (map-set bounties
      { bounty-id: bounty-id }
      (merge bounty { completed: true })
    )
    
    ;; Clear funds
    (map-set bounty-funds
      { bounty-id: bounty-id }
      { amount: u0 }
    )
    
    (ok true)
  )
)

;; Read-only functions

;; Get bounty details
(define-read-only (get-bounty (bounty-id uint))
  (map-get? bounties { bounty-id: bounty-id })
)

;; Get bounty funds
(define-read-only (get-bounty-funds (bounty-id uint))
  (map-get? bounty-funds { bounty-id: bounty-id })
)

;; Get total bounties created
(define-read-only (get-bounty-counter)
  (var-get bounty-counter)
)

;; Get contract balance
(define-read-only (get-contract-balance)
  (stx-get-balance (as-contract tx-sender))
)
