# Backlog and Tradeoffs

## Deferred Items

- Additional sprite art passes: current pixel-art style is functional but intentionally minimal.
- Balance tuning by telemetry: hard-mode and streak values currently use hand-tuned defaults.

## Tradeoffs

- Input buffer and movement grace improve feel but may slightly reduce deterministic strictness versus classic arcade behavior.
- Multi-wave formation diversity is implemented with algorithmic patterns instead of hand-authored per-wave files.
- Visual feedback pipeline favors low-cost canvas effects to maintain simplicity and browser portability.

## Next Iteration Candidates

1. Add deterministic seed support for repeatable wave/fire behavior in balancing sessions.
2. Extend streak system with UI meter and timeout indicator.
