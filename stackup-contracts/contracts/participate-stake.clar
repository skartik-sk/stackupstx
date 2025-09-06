;; title: stackup-application-staking
;; version: 1.0.0
;; summary: Application limit and staking system for the Stack Up platform
;; description: Manages user application limits and allows staking STX for additional attempts

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-INSUFFICIENT-STAKE (err u300))
(define-constant ERR-NO-STAKE-TO-CLAIM (err u301))
(define-constant ERR-INVALID-AMOUNT (err u302))
(define-constant ERR-APPLICATION-LIMIT-REACHED (err u303))

;; data vars
(define-data-var monthly-limit uint u4)
(define-data-var stake-fee uint u1000000) ;; 1 STX in microSTX
(define-data-var blocks-per-month uint u4320) ;; Approximate blocks in 30 days (assuming 10min blocks)

;; data maps
(define-map application-count 
    { user: principal } 
    { 
        count: uint, 
        last-reset: uint 
    }
)

(define-map staker-balance 
    { user: principal } 
    { 
        amount: uint 
    }
)

;; public functions
(define-public (stake-for-applications (amount uint))
    (begin
        (asserts! (> amount u0) ERR-INVALID-AMOUNT)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (let 
            (
                (current-balance (default-to u0 (get amount (map-get? staker-balance { user: tx-sender }))))
            )
            (map-set staker-balance 
                { user: tx-sender }
                { amount: (+ current-balance amount) }
            )
            (ok amount)
        )
    )
)

(define-public (reset-application-count)
    (let 
        (
            (current-balance (default-to u0 (get amount (map-get? staker-balance { user: tx-sender }))))
            (fee (var-get stake-fee))
        )
        (asserts! (>= current-balance fee) ERR-INSUFFICIENT-STAKE)
        
        ;; Deduct the stake fee
        (map-set staker-balance 
            { user: tx-sender }
            { amount: (- current-balance fee) }
        )
        
        ;; Reset application count
        (map-set application-count 
            { user: tx-sender }
            { 
                count: u0, 
                last-reset: stacks-block-height 
            }
        )
        
        (ok true)
    )
)

(define-public (claim-stake)
    (let 
        (
            (current-balance (default-to u0 (get amount (map-get? staker-balance { user: tx-sender }))))
        )
        (asserts! (> current-balance u0) ERR-NO-STAKE-TO-CLAIM)
        
        ;; Transfer stake back to user
        (try! (as-contract (stx-transfer? current-balance tx-sender tx-sender)))
        
        ;; Reset balance to zero
        (map-set staker-balance 
            { user: tx-sender }
            { amount: u0 }
        )
        
        (ok current-balance)
    )
)

(define-public (apply-for-opportunity)
    (let 
        (
            (user-data (default-to { count: u0, last-reset: u0 } 
                       (map-get? application-count { user: tx-sender })))
            (current-count (get count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (blocks-per-month-val (var-get blocks-per-month))
        )
        ;; Check if month has passed since last reset
        (let 
            (
                (should-reset (>= (- stacks-block-height last-reset) blocks-per-month-val))
                (effective-count (if should-reset u0 current-count))
            )
            (asserts! (< effective-count monthly-limit-val) ERR-APPLICATION-LIMIT-REACHED)
            
            ;; Update application count
            (map-set application-count 
                { user: tx-sender }
                { 
                    count: (+ effective-count u1),
                    last-reset: (if should-reset stacks-block-height last-reset)
                }
            )
            
            (ok true)
        )
    )
)

;; read only functions
(define-read-only (get-application-status (user principal))
    (let 
        (
            (user-data (default-to { count: u0, last-reset: u0 } 
                       (map-get? application-count { user: user })))
            (current-count (get count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (blocks-per-month-val (var-get blocks-per-month))
            (should-reset (>= (- stacks-block-height last-reset) blocks-per-month-val))
            (effective-count (if should-reset u0 current-count))
        )
        {
            current-applications: effective-count,
            monthly-limit: monthly-limit-val,
            applications-remaining: (if (< effective-count monthly-limit-val) 
                                   (- monthly-limit-val effective-count) 
                                   u0),
            at-limit: (>= effective-count monthly-limit-val),
            last-reset: last-reset,
            blocks-until-reset: (if should-reset 
                                u0 
                                (- blocks-per-month-val (- stacks-block-height last-reset)))
        }
    )
)

(define-read-only (get-staker-balance (user principal))
    (default-to u0 (get amount (map-get? staker-balance { user: user })))
)

(define-read-only (get-stake-fee)
    (var-get stake-fee)
)

(define-read-only (get-monthly-limit)
    (var-get monthly-limit)
)

;; private functions
;;

