---
'@tanstack/table-core': patch
---

Centralize state updates behind a `setStateSlice` util with an optional structural no-op policy. Equality-guarded slices give their state owner a functional updater that resolves against the owner's latest value and returns the existing reference when nothing changed. Atom and framework state owners can then skip the write and re-render without comparing against a potentially stale controlled table snapshot.

This removes an entire class of render loops where an auto reset (for example `autoResetExpanded` after a `data` reference change) fired a change handler with a freshly allocated but semantically identical value, causing controlled-state consumers to re-render, produce a new `data` reference, and loop.

Behavior notes:

- A custom `onXChange` handler is still invoked for an apparent no-op. Only its state container knows the latest queued value, so it performs the equality check when it applies the guarded updater. This preserves same-tick update composition in frameworks such as React.
- State updaters are evaluated once, by the state owner. Controlled fallback atoms therefore remain correct if control is later released, and external atom owners do not run functional updaters twice.
- `stateSlicesEqual` compares enumerable string and symbol keys through the three container levels used by stock state. Sparse arrays remain distinct from explicit `undefined` entries; deeper or non-plain values compare by reference and safely allow the update.
- Structural equality is opt-in per slice. Opaque `globalFilter` values and row-scaled `rowSelection`/`rowPinning` maps stay direct. The high-frequency `columnSizing`, `columnResizing`, and ordinary cell-selection write paths also avoid a comparison on every pointer update.
- Auto-reset-prone cell selection applies equality specifically to resets, while its drag handler keeps an O(1) active-focus guard. Expanded state similarly guards reset/auto-reset while ordinary writes stay direct, and toggle-all keeps its explicit O(1) no-op checks.
