# StackUp Smart Contracts - Frontend Integration Guide

## 📋 Overview

This guide provides comprehensive documentation for integrating StackUp smart contracts with your frontend application. The StackUp platform consists of 4 main contracts deployed on Stacks testnet.

## 🔗 Contract Information

### Deployed Contracts (Testnet)
- **Contract Address**: `ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W`
- **Network**: Stacks Testnet
- **Clarity Version**: 3

### Contract Names
1. `stackup-bounty-escrow` - Bounty management with escrow
2. `stackup-project-escrow` - Project management with milestone-based payments
3. `stackup-grant-escrow` - Grant management with 50/50 payment structure
4. `stackup-participation-manager` - User application limits and fees

---

## 🎯 Contract 1: Bounty Escrow System

### Purpose
Secure bounty management where funds are locked until a winner is selected and automatically paid.

### Key Features
- ✅ Create bounties with locked funds
- ✅ Select winners and automatic payment
- ✅ Cancel bounties with fund refunds
- ✅ Escrow protection for all participants

### Public Functions (Write Operations)

#### 1. Create Bounty
```typescript
// Function signature
create-bounty(title: string-ascii-100, description: string-ascii-500, 
             category: string-ascii-50, amount: uint, deadline?: uint)

// Parameters
- title: Bounty title (max 100 chars)
- description: Bounty description (max 500 chars) 
- category: Category like "development", "design" (max 50 chars)
- amount: Bounty amount in microSTX (1 STX = 1,000,000 microSTX)
- deadline: Optional deadline in block height

// Returns
- Success: (ok uint) - Returns bounty ID
- Error: Various error codes (see error reference)

// STX Transfer Required
- Amount specified in 'amount' parameter will be locked in escrow
```

#### 2. Select Winner
```typescript
// Function signature  
select-winner(bounty-id: uint, winner-address: principal)

// Parameters
- bounty-id: ID of the bounty
- winner-address: Stacks address of the winner

// Returns
- Success: (ok bool) - Winner selected and paid automatically
- Error: ERR-BOUNTY-NOT-FOUND, ERR-NOT-OWNER, etc.

// Authorization
- Only bounty owner can call this function
```

#### 3. Cancel Bounty
```typescript
// Function signature
cancel-bounty(bounty-id: uint)

// Parameters
- bounty-id: ID of the bounty to cancel

// Returns
- Success: (ok bool) - Bounty cancelled, funds refunded
- Error: ERR-BOUNTY-NOT-FOUND, ERR-WINNER-ALREADY-SELECTED, etc.

// Authorization
- Only bounty owner can call this function
- Cannot cancel if winner already selected
```

### Read-Only Functions (Query Operations)

#### 1. Get Bounty Details
```typescript
// Function signature
get-bounty(bounty-id: uint)

// Returns
{
  owner: principal,
  title: string-ascii-100,
  description: string-ascii-500,
  category: string-ascii-50,
  amount: uint,
  winner: optional principal,
  status: string-ascii-15, // "active", "completed", "cancelled"
  created-at: uint,
  completed-at: optional uint,
  deadline: optional uint
}
```

#### 2. Get Bounty Escrow Status
```typescript
// Function signature
get-bounty-escrow(bounty-id: uint)

// Returns
{
  locked-amount: uint,
  is-released: bool
}
```

#### 3. Get Next Bounty ID
```typescript
// Function signature
get-next-bounty-id()

// Returns
uint - Next bounty ID to be assigned
```

#### 4. Get Total Bounty Count
```typescript
// Function signature
get-bounty-count()

// Returns
uint - Total number of bounties created
```

#### 5. Check if Bounty is Open
```typescript
// Function signature
is-bounty-open(bounty-id: uint)

// Returns
bool - true if bounty is active and accepting submissions
```

#### 6. Get Contract Balance
```typescript
// Function signature
get-contract-balance()

// Returns
uint - Total STX locked in the contract
```

