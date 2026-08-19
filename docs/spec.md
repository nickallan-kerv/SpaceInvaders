# Allan vs Aliens Specification

## Objective
Build a playable Allan vs Aliens demo that showcases specification-driven design with traceable requirements, acceptance criteria, and SOLID-oriented architecture.

## Functional Requirements

- RQ-001: The player can move left and right inside the playfield bounds.
- RQ-002: The player can fire upward projectiles with a cooldown.
- RQ-003: Enemies spawn in a grid and move as a formation.
- RQ-004: Enemy formation reverses direction at horizontal bounds and descends after each reversal.
- RQ-005: Projectile and enemy collisions remove both entities and award score.
- RQ-006: The game has explicit states: ready, countdown, playing, paused, won, and lost.
- RQ-007: If enemies reach the lose line, the player loses a life; reaching zero lives ends the game.
- RQ-008: The game can start or restart using Enter.
- RQ-009: Enemies can fire downward projectiles while alive.
- RQ-010: Enemy firing candidates are restricted to the lowest alive enemy in each column.
- RQ-011: Four classic-style segmented barriers with an arcade-inspired bunker silhouette sit between the player and enemy formation.
- RQ-012: Barrier segments absorb both player and enemy projectiles and degrade until destroyed.
- RQ-013: Enemy projectiles can collide with the player and reduce life count.
- RQ-014: Screen shake is triggered on successful enemy hits.
- RQ-015: Enemy and player hit flashes provide instant damage feedback.
- RQ-016: Enemy destruction emits a particle burst.
- RQ-017: Player firing applies subtle recoil.
- RQ-018: Shooting supports a short input buffer window.
- RQ-019: Movement applies inertia-like drift and continues the last horizontal direction for 0.3 seconds after left/right release.
- RQ-020: Enemy formation speed scales upward as alive enemy count drops.
- RQ-021: Player and enemy rendering uses simple pixel-art-style sprites instead of plain rectangles.
- RQ-022: A parallax starfield background drifts over time.
- RQ-023: A CRT/scanline post-effect can be toggled.
- RQ-024: Enemy rows are color-coded and use row-based score values.
- RQ-025: State flow supports start, pause, resume, and restart.
- RQ-026: Overlay prompts communicate objective and controls.
- RQ-027: Round-end overlay can call out a new high score.
- RQ-028: A short countdown precedes active gameplay.
- RQ-029: The game provides 2-3 curated enemy wave formations.
- RQ-030: A hard mode increases enemy shooting pressure.
- RQ-031: Hit streaks provide a score multiplier.
- RQ-033: A HUD debug overlay can display requirement context.
- RQ-034: Traceability matrix includes implemented-by and verified-by references.
- RQ-035: A demo script maps gameplay features to requirements and acceptance criteria.
- RQ-036: A backlog records deferred items and known tradeoffs.
- RQ-037: Feedback visuals are coordinated through a dedicated EffectsService.
- RQ-038: Audio features and audio service abstractions are out of scope for this project.
- RQ-039: Game remains an orchestrator and delegates mechanics to focused services/systems.
- RQ-040: Automated tests cover cooldown logic, speed ramp logic, and game state transitions.
- RQ-041: When the player loses a life and a replacement craft appears, the replacement craft floats upward with a clearly visible spawn cue using configurable duration and travel distance.

## Acceptance Criteria

- AC-001: Given ready state, when left/right input is active in playing state, then player x-position changes and never crosses screen bounds.
- AC-002: Given playing state, when shoot input is active and cooldown is complete, then one projectile appears above the player.
- AC-003: Given a new wave, when enemies are created, then a configured formation is visible.
- AC-004: Given formation movement, when a side wall is reached, then direction flips and enemies move down.
- AC-005: Given an overlap between player projectile and enemy, then both are removed and score increases by the enemy row value.
- AC-006: Given non-playing states, then contextual overlays are visible; given playing state, overlays are hidden.
- AC-007: Given enemies crossing lose line, then life count decrements and game ends once life count is zero.
- AC-008: Given Enter key from ready/won/lost, then a fresh round begins.
- AC-009: Given active enemies and elapsed cooldown, then an enemy projectile can spawn and travel downward.
- AC-010: Given enemies stacked in a column, then only the bottom-most alive enemy in that column is eligible to shoot.
- AC-011: Given a new round, then four segmented barriers with an arcade bunker silhouette are visible in front of the player.
- AC-012: Given projectile overlap with a barrier segment, then projectile is removed and segment durability decreases.
- AC-013: Given enemy projectile collision with player, then life is removed and lost state is reached at zero lives.
- AC-014: Given enemy destruction, then a short camera shake is visible.
- AC-015: Given player or enemy hit events, then a brief flash effect is visible on the hit target.
- AC-016: Given enemy destruction, then a short-lived particle burst is visible.
- AC-017: Given player firing, then recoil animation is visible.
- AC-018: Given a shoot tap shortly before cooldown expiry, then shot still triggers within the configured buffer.
- AC-019: Given left/right input release while playing, then the craft continues moving in the last direction for 0.3 seconds and eases speed changes to feel inertia-like.
- AC-020: Given fewer remaining enemies, then measured horizontal formation speed is higher.
- AC-021: Given active rendering, then player and enemy are drawn in sprite-like pixel blocks.
- AC-022: Given active rendering, then at least two star layers drift at different rates.
- AC-023: Given CRT toggle input, then scanline overlay toggles on/off.
- AC-024: Given enemy kills from different rows, then awarded points differ by row.
- AC-025: Given playing state and pause input, then state transitions to paused; given resume input, state returns to playing.
- AC-026: Given ready overlay, then controls and objective text are visible.
- AC-027: Given round-end score above prior high score, then new high score callout is shown.
- AC-028: Given start of round/wave, then countdown is shown before playing state resumes.
- AC-029: Given wave progression, then at least three formation variants can appear.
- AC-030: Given hard mode enabled, then enemy firing cadence increases.
- AC-031: Given sustained hit streak, then score multiplier rises; given streak timeout or player hit, multiplier resets.
- AC-033: Given debug toggle, then requirement-aware debug lines are visible.
- AC-034: Given traceability matrix, then each row contains implemented-by and verified-by references.
- AC-035: Given demo-script document, then each scripted step references one or more requirement IDs.
- AC-036: Given backlog document, then deferred items include rationale/tradeoff notes.
- AC-037: Given feedback events, then effects are triggered via EffectsService integration points.
- AC-038: Given project scope, then audio features are absent.
- AC-039: Given architecture review, then Game delegates collision, formation, enemy fire, barriers, scoring, and effects behaviors.
- AC-040: Given automated test run, then cooldown/speed-ramp/state-transition tests execute and pass.
- AC-041: Given a player hit that does not end the round, when the replacement craft appears, then it visibly floats upward over approximately 1.8 seconds with enough travel distance to be obvious during active play.

## Non-Goals

- Audio implementation
- Audio service abstraction
- Multiple level theme packs
- Power-ups beyond listed optional mechanics
- Advanced barrier variants beyond base segmented set
