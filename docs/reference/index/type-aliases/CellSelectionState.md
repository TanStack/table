---
id: CellSelectionState
title: CellSelectionState
---

# Type Alias: CellSelectionState

```ts
type CellSelectionState = CellSelectionRange[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L34)

The selected rectangles. The last entry is the active one that shift-extend
and drag operate on.

A bare array, matching `SortingState` and `ColumnFiltersState`. Drag session
state deliberately lives outside this slice as non-reactive instance data, so
nothing here is transient and the whole slice is safe to persist.
