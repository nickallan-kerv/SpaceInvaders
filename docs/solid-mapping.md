# SOLID Mapping

## Single Responsibility Principle

- InputController only handles keyboard state and key-mapping queries.
- CollisionService only evaluates geometric overlap checks.
- EnemyFormationService only creates wave formations and computes movement scaling.
- EnemyFireSystem only determines eligible shooters and enemy fire timing.
- BarrierSystem only creates segmented barrier structures.
- EffectsService only coordinates shake, flash, recoil, and particle states.
- ScoreService only manages score state changes.
- CanvasRenderer only renders visual layers and overlays.
- Game orchestrates state transitions and composes services without owning low-level mechanics.

## Open/Closed Principle

- Game behavior extends via composable services (formation, fire, effects, barriers) without rewriting core entity contracts.
- Wave patterns are selected by index and can be expanded without changing orchestration structure.

## Liskov Substitution Principle

- Player, Enemy, Projectile, and BarrierCell all satisfy IEntity semantics where mutable gameplay entities are expected.

## Interface Segregation Principle

- IInputProvider exposes only gameplay-focused input queries.
- ICollisionService exposes only overlap operations needed by gameplay interactions.

## Dependency Inversion Principle

- Game depends on abstractions for input and delegated systems for domain behaviors.
- Rendering remains injected and externalized from game-state mutation.
- Gameplay feedback logic is inverted into EffectsService rather than embedded directly in Game or entities.
