---
'@tanstack/table-core': patch
---

Make `table.resetExpanded()` a no-op when the target state already matches the current expanded state, so it no longer fires `onExpandedChange` with a new-but-equal map. `row.toggleExpanded()` and `table.toggleAllRowsExpanded()` already early-return this way. Because the core row model auto-resets `expanded` on every `data` reference change, the unguarded write could drive a controlled table with an unstable `data` reference into an unbounded render loop.