### Error Codes
- `100` - ERR-NOT-OWNER: Only bounty owner can perform this action
- `101` - ERR-BOUNTY-NOT-FOUND: Bounty does not exist
- `102` - ERR-BOUNTY-ALREADY-COMPLETED: Bounty already has a winner
- `103` - ERR-BOUNTY-ALREADY-CANCELLED: Bounty was already cancelled
- `104` - ERR-INVALID-AMOUNT: Amount must be greater than 0
- `105` - ERR-WINNER-ALREADY-SELECTED: Winner already chosen for this bounty
- `106` - ERR-NO-WINNER-SELECTED: No winner has been selected
- `107` - ERR-UNAUTHORIZED: User not authorized for this action

---

## 🚀 Contract 2: Project Escrow System

### Purpose
Project management with milestone-based payments after developer selection and escrow protection.

### Key Features
- ✅ Create projects with multiple milestones
- ✅ Select developers and lock total funds
- ✅ Milestone-based payment releases
- ✅ Project progress tracking

### Public Functions (Write Operations)

#### 1. Create Project
```typescript
// Function signature
create-project(title: string-ascii-100, description: string-ascii-500,
              category: string-ascii-50, milestones: list-of-milestones,
              deadline?: uint)

// Milestone Structure
{
  title: string-ascii-100,
  description: string-ascii-200, 
  amount: uint
}

// Parameters
- title: Project title (max 100 chars)
- description: Project description (max 500 chars)
- category: Project category (max 50 chars)
- milestones: List of milestone objects
- deadline: Optional deadline in block height

// Returns
- Success: (ok uint) - Returns project ID
- Error: ERR-INVALID-MILESTONES, ERR-EMPTY-MILESTONES, etc.

// STX Transfer Required
- Total of all milestone amounts will be locked in escrow
```

#### 2. Select Developer
```typescript
// Function signature
select-developer(project-id: uint, developer-address: principal)

// Parameters
- project-id: ID of the project
- developer-address: Stacks address of selected developer

// Returns
- Success: (ok bool) - Developer selected, funds locked
- Error: ERR-PROJECT-NOT-FOUND, ERR-DEVELOPER-ALREADY-SELECTED, etc.

// Authorization
- Only project owner can call this function
```

#### 3. Approve Milestone
```typescript
// Function signature
approve-milestone(project-id: uint, milestone-index: uint)

// Parameters
- project-id: ID of the project
- milestone-index: Index of milestone to approve (0-based)

// Returns
- Success: (ok bool) - Milestone approved, payment sent to developer
- Error: ERR-NO-DEVELOPER-SELECTED, ERR-MILESTONE-ALREADY-PAID, etc.

// Authorization
- Only project owner can call this function
- Developer must be selected first
```

#### 4. Cancel Project
```typescript
// Function signature
cancel-project(project-id: uint)

// Parameters
- project-id: ID of the project to cancel

// Returns
- Success: (ok bool) - Project cancelled, remaining funds refunded
- Error: ERR-PROJECT-NOT-FOUND, ERR-NOT-OWNER, etc.

// Authorization
- Only project owner can call this function
```

### Read-Only Functions (Query Operations)

#### 1. Get Project Details
```typescript
// Function signature
get-project(project-id: uint)

// Returns
{
  owner: principal,
  title: string-ascii-100,
  description: string-ascii-500,
  category: string-ascii-50,
  developer: optional principal,
  total-amount: uint,
  milestone-count: uint,
  status: string-ascii-15, // "open", "active", "completed", "cancelled"
  created-at: uint,
  selected-at: optional uint,
  deadline: optional uint
}
```

#### 2. Get Milestone Details
```typescript
// Function signature
get-milestone(project-id: uint, milestone-index: uint)

// Returns
{
  title: string-ascii-100,
  description: string-ascii-200,
  amount: uint,
  is-paid: bool
}
```

#### 3. Get Project Full Details
```typescript
// Function signature
get-project-full-details(project-id: uint)

// Returns
Combined project details + escrow information
```

#### 4. Get Project Progress
```typescript
// Function signature
get-project-progress(project-id: uint)

// Returns
{
  total-milestones: uint,
  paid-milestones: uint,
  remaining-amount: uint,
  completion-percentage: uint
}
```

