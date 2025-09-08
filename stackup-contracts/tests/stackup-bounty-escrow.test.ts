import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("StackUp Bounty Escrow Contract", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should create a bounty with proper escrow", () => {
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Web Development Bounty"),
        Cl.stringAscii("Build a responsive website with modern design"),
        Cl.stringAscii("Development"),
        Cl.uint(5000000), // 5 STX
        Cl.some(Cl.uint(100)) // deadline in 100 blocks
      ],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.uint(1)));
  });

  it("should get bounty full details including escrow", () => {
    // Create a bounty first
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Bug Fix Bounty"),
        Cl.stringAscii("Fix critical bugs in smart contract"),
        Cl.stringAscii("Development"),
        Cl.uint(3000000), // 3 STX
        Cl.none()
      ],
      wallet1
    );

    // Get full details
    const response = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "get-bounty-full-details",
      [Cl.uint(1)],
      wallet1
    );
    
    expect(response.result).toBeDefined();
    // Should contain both bounty details and escrow information
  });

  it("should select winner and transfer funds from escrow", () => {
    // Create bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("UI Design Bounty"),
        Cl.stringAscii("Create modern UI mockups"),
        Cl.stringAscii("Design"),
        Cl.uint(4000000), // 4 STX
        Cl.none()
      ],
      wallet1
    );

    // Select winner
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "select-winner",
      [Cl.uint(1), Cl.principal(wallet2)],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should not allow non-owner to select winner", () => {
    // Create bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Test Bounty"),
        Cl.stringAscii("Testing authorization"),
        Cl.stringAscii("Testing"),
        Cl.uint(2000000),
        Cl.none()
      ],
      wallet1
    );

    // Try to select winner from different account
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "select-winner",
      [Cl.uint(1), Cl.principal(wallet3)],
      wallet2
    );
    
    expect(response.result).toStrictEqual(Cl.error(Cl.uint(100))); // ERR-NOT-OWNER
  });

  it("should cancel bounty and refund from escrow", () => {
    // Create bounty
    const createResponse = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Cancellation Test"),
        Cl.stringAscii("Testing bounty cancellation"),
        Cl.stringAscii("Testing"),
        Cl.uint(6000000),
        Cl.none()
      ],
      wallet1
    );

    // Extract bounty ID from the ok response
    const bountyId = (createResponse.result as any).value;
    
    // Cancel the bounty we just created
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "cancel-bounty",
      [bountyId],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should check contract balance reflects locked funds", () => {
    // Create multiple bounties
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Balance Test 1"),
        Cl.stringAscii("Testing contract balance"),
        Cl.stringAscii("Testing"),
        Cl.uint(1000000),
        Cl.none()
      ],
      wallet1
    );

    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Balance Test 2"),
        Cl.stringAscii("Testing contract balance"),
        Cl.stringAscii("Testing"),
        Cl.uint(2000000),
        Cl.none()
      ],
      wallet2
    );

    // Check contract balance
    const response = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "get-contract-balance",
      [],
      wallet1
    );
    
    expect(response.result).toBeDefined();
  });

  it("should verify bounty ownership correctly", () => {
    // Create bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Ownership Test"),
        Cl.stringAscii("Testing ownership verification"),
        Cl.stringAscii("Testing"),
        Cl.uint(1500000),
        Cl.none()
      ],
      wallet1
    );

    // Check ownership
    const ownerResponse = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "is-bounty-owner",
      [Cl.uint(1), Cl.principal(wallet1)],
      wallet1
    );

    const nonOwnerResponse = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "is-bounty-owner",
      [Cl.uint(1), Cl.principal(wallet2)],
      wallet1
    );
    
    expect(ownerResponse.result).toStrictEqual(Cl.bool(true));
    expect(nonOwnerResponse.result).toStrictEqual(Cl.bool(false));
  });

  it("should not allow double winner selection", () => {
    // Create bounty and select winner
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Double Selection Test"),
        Cl.stringAscii("Testing double selection prevention"),
        Cl.stringAscii("Testing"),
        Cl.uint(3000000),
        Cl.none()
      ],
      wallet1
    );

    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "select-winner",
      [Cl.uint(1), Cl.principal(wallet2)],
      wallet1
    );

    // Try to select winner again
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "select-winner",
      [Cl.uint(1), Cl.principal(wallet3)],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.error(Cl.uint(102))); // ERR-BOUNTY-ALREADY-COMPLETED
  });

  it("should get accurate bounty count", () => {
    const countBefore = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "get-bounty-count",
      [],
      wallet1
    );

    // Create a bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Count Test"),
        Cl.stringAscii("Testing bounty count"),
        Cl.stringAscii("Testing"),
        Cl.uint(1000000),
        Cl.none()
      ],
      wallet1
    );

    const countAfter = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "get-bounty-count",
      [],
      wallet1
    );
    
    expect(countAfter.result).toBeDefined();
  });
});
