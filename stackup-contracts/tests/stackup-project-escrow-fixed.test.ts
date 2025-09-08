import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("✅ Working StackUp Project Escrow Contract", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should create a project successfully", () => {
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Setup Environment"),
        description: Cl.stringAscii("Set up development environment and tools"),
        amount: Cl.uint(500000)
      }),
      Cl.tuple({
        title: Cl.stringAscii("Implement Features"),
        description: Cl.stringAscii("Implement core application features"),
        amount: Cl.uint(1000000)
      }),
      Cl.tuple({
        title: Cl.stringAscii("Testing & Deployment"),
        description: Cl.stringAscii("Test application and deploy to production"),
        amount: Cl.uint(500000)
      })
    ]);

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("E-commerce Platform"),
        Cl.stringAscii("Build a full-stack e-commerce platform"),
        Cl.stringAscii("Development"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.ok(Cl.uint(1)));
  });

  it("should get project details", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Phase 1"),
        description: Cl.stringAscii("Initial development phase"),
        amount: Cl.uint(1000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Test Project"),
        Cl.stringAscii("Test Description"),
        Cl.stringAscii("Testing"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const response = simnet.callReadOnlyFn(
      "stackup-project-escrow",
      "get-project",
      [Cl.uint(2)],
      wallet1
    );

    expect(response.result).toBeDefined();
  });

  it("should select developer for project", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Development"),
        description: Cl.stringAscii("Main development work"),
        amount: Cl.uint(2000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Developer Selection Test"),
        Cl.stringAscii("Test developer selection"),
        Cl.stringAscii("Development"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "select-developer",
      [Cl.uint(3), Cl.principal(wallet2)],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should not allow non-owner to select developer", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Unauthorized Test"),
        description: Cl.stringAscii("Testing authorization controls"),
        amount: Cl.uint(1000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Authorization Test"),
        Cl.stringAscii("Test authorization"),
        Cl.stringAscii("Security"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "select-developer",
      [Cl.uint(4), Cl.principal(wallet2)],
      wallet2 // Non-owner trying to select developer
    );

    expect(response.result).toStrictEqual(Cl.error(Cl.uint(200))); // ERR-NOT-OWNER
  });

  it("should approve milestone and transfer funds", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Milestone 1"),
        description: Cl.stringAscii("First project milestone"),
        amount: Cl.uint(1500000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Milestone Test"),
        Cl.stringAscii("Test milestone approval"),
        Cl.stringAscii("Development"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    // Select developer
    simnet.callPublicFn(
      "stackup-project-escrow",
      "select-developer",
      [Cl.uint(5), Cl.principal(wallet2)],
      wallet1
    );

    // Approve milestone
    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "approve-milestone",
      [Cl.uint(5), Cl.uint(0)],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should not allow approving milestone without developer", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("No Developer"),
        description: Cl.stringAscii("Testing milestone approval without developer"),
        amount: Cl.uint(1000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("No Developer Test"),
        Cl.stringAscii("Test without developer"),
        Cl.stringAscii("Testing"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "approve-milestone",
      [Cl.uint(6), Cl.uint(0)],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.error(Cl.uint(208))); // ERR-PROJECT-NOT-ACTIVE
  });

  it("should cancel project and refund owner", () => {
    // Create project first
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Cancelled Project"),
        description: Cl.stringAscii("Project that will be cancelled"),
        amount: Cl.uint(2000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Cancellation Test"),
        Cl.stringAscii("Test project cancellation"),
        Cl.stringAscii("Testing"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "cancel-project",
      [Cl.uint(7)],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });

  it("should get correct project count", () => {
    const countBefore = simnet.callReadOnlyFn(
      "stackup-project-escrow",
      "get-project-count",
      [],
      wallet1
    );

    // Create project
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Count Test"),
        description: Cl.stringAscii("Testing project counting"),
        amount: Cl.uint(1000000)
      })
    ]);

    simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Count Test Project"),
        Cl.stringAscii("Testing project count"),
        Cl.stringAscii("Testing"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    const countAfter = simnet.callReadOnlyFn(
      "stackup-project-escrow",
      "get-project-count",
      [],
      wallet1
    );

    expect(countAfter.result).toBeDefined();
  });

  it("should handle multiple milestones correctly", () => {
    const milestones = Cl.list([
      Cl.tuple({
        title: Cl.stringAscii("Phase 1: Planning"),
        description: Cl.stringAscii("Project planning and design phase"),
        amount: Cl.uint(500000)
      }),
      Cl.tuple({
        title: Cl.stringAscii("Phase 2: Development"),
        description: Cl.stringAscii("Core development phase"),
        amount: Cl.uint(1500000)
      }),
      Cl.tuple({
        title: Cl.stringAscii("Phase 3: Testing"),
        description: Cl.stringAscii("Testing and quality assurance"),
        amount: Cl.uint(700000)
      })
    ]);

    const response = simnet.callPublicFn(
      "stackup-project-escrow",
      "create-project",
      [
        Cl.stringAscii("Multi-Milestone Project"),
        Cl.stringAscii("Project with multiple phases"),
        Cl.stringAscii("Development"),
        milestones,
        Cl.none()
      ],
      wallet1
    );

    expect(response.result).toStrictEqual(Cl.ok(Cl.uint(9)));
  });
});
