---
'@tanstack/svelte-table': patch
---

Fix controlled `expanded` and `pagination` state resetting straight after each change. The options store now uses `$state.raw`, so an options sync no longer wraps `data` in a new proxy, which the core row model treated as new data and answered by running its auto-resets.
