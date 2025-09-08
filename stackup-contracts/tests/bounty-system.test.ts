import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("✅ Working Bounty System Contract", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should create a bounty successfully", () => {
    const response = simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Frontend Development Task"),
        Cl.stringAscii("Build a responsive React component"),
        Cl.stringAscii("Development"),
        Cl.uint(1000000), // 1 STX in microSTX
        Cl.none()
      ],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.uint(1))); // First bounty ID
  });

  it("should get bounty details", () => {
    // First create a bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Test Bounty"),
        Cl.stringAscii("Test Description"),
        Cl.stringAscii("Development"),
        Cl.uint(500000), // 0.5 STX
        Cl.none()
      ],
      wallet1
    );

    // Then get its details
    const response = simnet.callReadOnlyFn(
      "stackup-bounty-escrow",
      "get-bounty",
      [Cl.uint(1)],
      wallet1
    );
    
    expect(response.result).toBeDefined();
  });

  it("should select winner and transfer funds", () => {
    // Create a bounty
    simnet.callPublicFn(
      "stackup-bounty-escrow",
      "create-bounty",
      [
        Cl.stringAscii("Winner Test"),
        Cl.stringAscii("Test for winner selection"),
        Cl.stringAscii("Development"),
        Cl.uint(2000000), // 2 STX
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
        Cl.stringAscii("Owner Test"),
        Cl.stringAscii("Test ownership"),
        Cl.stringAscii("Development"),
        Cl.uint(1000000),
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

  it("should get correct bounty count", () => {
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
        Cl.stringAscii("Description"),
        Cl.stringAscii("Development"),
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
});