#### 5. Check if Milestone is Paid
```typescript
// Function signature
is-milestone-paid(project-id: uint, milestone-index: uint)

// Returns
bool - true if milestone has been paid
```

### Error Codes
- `200` - ERR-NOT-OWNER: Only project owner can perform this action
- `201` - ERR-PROJECT-NOT-FOUND: Project does not exist
- `202` - ERR-MILESTONE-OUT-OF-BOUNDS: Invalid milestone index
- `203` - ERR-MILESTONE-ALREADY-PAID: Milestone already completed
- `204` - ERR-INVALID-MILESTONES: Invalid milestone structure
- `205` - ERR-EMPTY-MILESTONES: Project must have at least one milestone
- `206` - ERR-DEVELOPER-ALREADY-SELECTED: Developer already chosen
- `207` - ERR-NO-DEVELOPER-SELECTED: Must select developer first
- `208` - ERR-PROJECT-NOT-ACTIVE: Project is not in active status
- `209` - ERR-INSUFFICIENT-FUNDS: Not enough funds in escrow

---

## 💰 Contract 3: Grant Escrow System

### Purpose
Grant management with automatic 50% upfront payment and 50% completion payment structure.

### Key Features
- ✅ Create grants with automatic 50/50 split
- ✅ Select recipients with immediate 50% payment
- ✅ Completion approval triggers final 50% payment
- ✅ Grant cancellation with refunds

### Public Functions (Write Operations)

#### 1. Create Grant
```typescript
// Function signature
create-grant(title: string-ascii-100, description: string-ascii-500,
            category: string-ascii-50, total-amount: uint, deadline?: uint)

// Parameters
- title: Grant title (max 100 chars)
- description: Grant description (max 500 chars)
- category: Grant category (max 50 chars)
- total-amount: Total grant amount in microSTX
- deadline: Optional deadline in block height

// Returns
- Success: (ok uint) - Returns grant ID
- Error: ERR-INVALID-AMOUNT, etc.

// STX Transfer Required
- total-amount will be locked in escrow
// Automatically splits: 50% upfront + 50% completion
```

#### 2. Select Recipient
```typescript
// Function signature
select-recipient(grant-id: uint, recipient-address: principal)

// Parameters
- grant-id: ID of the grant
- recipient-address: Stacks address of grant recipient

// Returns
- Success: (ok bool) - Recipient selected, 50% paid immediately
- Error: ERR-GRANT-NOT-FOUND, ERR-RECIPIENT-ALREADY-SELECTED, etc.

// Authorization
- Only grant owner can call this function
// Automatically pays 50% upfront to recipient
```

#### 3. Approve Completion
```typescript
// Function signature
approve-completion(grant-id: uint)

// Parameters
- grant-id: ID of the grant to complete

// Returns
- Success: (ok bool) - Grant completed, final 50% paid
- Error: ERR-NO-RECIPIENT-SELECTED, ERR-FINAL-ALREADY-PAID, etc.

// Authorization
- Only grant owner can call this function
// Pays remaining 50% to recipient
```

#### 4. Cancel Grant
```typescript
// Function signature
cancel-grant(grant-id: uint)

// Parameters
- grant-id: ID of the grant to cancel

// Returns
- Success: (ok bool) - Grant cancelled, remaining funds refunded
- Error: ERR-GRANT-NOT-FOUND, ERR-NOT-OWNER, etc.

// Authorization
- Only grant owner can call this function
```

### Read-Only Functions (Query Operations)

#### 1. Get Grant Details
```typescript
// Function signature
get-grant(grant-id: uint)

// Returns
{
  owner: principal,
  title: string-ascii-100,
  description: string-ascii-500,
  category: string-ascii-50,
  recipient: optional principal,
  total-amount: uint,
  upfront-amount: uint, // Always 50% of total
  final-amount: uint,   // Always 50% of total
  status: string-ascii-15, // "open", "active", "completed", "cancelled"
  created-at: uint,
  selected-at: optional uint,
  completed-at: optional uint,
  deadline: optional uint
}
```

