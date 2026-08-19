import { GAME_CONFIG } from "../config";
import { BarrierCell } from "../entities/BarrierCell";

export class BarrierSystem {
  public createBarriers(): BarrierCell[] {
    const barriers: BarrierCell[] = [];
    const cfg = GAME_CONFIG.barrier;

    for (let barrierIndex = 0; barrierIndex < cfg.count; barrierIndex += 1) {
      const startX = cfg.startX + barrierIndex * cfg.spacing;
      for (let row = 0; row < cfg.rows; row += 1) {
        for (let col = 0; col < cfg.columns; col += 1) {
          if (this.isGapCell(row, col, cfg.columns)) {
            continue;
          }

          const x = startX + col * cfg.cellSize;
          const y = cfg.startY + row * cfg.cellSize;
          barriers.push(
            new BarrierCell(
              `barrier-${barrierIndex}-${row}-${col}`,
              { x, y, width: cfg.cellSize, height: cfg.cellSize },
              cfg.cellDurability,
            ),
          );
        }
      }
    }

    return barriers;
  }

  private isGapCell(row: number, col: number, width: number): boolean {
    const topCornerCut = (row === 0 || row === 1) && (col === 0 || col === width - 1);
    const centerNotch = (row === 4 || row === 5) && (col === Math.floor(width / 2) - 1 || col === Math.floor(width / 2));
    return topCornerCut || centerNotch;
  }
}
