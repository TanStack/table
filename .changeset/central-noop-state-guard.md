---
'@tanstack/table-core': patch
---

Centralize state updates behind a `setStateSlice` util that skips no-op writes. Every `table.setX` router now resolves the updater once against the slice's current value and compares the result with `stateSlicesEqual`; when nothing changed, the `onXChange` handler is not called, no atom is written, and no re-render is triggered. This applies uniformly to setters, toggles, resets, and auto resets across all state slices, for both internally owned and externally controlled state.

This removes an entire class of render loops where an auto reset (for example `autoResetExpanded` after a `data` reference change) fired a change handler with a freshly allocated but semantically identical value, causing controlled-state consumers to re-render, produce a new `data` reference, and loop.

Behavior notes:

- `onXChange` handlers are now state-change events, not intent events: they no longer fire when the update resolves to a structurally equal value, including a newly allocated but equivalent object.
- `stateSlicesEqual` compares exactly as deep as stock feature state nests: a container whose entries may be one more flat container (array of flat objects like `sorting`/`columnFilters`/`cellSelection`, object of flat arrays like `columnPinning`). Deeper values, such as an array-valued filter value, compare by reference and simply let the update fire.
- State updaters must be pure. For uncontrolled state the original updater runs exactly once; user-provided handlers still receive the original updater so host state containers can resolve it against their own latest state.
- Sequential same-tick updates to a controlled slice compare against the last committed value, matching the semantics of the previous ad-hoc guards.
- The previous ad-hoc guards in `resetPageIndex`, `resetPageSize`, `toggleAllRowsExpanded`, and the cell-selection drag handler were removed in favor of the central compare.
- `rowSelection` is deliberately exempt from the guard: it has no auto reset (so no render-loop risk), every write comes from a user gesture or an explicit reset, and selection maps are the one slice that scales with row count, where the structural compare would be the only guard cost that grows with data size.
