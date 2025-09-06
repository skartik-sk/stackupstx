
import { describe, expect, it, beforeEach } from "vitest";
import { cvToJSON, standardPrincipalCV, uintCV } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

describe("Participate Stake Contract Tests", () => {
  describe("stake-for-applications", () => {
    it("should allow users to stake STX", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(5000000)], // 5 STX
        address1
      );

      expect(cvToJSON(response.result).value).toBe(5000000);

      // Verify staker balance
      const balance = simnet.callReadOnlyFn(
        "participate-stake",
        "get-staker-balance",
        [standardPrincipalCV(address1)],
        address1
      );

      expect(cvToJSON(balance.result).value).toBe(5000000);
    });

    it("should fail with invalid amount", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(0)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(302); // ERR-INVALID-AMOUNT
    });

    it("should accumulate multiple stakes", () => {
      // First stake
      simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(2000000)],
        address1
      );

      // Second stake
      simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(3000000)],
        address1
      );

      // Check total balance
      const balance = simnet.callReadOnlyFn(
        "participate-stake",
        "get-staker-balance",
        [standardPrincipalCV(address1)],
        address1
      );

      expect(cvToJSON(balance.result).value).toBe(5000000);
    });
  });

  describe("apply-for-opportunity", () => {
    it("should allow application within monthly limit", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "apply-for-opportunity",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(true);

      // Check application status
      const status = simnet.callReadOnlyFn(
        "participate-stake",
        "get-application-status",
        [standardPrincipalCV(address1)],
        address1
      );

      const statusJson = cvToJSON(status.result);
      expect(statusJson.value["current-applications"]).toBe(1);
      expect(statusJson.value["applications-remaining"]).toBe(3);
    });

    it("should fail when reaching monthly limit", () => {
      // Apply 4 times (monthly limit)
      for (let i = 0; i < 4; i++) {
        simnet.callPublicFn(
          "participate-stake",
          "apply-for-opportunity",
          [],
          address1
        );
      }

      // Fifth application should fail
      const response = simnet.callPublicFn(
        "participate-stake",
        "apply-for-opportunity",
        [],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(303); // ERR-APPLICATION-LIMIT-REACHED
    });
  });

  describe("reset-application-count", () => {
    beforeEach(() => {
      // Stake some STX first
      simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(5000000)],
        address1
      );

      // Use up all applications
      for (let i = 0; i < 4; i++) {
        simnet.callPublicFn(
          "participate-stake",
          "apply-for-opportunity",
          [],
          address1
        );
      }
    });

    it("should reset application count when user has sufficient stake", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "reset-application-count",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(true);

      // Check application status
      const status = simnet.callReadOnlyFn(
        "participate-stake",
        "get-application-status",
        [standardPrincipalCV(address1)],
        address1
      );

      const statusJson = cvToJSON(status.result);
      expect(statusJson.value["current-applications"]).toBe(0);
      expect(statusJson.value["applications-remaining"]).toBe(4);

      // Check that stake was deducted
      const balance = simnet.callReadOnlyFn(
        "participate-stake",
        "get-staker-balance",
        [standardPrincipalCV(address1)],
        address1
      );

      expect(cvToJSON(balance.result).value).toBe(4000000); // 5 STX - 1 STX fee
    });

    it("should fail with insufficient stake", () => {
      // Use another user with no stake
      const response = simnet.callPublicFn(
        "participate-stake",
        "reset-application-count",
        [],
        address2
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(300); // ERR-INSUFFICIENT-STAKE
    });
  });

  describe("claim-stake", () => {
    beforeEach(() => {
      // Stake some STX
      simnet.callPublicFn(
        "participate-stake",
        "stake-for-applications",
        [uintCV(3000000)],
        address1
      );
    });

    it("should allow user to claim their stake", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "claim-stake",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(3000000);

      // Check that balance is now zero
      const balance = simnet.callReadOnlyFn(
        "participate-stake",
        "get-staker-balance",
        [standardPrincipalCV(address1)],
        address1
      );

      expect(cvToJSON(balance.result).value).toBe(0);
    });

    it("should fail with no stake to claim", () => {
      const response = simnet.callPublicFn(
        "participate-stake",
        "claim-stake",
        [],
        address2 // User with no stake
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(301); // ERR-NO-STAKE-TO-CLAIM
    });
  });

  describe("read-only functions", () => {
    it("should return correct stake fee", () => {
      const response = simnet.callReadOnlyFn(
        "participate-stake",
        "get-stake-fee",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(1000000); // 1 STX
    });

    it("should return correct monthly limit", () => {
      const response = simnet.callReadOnlyFn(
        "participate-stake",
        "get-monthly-limit",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(4);
    });

    it("should return zero balance for new user", () => {
      const response = simnet.callReadOnlyFn(
        "participate-stake",
        "get-staker-balance",
        [standardPrincipalCV(address2)],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(0);
    });

    it("should return correct application status for new user", () => {
      const response = simnet.callReadOnlyFn(
        "participate-stake",
        "get-application-status",
        [standardPrincipalCV(address2)],
        address1
      );

      const statusJson = cvToJSON(response.result);
      expect(statusJson.value["current-applications"]).toBe(0);
      expect(statusJson.value["monthly-limit"]).toBe(4);
      expect(statusJson.value["applications-remaining"]).toBe(4);
      expect(statusJson.value["at-limit"]).toBe(false);
    });
  });
});
