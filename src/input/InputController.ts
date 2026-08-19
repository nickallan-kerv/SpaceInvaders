import type { IInputProvider } from "../types";

export class InputController implements IInputProvider {
  private readonly pressed = new Set<string>();

  public constructor(target: Window) {
    target.addEventListener("keydown", (event) => {
      this.pressed.add(event.code);
    });
    target.addEventListener("keyup", (event) => {
      this.pressed.delete(event.code);
    });
  }

  public isMoveLeftPressed(): boolean {
    return this.pressed.has("ArrowLeft") || this.pressed.has("KeyA");
  }

  public isMoveRightPressed(): boolean {
    return this.pressed.has("ArrowRight") || this.pressed.has("KeyD");
  }

  public isShootPressed(): boolean {
    return this.pressed.has("Space");
  }

  public isStartPressed(): boolean {
    return this.pressed.has("Enter");
  }

  public isPausePressed(): boolean {
    return this.pressed.has("Escape") || this.pressed.has("KeyP");
  }

  public isToggleDebugPressed(): boolean {
    return this.pressed.has("Backquote");
  }

  public isToggleCrtPressed(): boolean {
    return this.pressed.has("KeyT");
  }

  public isToggleHardModePressed(): boolean {
    return this.pressed.has("KeyH");
  }
}
