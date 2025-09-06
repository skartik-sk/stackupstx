
import { describe, expect, it, beforeEach } from "vitest";
import { cvToJSON, standardPrincipalCV, uintCV, listCV } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

describe("Milestone Escrow Contract Tests", () => {
  describe("create-project", () => {
    it("should create a project with milestones successfully", () => {
      const milestoneAmounts = [
        uintCV(1000000), // 1 STX
        uintCV(2000000), // 2 STX
        uintCV(3000000)  // 3 STX
      ];

      const response = simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV(milestoneAmounts)],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(1);

      // Verify project data
      const projectData = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-project",
        [uintCV(1)],
        address1
      );

      const projectJson = cvToJSON(projectData.result);
      expect(projectJson.type).toBe("(optional (some ))");
      expect(projectJson.value).toBeDefined();
    });

    it("should fail with empty milestones", () => {
      const response = simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV([])],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(206); // ERR-EMPTY-MILESTONES
    });

    it("should create milestone entries correctly", () => {
      const milestoneAmounts = [
        uintCV(1000000),
        uintCV(2000000)
      ];

      simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV(milestoneAmounts)],
        address1
      );

      // Check first milestone
      const milestone0 = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-milestone",
        [uintCV(1), uintCV(0)],
        address1
      );

      const milestone0Json = cvToJSON(milestone0.result);
      expect(milestone0Json.type).toBe("(optional (some ))");
      expect(milestone0Json.value).toBeDefined();

      // Check second milestone
      const milestone1 = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-milestone",
        [uintCV(1), uintCV(1)],
        address1
      );

      const milestone1Json = cvToJSON(milestone1.result);
      expect(milestone1Json.type).toBe("(optional (some ))");
      expect(milestone1Json.value).toBeDefined();
    });
  });

  describe("approve-milestone", () => {
    beforeEach(() => {
      // Create a project with milestones for testing
      const milestoneAmounts = [
        uintCV(1000000),
        uintCV(2000000),
        uintCV(3000000)
      ];

      simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV(milestoneAmounts)],
        address1
      );
    });

    it("should approve milestone and transfer funds to worker", () => {
      const response = simnet.callPublicFn(
        "milestone-escrow",
        "approve-milestone",
        [uintCV(1), uintCV(0)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value).toBe(true);

      // Verify milestone is marked as paid
      const milestone = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-milestone",
        [uintCV(1), uintCV(0)],
        address1
      );

      const milestoneJson = cvToJSON(milestone.result);
      expect(milestoneJson.type).toBe("(optional (some ))");
      expect(milestoneJson.value).toBeDefined();
    });

    it("should fail if called by non-owner", () => {
      const response = simnet.callPublicFn(
        "milestone-escrow",
        "approve-milestone",
        [uintCV(1), uintCV(0)],
        address2 // Wrong caller
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(200); // ERR-NOT-OWNER
    });

    it("should fail for non-existent project", () => {
      const response = simnet.callPublicFn(
        "milestone-escrow",
        "approve-milestone",
        [uintCV(999), uintCV(0)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.value.error).toBe(201); // ERR-PROJECT-NOT-FOUND
    });
  });

  describe("project progress tracking", () => {
    beforeEach(() => {
      const milestoneAmounts = [
        uintCV(1000000),
        uintCV(2000000),
        uintCV(3000000)
      ];

      simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV(milestoneAmounts)],
        address1
      );
    });

    it("should track project progress correctly", () => {
      // Initial progress
      const initialProgress = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-project-progress",
        [uintCV(1)],
        address1
      );

      const initialJson = cvToJSON(initialProgress.result);
      expect(initialJson.type).toBe("(optional (some ))");
      expect(initialJson.value).toBeDefined();

      // Approve one milestone
      simnet.callPublicFn(
        "milestone-escrow",
        "approve-milestone",
        [uintCV(1), uintCV(0)],
        address1
      );

      const progressAfterOne = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-project-progress",
        [uintCV(1)],
        address1
      );

      const progressJson = cvToJSON(progressAfterOne.result);
      expect(progressJson.type).toBe("(optional (some ))");
      expect(progressJson.value).toBeDefined();
    });

    it("should return none for non-existent project", () => {
      const response = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-project-progress",
        [uintCV(999)],
        address1
      );

      const result = cvToJSON(response.result);
      expect(result.type).toBe("(optional none)");
    });
  });

  describe("read-only functions", () => {
    it("should return correct next project ID", () => {
      const response = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-next-project-id",
        [],
        address1
      );

      expect(cvToJSON(response.result).value).toBe(1);

      // Create a project and check again
      const milestoneAmounts = [uintCV(1000000)];
      simnet.callPublicFn(
        "milestone-escrow",
        "create-project",
        [standardPrincipalCV(address2), listCV(milestoneAmounts)],
        address1
      );

      const responseAfter = simnet.callReadOnlyFn(
        "milestone-escrow",
        "get-next-project-id",
        [],
        address1
      );

      expect(cvToJSON(responseAfter.result).value).toBe(2);
    });
  });
});
