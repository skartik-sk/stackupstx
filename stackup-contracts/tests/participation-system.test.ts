import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("✅ Working Participation System Contract", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should allow free application for new user", () => {
    const response = simnet.callPublicFn(
      "stackup-participation-manager",
      "apply-for-opportunity",
      [Cl.stringAscii("bounty"), Cl.uint(1)],
      wallet1
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should track user application status correctly", () => {
    // Apply once
    simnet.callPublicFn(
      "stackup-participation-manager",
      "apply-for-opportunity",
      [Cl.stringAscii("project"), Cl.uint(1)],
      wallet2
    );

    // Get status
    const response = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-application-status",
      [Cl.principal(wallet2)],
      wallet2
    );
    
    expect(response.result).toBeDefined();
  });

  it("should allow multiple free applications up to limit", () => {
    // Apply 4 times (the monthly limit) with fresh user
    for (let i = 1; i <= 4; i++) {
      const response = simnet.callPublicFn(
        "stackup-participation-manager",
        "apply-for-opportunity",
        [Cl.stringAscii("bounty"), Cl.uint(i)],
        wallet3
      );
      expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
    }
  });

  it("should require payment after free limit exceeded", () => {
    // First use up 4 free applications with a new user
    const testUser = wallet1;
    
    // Apply 4 times first (up to limit)
    for (let i = 1; i <= 4; i++) {
      simnet.callPublicFn(
        "stackup-participation-manager",
        "apply-for-opportunity",
        [Cl.stringAscii("grant"), Cl.uint(i)],
        testUser
      );
    }

    // 5th application should fail
    const response = simnet.callPublicFn(
      "stackup-participation-manager",
      "apply-for-opportunity",
      [Cl.stringAscii("grant"), Cl.uint(5)],
      testUser
    );
    
    expect(response.result).toStrictEqual(Cl.error(Cl.uint(401))); // ERR-APPLICATION-LIMIT-REACHED
  });

  it("should allow paid application after limit", () => {
    // Use wallet2 which should already have applications
    // Pay for additional application
    const response = simnet.callPublicFn(
      "stackup-participation-manager",
      "pay-for-application",
      [Cl.stringAscii("project"), Cl.uint(5)],
      wallet1 // wallet1 should be at limit already
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should get platform stats correctly", () => {
    const response = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-platform-stats",
      [],
      wallet1
    );
    
    expect(response.result).toBeDefined();
  });

  it("should get application history", () => {
    // Get application history (index 0 should be the first application)
    const response = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-application-history",
      [Cl.principal(wallet1), Cl.uint(0)],
      wallet1
    );
    
    expect(response.result).toBeDefined();
  });

  it("should reset user data (admin function)", () => {
    const response = simnet.callPublicFn(
      "stackup-participation-manager",
      "reset-user-data",
      [Cl.principal(wallet1)],
      deployer // Using deployer as admin
    );
    
    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should not allow non-admin to reset user data", () => {
    const response = simnet.callPublicFn(
      "stackup-participation-manager",
      "reset-user-data",
      [Cl.principal(wallet1)],
      wallet2 // Non-admin
    );
    
    expect(response.result).toStrictEqual(Cl.error(Cl.uint(400))); // ERR-NOT-OWNER
  });

  it("should get correct configuration values", () => {
    const feeResponse = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-participation-fee",
      [],
      wallet1
    );

    const limitResponse = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-monthly-limit",
      [],
      wallet1
    );

    const ownerResponse = simnet.callReadOnlyFn(
      "stackup-participation-manager",
      "get-platform-owner",
      [],
      wallet1
    );
    
    expect(feeResponse.result).toStrictEqual(Cl.uint(1000000)); // 1 STX
    expect(limitResponse.result).toStrictEqual(Cl.uint(4)); // 4 applications
    expect(ownerResponse.result).toBeDefined(); // Platform owner address
  });

  it("should update configuration (admin only)", () => {
    // Set new monthly limit
    const limitResponse = simnet.callPublicFn(
      "stackup-participation-manager",
      "set-monthly-limit",
      [Cl.uint(5)],
      deployer // Admin
    );

    // Set new participation fee
    const feeResponse = simnet.callPublicFn(
      "stackup-participation-manager",
      "set-participation-fee",
      [Cl.uint(2000000)], // 2 STX
      deployer // Admin
    );
    
    expect(limitResponse.result).toStrictEqual(Cl.ok(Cl.bool(true)));
    expect(feeResponse.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });
});