#### 2. Get Grant Payment Status
```typescript
// Function signature
get-grant-payment-status(grant-id: uint)

// Returns
{
  upfront-paid: bool,
  final-paid: bool,
  upfront-amount: uint,
  final-amount: uint
}
```

#### 3. Get Grant Full Details
```typescript
// Function signature
get-grant-full-details(grant-id: uint)

// Returns
Combined grant details + payment status + escrow information
```

### Error Codes
- `200` - ERR-NOT-OWNER: Only grant owner can perform this action
- `201` - ERR-GRANT-NOT-FOUND: Grant does not exist
- `202` - ERR-GRANT-NOT-ACTIVE: Grant is not in active status
- `203` - ERR-RECIPIENT-ALREADY-SELECTED: Recipient already chosen
- `204` - ERR-GRANT-ALREADY-COMPLETED: Grant already completed
- `205` - ERR-NO-RECIPIENT-SELECTED: Must select recipient first
- `206` - ERR-UPFRONT-ALREADY-PAID: Upfront payment already made
- `207` - ERR-FINAL-ALREADY-PAID: Final payment already made
- `208` - ERR-UPFRONT-NOT-PAID: Upfront payment must be made first
- `209` - ERR-INVALID-AMOUNT: Amount must be greater than 0
- `210` - ERR-INSUFFICIENT-FUNDS: Not enough funds in escrow

---

## 👥 Contract 4: Participation Manager

### Purpose
Manages user application limits with 4 free applications per month, then 1 STX fee per additional application.

### Key Features
- ✅ 4 free applications per month per user
- ✅ 1 STX fee for additional applications (paid to platform owner)
- ✅ Monthly reset system
- ✅ Application history tracking

### Public Functions (Write Operations)

#### 1. Apply for Opportunity (Free)
```typescript
// Function signature
apply-for-opportunity(opportunity-type: string-ascii-20, opportunity-id: uint)

// Parameters
- opportunity-type: Type like "bounty", "project", "grant"
- opportunity-id: ID of the opportunity

// Returns
- Success: (ok bool) - Application successful (if within free limit)
- Error: ERR-APPLICATION-LIMIT-REACHED, etc.

// Usage
- Use this for first 4 applications per month
- Check can-apply-free() first
```

#### 2. Pay for Application
```typescript
// Function signature
pay-for-application(opportunity-type: string-ascii-20, opportunity-id: uint)

// Parameters
- opportunity-type: Type like "bounty", "project", "grant"  
- opportunity-id: ID of the opportunity

// Returns
- Success: (ok bool) - Paid application successful
- Error: ERR-INSUFFICIENT-PAYMENT, etc.

// STX Transfer Required
- 1 STX (1,000,000 microSTX) paid to platform owner
// Use this after free limit is reached
```

### Read-Only Functions (Query Operations)

#### 1. Check Application Status
```typescript
// Function signature
get-application-status(user: principal)

// Returns
{
  monthly-count: uint,
  total-count: uint,
  last-reset: uint,
  total-paid: uint
}
```

#### 2. Check if User Can Apply Free
```typescript
// Function signature
can-apply-free(user: principal)

// Returns
bool - true if user has free applications remaining this month
```

#### 3. Get User Monthly Count
```typescript
// Function signature
get-user-monthly-count(user: principal)

// Returns
uint - Number of applications this month
```

#### 4. Get Participation Fee
```typescript
// Function signature
get-participation-fee()

// Returns
uint - Current participation fee (1 STX = 1,000,000 microSTX)
```

#### 5. Get Monthly Limit
```typescript
// Function signature
get-monthly-limit()

// Returns
uint - Monthly free application limit (currently 4)
```

#### 6. Get Platform Stats
```typescript
// Function signature
get-platform-stats()

// Returns
{
  monthly-limit: uint,
  participation-fee: uint,
  blocks-per-month: uint,
  platform-owner: principal
}
```

### Error Codes
- `400` - ERR-NOT-OWNER: Only contract owner can perform this action
- `401` - ERR-APPLICATION-LIMIT-REACHED: Monthly free limit exceeded
- `402` - ERR-PAYMENT-REQUIRED: Payment required for additional applications
- `403` - ERR-INSUFFICIENT-PAYMENT: Payment amount too low
- `404` - ERR-UNAUTHORIZED: User not authorized
- `405` - ERR-FREE-AVAILABLE: User still has free applications available

