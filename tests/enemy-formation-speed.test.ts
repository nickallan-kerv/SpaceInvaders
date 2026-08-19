import { describe, expect, it } from "vitest";
import { EnemyFormationService } from "../src/systems/EnemyFormationService";

describe("EnemyFormationService speed ramp", () => {
  it("increases speed multiplier as enemies are defeated", () => {
    const service = new EnemyFormationService();

    const full = service.getSpeedMultiplier(36, 36);
    const half = service.getSpeedMultiplier(18, 36);
    const low = service.getSpeedMultiplier(4, 36);

    expect(full).toBe(1);
    expect(half).toBeGreaterThan(full);
    expect(low).toBeGreaterThan(half);
  });
});
