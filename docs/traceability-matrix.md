# Traceability Matrix

| Requirement | Acceptance | Implemented By | Verified By | Status |
| --- | --- | --- | --- | --- |
| RQ-001 | AC-001 | src/entities/Player.ts; src/core/Game.ts | Manual movement boundary playtest | Implemented |
| RQ-002 | AC-002 | src/entities/Projectile.ts; src/core/Game.ts | Manual fire cadence check | Implemented |
| RQ-003 | AC-003 | src/systems/EnemyFormationService.ts | Manual wave spawn inspection | Implemented |
| RQ-004 | AC-004 | src/systems/EnemyFormationService.ts | Manual wall-reversal check | Implemented |
| RQ-005 | AC-005 | src/systems/CollisionService.ts; src/core/Game.ts | tests/collision.test.ts | Implemented |
| RQ-006 | AC-006 | src/core/Game.ts; src/render/CanvasRenderer.ts | tests/game-state.test.ts; manual overlay check | Implemented |
| RQ-007 | AC-007 | src/core/Game.ts | Manual lose-line run | Implemented |
| RQ-008 | AC-008 | src/core/Game.ts; src/input/InputController.ts | tests/game-state.test.ts | Implemented |
| RQ-009 | AC-009 | src/systems/EnemyFireSystem.ts; src/entities/Projectile.ts | tests/enemy-fire-system.test.ts | Implemented |
| RQ-010 | AC-010 | src/systems/EnemyFireSystem.ts | tests/enemy-fire-system.test.ts | Implemented |
| RQ-011 | AC-011 | src/systems/BarrierSystem.ts; src/entities/BarrierCell.ts; src/render/CanvasRenderer.ts | tests/barrier-system.test.ts; manual barrier silhouette check | Implemented |
| RQ-012 | AC-012 | src/entities/BarrierCell.ts; src/core/Game.ts | tests/barrier-system.test.ts; manual projectile collision checks | Implemented |
| RQ-013 | AC-013 | src/core/Game.ts; src/entities/Projectile.ts | Manual enemy-hit life-loss check | Implemented |
| RQ-014 | AC-014 | src/systems/EffectsService.ts; src/core/Game.ts | Manual hit-feedback pass | Implemented |
| RQ-015 | AC-015 | src/systems/EffectsService.ts; src/render/CanvasRenderer.ts | Manual flash visibility pass | Implemented |
| RQ-016 | AC-016 | src/systems/EffectsService.ts; src/render/CanvasRenderer.ts | Manual particle check | Implemented |
| RQ-017 | AC-017 | src/systems/EffectsService.ts; src/render/CanvasRenderer.ts | Manual recoil check | Implemented |
| RQ-018 | AC-018 | src/core/Game.ts | Manual buffered tap check | Implemented |
| RQ-019 | AC-019 | src/core/Game.ts; src/entities/Player.ts | Manual movement inertia check | Implemented |
| RQ-020 | AC-020 | src/systems/EnemyFormationService.ts; src/core/Game.ts | tests/enemy-formation-speed.test.ts | Implemented |
| RQ-021 | AC-021 | src/render/CanvasRenderer.ts | Manual sprite render check | Implemented |
| RQ-022 | AC-022 | src/render/CanvasRenderer.ts | Manual parallax check | Implemented |
| RQ-023 | AC-023 | src/render/CanvasRenderer.ts; src/core/Game.ts | Manual toggle check | Implemented |
| RQ-024 | AC-024 | src/entities/Enemy.ts; src/systems/EnemyFormationService.ts; src/core/Game.ts | Manual row-scoring check | Implemented |
| RQ-025 | AC-025 | src/core/Game.ts; src/input/InputController.ts | tests/game-state.test.ts | Implemented |
| RQ-026 | AC-026 | src/render/CanvasRenderer.ts | Manual overlay copy check | Implemented |
| RQ-027 | AC-027 | src/core/Game.ts; src/render/CanvasRenderer.ts | Manual high-score check | Implemented |
| RQ-028 | AC-028 | src/core/Game.ts; src/render/CanvasRenderer.ts | tests/game-state.test.ts; manual countdown check | Implemented |
| RQ-029 | AC-029 | src/systems/EnemyFormationService.ts; src/core/Game.ts | Manual multi-wave progression check | Implemented |
| RQ-030 | AC-030 | src/core/Game.ts; src/systems/EnemyFireSystem.ts | Manual hard-mode cadence check | Implemented |
| RQ-031 | AC-031 | src/core/Game.ts | Manual streak progression check | Implemented |
| RQ-033 | AC-033 | src/core/Game.ts; src/render/CanvasRenderer.ts | Manual debug overlay toggle check | Implemented |
| RQ-034 | AC-034 | docs/traceability-matrix.md | Document review | Implemented |
| RQ-035 | AC-035 | docs/demo-script.md | Document walkthrough | Implemented |
| RQ-036 | AC-036 | docs/backlog.md | Document review | Implemented |
| RQ-037 | AC-037 | src/systems/EffectsService.ts; src/core/Game.ts | Manual feedback pipeline check | Implemented |
| RQ-038 | AC-038 | docs/spec.md | Scope audit | Implemented |
| RQ-039 | AC-039 | src/core/Game.ts; src/systems/*.ts | Architecture review | Implemented |
| RQ-040 | AC-040 | tests/enemy-fire-system.test.ts; tests/enemy-formation-speed.test.ts; tests/game-state.test.ts | npm run test | Implemented |
| RQ-041 | AC-041 | src/core/Game.ts; src/render/CanvasRenderer.ts | Manual respawn replacement float check | Implemented |
