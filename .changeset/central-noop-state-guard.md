---
'@tanstack/table-core': patch
---

Centralize state updates behind a `setStateSlice` util that skips no-op writes. Every `table.setX` router now resolves the updater once against the slice's current value and structurally compares the result; when nothing changed, the `onXChange` handler is not called, no atom is written, and no re-render is triggered. This applies uniformly to setters, toggles, resets, and auto resets across all state slices, for both internally owned and externally controlled state.

This removes an entire class of render loops where an auto reset (for example `autoResetExpanded` after a `data` reference change) fired a change handler with a freshly allocated but semantically identical value, causing controlled-state consumers to re-render, produce a new `data` reference, and loop.

Behavior notes:

- `onXChange` handlers are now state-change events, not intent events: they no longer fire for updates that resolve to a structurally equal state (matching `useState` identity-bail semantics).
- State updaters must be pure. For uncontrolled state the original updater runs exactly once; user-provided handlers still receive the original updater so host state containers can resolve it against their own latest state.
- The previous ad-hoc guards in `resetPageIndex`, `resetPageSize`, `toggleAllRowsExpanded`, and the cell-selection drag handler were removed in favor of the central compare.
