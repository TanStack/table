# @tanstack/table-core

## 9.2.4

### Patch Changes

- [#6561](https://github.com/TanStack/table/pull/6561) [`f72e516`](https://github.com/TanStack/table/commit/f72e5164bcfe749403ec173035c226f8719647fc) - Skip missing core rows when rebuilding a worker row-model payload so stale worker results cannot crash the table

## 9.2.3

### Patch Changes

- [#6568](https://github.com/TanStack/table/pull/6568) [`468f267`](https://github.com/TanStack/table/commit/468f26768d6f7e31010e14c3363b54696cb6a1eb) - Fix hierarchical filtered row models so `flatRows` lists parents before descendants in both filtering modes, preserves filter metadata on cloned rows, and round-trips nested data correctly through worker-backed row models.

- [#6576](https://github.com/TanStack/table/pull/6576) [`3b94648`](https://github.com/TanStack/table/commit/3b946481795b53a53d6d823cea0ab3e368befec7) - Emit grouped and downstream worker `flatRows` in parent-first preorder.

## 9.1.2

### Patch Changes

- [#6532](https://github.com/TanStack/table/pull/6532) [`ff43666`](https://github.com/TanStack/table/commit/ff436663f808e22091e8a4d2ee7ca81b37ea99c2) - Centralize state updates behind a `setStateSlice` util with an optional structural no-op policy. Equality-guarded slices give their state owner a functional updater that resolves against the owner's latest value and returns the existing reference when nothing changed. Atom and framework state owners can then skip the write and re-render without comparing against a potentially stale controlled table snapshot.

  This removes an entire class of render loops where an auto reset (for example `autoResetExpanded` after a `data` reference change) fired a change handler with a freshly allocated but semantically identical value, causing controlled-state consumers to re-render, produce a new `data` reference, and loop.

  Behavior notes:

  - A custom `onXChange` handler is still invoked for an apparent no-op. Only its state container knows the latest queued value, so it performs the equality check when it applies the guarded updater. This preserves same-tick update composition in frameworks such as React.
  - State updaters are evaluated once, by the state owner. Controlled fallback atoms therefore remain correct if control is later released, and external atom owners do not run functional updaters twice.
  - `stateSlicesEqual` compares enumerable string and symbol keys through the three container levels used by stock state. Sparse arrays remain distinct from explicit `undefined` entries; deeper or non-plain values compare by reference and safely allow the update.
  - Structural equality is opt-in per slice. Opaque `globalFilter` values and row-scaled `rowSelection`/`rowPinning` maps stay direct. The high-frequency `columnSizing`, `columnResizing`, and ordinary cell-selection write paths also avoid a comparison on every pointer update.
  - Auto-reset-prone cell selection applies equality specifically to resets, while its drag handler keeps an O(1) active-focus guard. Expanded state similarly guards reset/auto-reset while ordinary writes stay direct, and toggle-all keeps its explicit O(1) no-op checks.

## 9.1.1

### Patch Changes

- [#6529](https://github.com/TanStack/table/pull/6529) [`269e0d8`](https://github.com/TanStack/table/commit/269e0d81c8b5c128de01cbab4ddb40240a4b8b38) - Fix `getSortedRowModel().flatRows` listing sub-rows before their parent. This restores the parent-first order used by the v8 sorted model and aligns the flattened result with the sorted `rows` tree, core row model, and paginated row model.

## 9.1.0

### Minor Changes

- [#6526](https://github.com/TanStack/table/pull/6526) [`09598d2`](https://github.com/TanStack/table/commit/09598d2e413fe63396d183a8a4fc145c31c6d2ea) - Support `Infinity` as a page size and add `getCanLastPage` for detecting whether a finite last page can be reached.

## 9.0.1

## 9.0.0

### Major Changes

- [#6512](https://github.com/TanStack/table/pull/6512) [`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e) - TanStack Table v9 stable release. See the "Migrating to V9" guide for your framework (e.g. [React](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)) for upgrade instructions.