---

## 🛠 Frontend Integration Examples

### 1. Stacks.js Integration Setup

```typescript
import {
  makeContractCall,
  makeContractCallTransaction,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToJSON,
  uintCV,
  stringAsciiCV,
  principalCV,
  listCV,
  tupleCV
} from '@stacks/transactions';
import { StacksNetwork, StacksTestnet } from '@stacks/network';

// Network configuration
const network = new StacksTestnet();
const contractAddress = 'ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W';
```

### 2. Create Bounty Example

```typescript
async function createBounty(
  title: string,
  description: string,
  category: string,
  amount: number, // in microSTX
  userAddress: string,
  privateKey: string
) {
  const txOptions = {
    contractAddress,
    contractName: 'stackup-bounty-escrow',
    functionName: 'create-bounty',
    functionArgs: [
      stringAsciiCV(title),
      stringAsciiCV(description),
      stringAsciiCV(category),
      uintCV(amount)
    ],
    senderKey: privateKey,
    network,
    postConditionMode: 0x01, // Allow
    fee: 200000, // 0.2 STX
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}
```

### 3. Create Project with Milestones Example

```typescript
async function createProject(
  title: string,
  description: string,
  category: string,
  milestones: Array<{title: string, description: string, amount: number}>,
  userAddress: string,
  privateKey: string
) {
  const milestoneCV = listCV(
    milestones.map(m => tupleCV({
      'title': stringAsciiCV(m.title),
      'description': stringAsciiCV(m.description),
      'amount': uintCV(m.amount)
    }))
  );

  const txOptions = {
    contractAddress,
    contractName: 'stackup-project-escrow',
    functionName: 'create-project',
    functionArgs: [
      stringAsciiCV(title),
      stringAsciiCV(description), 
      stringAsciiCV(category),
      milestoneCV
    ],
    senderKey: privateKey,
    network,
    postConditionMode: 0x01,
    fee: 200000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}
```

### 4. Read Contract Data Example

```typescript
async function getBountyDetails(bountyId: number) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'stackup-bounty-escrow',
    functionName: 'get-bounty',
    functionArgs: [uintCV(bountyId)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}

async function checkUserApplicationStatus(userAddress: string) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'stackup-participation-manager', 
    functionName: 'get-application-status',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: contractAddress,
  });

  return cvToJSON(result);
}
```

### 5. Complete Frontend Workflow Example

```typescript
class StackUpContractInterface {
  private network: StacksNetwork;
  private contractAddress: string;

  constructor() {
    this.network = new StacksTestnet();
    this.contractAddress = 'ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W';
  }

  // Bounty Management
  async createBounty(params: BountyParams) { /* implementation */ }
  async selectBountyWinner(bountyId: number, winnerAddress: string) { /* implementation */ }
  async cancelBounty(bountyId: number) { /* implementation */ }
  async getBountyDetails(bountyId: number) { /* implementation */ }

  // Project Management  
  async createProject(params: ProjectParams) { /* implementation */ }
  async selectDeveloper(projectId: number, developerAddress: string) { /* implementation */ }
  async approveMilestone(projectId: number, milestoneIndex: number) { /* implementation */ }
  async getProjectProgress(projectId: number) { /* implementation */ }

  // Grant Management
  async createGrant(params: GrantParams) { /* implementation */ }
  async selectGrantRecipient(grantId: number, recipientAddress: string) { /* implementation */ }
  async approveGrantCompletion(grantId: number) { /* implementation */ }

  // Participation Management
  async applyForOpportunity(type: string, id: number) { /* implementation */ }
  async payForApplication(type: string, id: number) { /* implementation */ }
  async checkApplicationStatus(userAddress: string) { /* implementation */ }
}
```

---

## 📊 Development Roadmap & Phases

### Phase 1: Core Integration (Week 1-2)
**Priority: HIGH**

#### Bounty System
- [ ] Implement bounty creation with STX locking
- [ ] Build bounty listing and detail views
- [ ] Add winner selection functionality
- [ ] Implement bounty cancellation

