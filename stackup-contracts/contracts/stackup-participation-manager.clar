;; title: stackup-participation-manager
;; version: 3.0.0
;; summary: Enhanced participation system with monthly limits and payments to platform owner
;; description: Users get 4 free applications per month, pay 1 STX to platform owner for additional attempts

;; traits
;;

;; token definitions
;;

;; constants
(define-constant ERR-NOT-OWNER (err u400))
(define-constant ERR-APPLICATION-LIMIT-REACHED (err u401))
(define-constant ERR-PAYMENT-REQUIRED (err u402))
(define-constant ERR-INSUFFICIENT-PAYMENT (err u403))
(define-constant ERR-UNAUTHORIZED (err u404))
(define-constant ERR-FREE-AVAILABLE (err u405))

;; Platform owner address - replace with your actual address when deploying
(define-constant PLATFORM-OWNER tx-sender)

;; Contract admin
(define-data-var contract-owner principal tx-sender)

;; Configuration
(define-data-var monthly-limit uint u4)
(define-data-var participation-fee uint u1000000) ;; 1 STX in microSTX
(define-data-var blocks-per-month uint u4320) ;; Approximate blocks in 30 days (144 blocks/day * 30)

;; User application tracking
(define-map user-applications 
    { user: principal } 
    { 
        monthly-count: uint,
        total-count: uint,
        last-reset: uint,
        total-paid: uint
    }
)

;; Application history tracking
(define-map application-history
    { user: principal, app-index: uint }
    {
        opportunity-type: (string-ascii 20),
        opportunity-id: uint,
        was-paid: bool,
        timestamp: uint
    }
)

;; User stats
(define-map user-stats
    { user: principal }
    {
        application-index: uint
    }
)

;; Platform stats
(define-data-var total-applications uint u0)
(define-data-var total-paid-applications uint u0)
(define-data-var total-revenue uint u0)

;; Helper functions
(define-private (should-reset-month (last-reset uint))
    (>= (- stacks-block-height last-reset) (var-get blocks-per-month))
)

(define-private (get-user-data (user principal))
    (default-to 
        { monthly-count: u0, total-count: u0, last-reset: u0, total-paid: u0 }
        (map-get? user-applications { user: user })
    )
)

(define-private (get-user-app-index (user principal))
    (match (map-get? user-stats { user: user })
        stats (get application-index stats)
        u0
    )
)

(define-private (increment-user-app-index (user principal))
    (let ((current-index (get-user-app-index user)))
        (map-set user-stats 
            { user: user }
            { application-index: (+ current-index u1) }
        )
        current-index
    )
)

;; public functions

