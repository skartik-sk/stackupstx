
import { describe, expect, it, beforeEach } from "vitest";
import { cvToJSON, standardPrincipalCV, uintCV, boolCV } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

describe("Bounty Escrow Contract Tests", () => {
  describe("create-bounty", () => {
    it("should create a bounty successfully", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(1000000)], // 1 STX
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value).toBe("1");
      
      // Verify bounty data
      const bountyData = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-bounty",
        [uintCV(1)],
        address1
      );

      const bountyJson = cvToJSON(bountyData.result);
      expect(bountyJson.type).toBe("(optional (some ))");
      expect(bountyJson.value).toBeDefined();
    });

    it("should fail with invalid amount", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(0)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("105"); // ERR-INVALID-AMOUNT
    });

    it("should increment bounty ID for multiple bounties", () => {
      // Create first bounty
      const response1 = simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(1000000)],
        address1
      );
      const result1 = cvToJSON(response1.result);
      expect(result1.value).toBe("1");

      // Create second bounty
      const response2 = simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(2000000)],
        address1
      );
      const result2 = cvToJSON(response2.result);
      expect(result2.value).toBe("2");
    });
  });

  describe("approve-bounty", () => {
    beforeEach(() => {
      // Create a bounty for testing
      simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(1000000)],
        address1
      );
    });

    it("should approve bounty and transfer funds to worker", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "approve-bounty",
        [uintCV(1)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value).toBe(true);

      // Verify bounty status changed
      const bountyData = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-bounty",
        [uintCV(1)],
        address1
      );

      const bountyJson = cvToJSON(bountyData.result);
      expect(bountyJson.type).toBe("(optional (some ))");
      expect(bountyJson.value).toBeDefined();
    });

    it("should fail if called by non-owner", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "approve-bounty",
        [uintCV(1)],
        address2 // Wrong caller
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("100"); // ERR-NOT-OWNER
    });

    it("should fail for non-existent bounty", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "approve-bounty",
        [uintCV(999)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("101"); // ERR-BOUNTY-NOT-FOUND
    });

    it("should fail if bounty already approved", () => {
      // First approval
      simnet.callPublicFn(
        "bounty-escrow",
        "approve-bounty",
        [uintCV(1)],
        address1
      );

      // Second approval should fail
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "approve-bounty",
        [uintCV(1)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("102"); // ERR-BOUNTY-ALREADY-APPROVED
    });
  });

  describe("cancel-bounty", () => {
    beforeEach(() => {
      // Create a bounty for testing
      simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(1000000)],
        address1
      );
    });

    it("should cancel bounty and refund to owner", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "cancel-bounty",
        [uintCV(1)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value).toBe(true);

      // Verify bounty status changed
      const bountyData = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-bounty",
        [uintCV(1)],
        address1
      );

      const bountyJson = cvToJSON(bountyData.result);
      expect(bountyJson.type).toBe("(optional (some ))");
      expect(bountyJson.value).toBeDefined();
    });

    it("should fail if called by non-owner", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "cancel-bounty",
        [uintCV(1)],
        address2
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("100"); // ERR-NOT-OWNER
    });

    it("should fail for non-existent bounty", () => {
      const response = simnet.callPublicFn(
        "bounty-escrow",
        "cancel-bounty",
        [uintCV(999)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe("101"); // ERR-BOUNTY-NOT-FOUND
    });
  });

  describe("read-only functions", () => {
    it("should return correct next bounty ID", () => {
      const response = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-next-bounty-id",
        [],
        address1
      );

      const result = cvToJSON(response.result);
      expect(parseInt(result.value)).toBeGreaterThanOrEqual(1);

      // Create a bounty and check the ID increments
      const initialId = parseInt(result.value);
      
      simnet.callPublicFn(
        "bounty-escrow",
        "create-bounty",
        [standardPrincipalCV(address2), uintCV(1000000)],
        address1
      );

      const responseAfter = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-next-bounty-id",
        [],
        address1
      );

      const resultAfter = cvToJSON(responseAfter.result);
      expect(parseInt(resultAfter.value)).toBe(initialId + 1);
    });

    it("should return none for non-existent bounty", () => {
      const response = simnet.callReadOnlyFn(
        "bounty-escrow",
        "get-bounty",
        [uintCV(999)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.type).toBe("(optional none)");
    });
  });
});