#### Read-Only Data Access
- [ ] Integrate bounty detail fetching
- [ ] Display escrow status and contract balance
- [ ] Show bounty count and pagination

### Phase 2: Project Management (Week 3-4)
**Priority: HIGH**

#### Project Creation
- [ ] Build milestone creation interface
- [ ] Implement project creation with milestone validation
- [ ] Add total cost calculation and STX locking

#### Project Lifecycle Management
- [ ] Developer selection interface
- [ ] Milestone approval system
- [ ] Progress tracking dashboard
- [ ] Project cancellation functionality

### Phase 3: Grant System (Week 5-6)
**Priority: MEDIUM**

#### Grant Management
- [ ] Grant creation with 50/50 split calculation
- [ ] Recipient selection with automatic 50% payment
- [ ] Completion approval with final 50% payment
- [ ] Grant status tracking

### Phase 4: Participation System (Week 7-8)
**Priority: MEDIUM**

#### Application Management
- [ ] Free application tracking (4 per month)
- [ ] Paid application system (1 STX fee)
- [ ] Monthly reset handling
- [ ] Application history display

#### User Experience
- [ ] Application limit warnings
- [ ] Fee payment confirmation
- [ ] Monthly usage statistics

### Phase 5: Advanced Features (Week 9-10)
**Priority: LOW**

#### Enhanced UI/UX
- [ ] Real-time contract event listening
- [ ] Transaction status tracking
- [ ] Notification system for payments
- [ ] Advanced filtering and search

#### Analytics Dashboard
- [ ] Platform statistics
- [ ] User activity metrics
- [ ] Financial flow visualization
- [ ] Performance analytics

---

## 🔧 Technical Requirements

### Dependencies
```json
{
  "@stacks/transactions": "^6.0.0",
  "@stacks/network": "^6.0.0", 
  "@stacks/wallet-sdk": "^6.0.0",
  "@stacks/connect": "^20.0.0"
}
```

### Environment Variables
```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

### Key Integration Points

1. **Wallet Connection**: Use Stacks Connect for user authentication
2. **Transaction Signing**: Handle transaction signing through connected wallet
3. **Event Listening**: Monitor contract events for real-time updates
4. **Error Handling**: Implement comprehensive error handling for all contract calls
5. **Loading States**: Show appropriate loading indicators during blockchain operations
6. **Post-Conditions**: Implement proper post-conditions for STX transfers

---

## 🚨 Important Notes

### Security Considerations
- Always validate user inputs before contract calls
- Implement proper error handling for failed transactions
- Use post-conditions to prevent unexpected STX transfers
- Validate contract responses before updating UI state

### Testing Strategy
- Test all contract functions on testnet first
- Verify STX transfer amounts and recipients
- Test error scenarios and edge cases
- Validate gas fee estimations

### Performance Optimization
- Cache read-only function results where appropriate
- Implement pagination for large data sets
- Use optimistic UI updates where safe
- Batch multiple read operations when possible

### User Experience
- Provide clear feedback for all blockchain operations
- Show estimated transaction fees before signing
- Implement proper loading states for async operations
- Handle wallet connection states gracefully

---

## 📞 Support & Resources

### Documentation
- [Stacks.js Documentation](https://docs.stacks.co/docs/stacks.js/)
- [Clarity Language Reference](https://docs.stacks.co/docs/clarity/)
- [Stacks Connect Guide](https://docs.stacks.co/docs/stacks-connect)

### Testing Resources
- Testnet Explorer: https://explorer.stacks.co/?chain=testnet
- Testnet Faucet: https://explorer.stacks.co/sandbox/faucet?chain=testnet
- Contract Address: `ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W`

### Contract Testing
All contracts have been thoroughly tested with 84 passing tests covering:
- ✅ All public function scenarios
- ✅ Error condition handling  
- ✅ STX transfer validation
- ✅ Access control verification
- ✅ State management accuracy

This integration guide provides everything your frontend team needs to successfully connect with the StackUp smart contracts. Each contract has been designed with security, usability, and developer experience in mind.