;; Apply for opportunity (free if under monthly limit)
(define-public (apply-for-opportunity (opportunity-type (string-ascii 20)) (opportunity-id uint))
    (let 
        (
            (user-data (get-user-data tx-sender))
            (monthly-count (get monthly-count user-data))
            (total-count (get total-count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (should-reset (should-reset-month last-reset))
            (effective-monthly-count (if should-reset u0 monthly-count))
            (app-index (increment-user-app-index tx-sender))
        )
        ;; Check if user is under free limit
        (asserts! (< effective-monthly-count monthly-limit-val) ERR-APPLICATION-LIMIT-REACHED)
        
        ;; Update user application data
        (map-set user-applications 
            { user: tx-sender }
            { 
                monthly-count: (+ effective-monthly-count u1),
                total-count: (+ total-count u1),
                last-reset: (if should-reset stacks-block-height last-reset),
                total-paid: (get total-paid user-data)
            }
        )
        
        ;; Record application history
        (map-set application-history
            { user: tx-sender, app-index: app-index }
            {
                opportunity-type: opportunity-type,
                opportunity-id: opportunity-id,
                was-paid: false,
                timestamp: stacks-block-height
            }
        )
        
        ;; Update platform stats
        (var-set total-applications (+ (var-get total-applications) u1))
        
        (ok true)
    )
)

;; Pay for additional application attempt (1 STX to platform owner)
(define-public (pay-for-application (opportunity-type (string-ascii 20)) (opportunity-id uint))
    (let 
        (
            (fee (var-get participation-fee))
            (user-data (get-user-data tx-sender))
            (monthly-count (get monthly-count user-data))
            (total-count (get total-count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (should-reset (should-reset-month last-reset))
            (effective-monthly-count (if should-reset u0 monthly-count))
            (app-index (increment-user-app-index tx-sender))
        )
        ;; Must be at or over limit to pay
        (asserts! (>= effective-monthly-count monthly-limit-val) ERR-FREE-AVAILABLE)
        
        ;; Transfer participation fee to platform owner
        (try! (stx-transfer? fee tx-sender PLATFORM-OWNER))
        
        ;; Update user application data
        (map-set user-applications 
            { user: tx-sender }
            { 
                monthly-count: (+ effective-monthly-count u1),
                total-count: (+ total-count u1),
                last-reset: (if should-reset stacks-block-height last-reset),
                total-paid: (+ (get total-paid user-data) fee)
            }
        )
        
        ;; Record application history
        (map-set application-history
            { user: tx-sender, app-index: app-index }
            {
                opportunity-type: opportunity-type,
                opportunity-id: opportunity-id,
                was-paid: true,
                timestamp: stacks-block-height
            }
        )
        
        ;; Update platform stats
        (var-set total-applications (+ (var-get total-applications) u1))
        (var-set total-paid-applications (+ (var-get total-paid-applications) u1))
        (var-set total-revenue (+ (var-get total-revenue) fee))
        
        (ok true)
    )
)

;; Admin function to update monthly limit
(define-public (set-monthly-limit (new-limit uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
        (var-set monthly-limit new-limit)
        (ok true)
    )
)

;; Admin function to update participation fee
(define-public (set-participation-fee (new-fee uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
        (var-set participation-fee new-fee)
        (ok true)
    )
)

;; Emergency reset for testing (admin only)
(define-public (reset-user-data (user principal))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
        (map-set user-applications 
            { user: user }
            { monthly-count: u0, total-count: u0, last-reset: u0, total-paid: u0 }
        )
        (map-set user-stats
            { user: user }
            { application-index: u0 }
        )
        (ok true)
    )
)

;; read only functions

;; Get comprehensive user application status
(define-read-only (get-application-status (user principal))
    (let 
        (
            (user-data (get-user-data user))
            (monthly-count (get monthly-count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (blocks-per-month-val (var-get blocks-per-month))
            (should-reset (should-reset-month last-reset))
            (effective-monthly-count (if should-reset u0 monthly-count))
            (blocks-since-reset (- stacks-block-height last-reset))
        )
        {
            monthly-applications: effective-monthly-count,
            total-applications: (get total-count user-data),
            monthly-limit: monthly-limit-val,
            applications-remaining: (if (< effective-monthly-count monthly-limit-val) 
                                   (- monthly-limit-val effective-monthly-count) 
                                   u0),
            at-monthly-limit: (>= effective-monthly-count monthly-limit-val),
            requires-payment: (>= effective-monthly-count monthly-limit-val),
            last-reset: last-reset,
            blocks-until-reset: (if should-reset 
                                u0 
                                (- blocks-per-month-val blocks-since-reset)),
            participation-fee: (var-get participation-fee),
            total-paid: (get total-paid user-data)
        }
    )
)

;; Get application history for a user
(define-read-only (get-application-history (user principal) (app-index uint))
    (map-get? application-history { user: user, app-index: app-index })
)

;; Check if user can apply for free
(define-read-only (can-apply-free (user principal))
    (let 
        (
            (user-data (get-user-data user))
            (monthly-count (get monthly-count user-data))
            (last-reset (get last-reset user-data))
            (monthly-limit-val (var-get monthly-limit))
            (should-reset (should-reset-month last-reset))
            (effective-monthly-count (if should-reset u0 monthly-count))
        )
        (< effective-monthly-count monthly-limit-val)
    )
)

;; Get user's effective monthly count (considering resets)
(define-read-only (get-user-monthly-count (user principal))
    (let 
        (
            (user-data (get-user-data user))
            (monthly-count (get monthly-count user-data))
            (last-reset (get last-reset user-data))
            (should-reset (should-reset-month last-reset))
        )
        (if should-reset u0 monthly-count)
    )
)

;; Get user's total application count
(define-read-only (get-user-total-count (user principal))
    (get total-count (get-user-data user))
)

;; Get current configuration
(define-read-only (get-participation-fee)
    (var-get participation-fee)
)

(define-read-only (get-monthly-limit)
    (var-get monthly-limit)
)

(define-read-only (get-blocks-per-month)
    (var-get blocks-per-month)
)

(define-read-only (get-platform-owner)
    PLATFORM-OWNER
)

;; Get platform statistics
(define-read-only (get-platform-stats)
    {
        total-applications: (var-get total-applications),
        total-paid-applications: (var-get total-paid-applications),
        total-revenue: (var-get total-revenue),
        platform-owner: PLATFORM-OWNER
    }
)

;; private functions
;;
