import { describe, expect, it } from "vitest";
import { CollisionService } from "../src/systems/CollisionService";

describe("CollisionService", () => {
  const service = new CollisionService();

  it("reports overlap when rectangles intersect", () => {
    const result = service.overlaps(
      { x: 10, y: 10, width: 30, height: 30 },
      { x: 20, y: 20, width: 30, height: 30 },
    );

    expect(result).toBe(true);
  });

  it("reports no overlap when rectangles are separated", () => {
    const result = service.overlaps(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 50, y: 50, width: 10, height: 10 },
    );

    expect(result).toBe(false);
  });
});
