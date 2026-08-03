---
id: Table_CellSelection
title: Table_CellSelection
---

# Interface: Table\_CellSelection\<TFeatures, TData\>

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L208)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_isSelectingCells

```ts
_isSelectingCells: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L221)

**`Internal`**

Whether a drag selection is currently open.

Non-reactive instance data rather than state: only the mouse handlers read
it, nothing renders from it, and keeping it out of the slice means a
selection persisted mid-drag cannot rehydrate into a stuck drag.

***

### autoResetCellSelection()

```ts
autoResetCellSelection: () => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L228)

Schedules a cell selection reset after `data` changes.

Honors `autoResetAll` and `autoResetCellSelection`. Called by the core row
model; you rarely need to invoke it yourself.

#### Returns

`void`

***

### extendCellSelection()

```ts
extendCellSelection: (direction) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:232](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L232)

Extends the active range one step in a direction, keeping its anchor fixed.

#### Parameters

##### direction

[`CellSelectionDirection`](../type-aliases/CellSelectionDirection.md)

#### Returns

`void`

***

### getCellSelectionBounds()

```ts
getCellSelectionBounds: () => CellSelectionBounds[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:240](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L240)

Returns the final positive selection as disjoint, inclusive display-order
index rectangles after all include and exclude operations are applied.

This is the memoized cache every per-cell read goes through. Ranges whose
corners no longer resolve are omitted.

#### Returns

[`CellSelectionBounds`](CellSelectionBounds.md)[]

***

### getCellSelectionColumnIds()

```ts
getCellSelectionColumnIds: () => string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:244](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L244)

Returns the ids of all columns intersected by the selection.

#### Returns

`string`[]

***

### getCellSelectionColumnIndexes()

```ts
getCellSelectionColumnIndexes: () => Record<string, number>;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:253](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L253)

**`Internal`**

Returns a column id to display-index map for the current column order.

Registered so the lookup stays memoized even when `columnOrderingFeature`
is absent, since its `getColumnIndexes` static rebuilds on every call.

#### Returns

`Record`\<`string`, `number`\>

***

### getCellSelectionRowIds()

```ts
getCellSelectionRowIds: () => string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:257](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L257)

Returns the ids of all rows intersected by the selection.

#### Returns

`string`[]

***

### getFocusedCell()

```ts
getFocusedCell: () =>
  | Cell<TFeatures, TData, any>
  | undefined;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:262](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L262)

Returns the active cell, i.e. the anchor of the most recent operation.
An exclusion's active cell is focused even though it is not selected.

#### Returns

  \| [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `any`\>
  \| `undefined`

***

### getSelectedCellCount()

```ts
getSelectedCellCount: () => number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:269](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L269)

Returns the number of selected cells.

Computed with rectangle arithmetic unless a per-cell
`enableCellSelection` predicate requires enumeration.

#### Returns

`number`

***

### getSelectedCellIds()

```ts
getSelectedCellIds: () => string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:276](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L276)

Returns the unique ids of all selected cells, in row-major order.

This expands the selection, so it costs one pass over the selected area.
It is memoized and never runs unless called.

#### Returns

`string`[]

***

### getSelectedCellRangesData()

```ts
getSelectedCellRangesData: () => unknown[][][];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:284](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L284)

Returns each final positive selection region's values as a row-major grid.

Indexed as `[regionIndex][rowIndex][columnIndex]`. Serializing this to
clipboard text is left to userland, since the delimiter, the null
representation, and any quoting rules are application decisions.

#### Returns

`unknown`[][][]

***

### moveCellSelection()

```ts
moveCellSelection: (direction) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L289)

Moves the selection one step in a direction, collapsing it to a single
cell. Columns that cannot be selected are skipped over.

#### Parameters

##### direction

[`CellSelectionDirection`](../type-aliases/CellSelectionDirection.md)

#### Returns

`void`

***

### resetCellSelection()

```ts
resetCellSelection: (defaultState?) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:295](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L295)

Resets `cellSelection` to `initialState.cellSelection`.

Pass `true` to ignore initial state and reset to an empty selection.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### selectAllCells()

```ts
selectAllCells: () => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:299](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L299)

Selects every selectable cell in the table as one range.

#### Returns

`void`

***

### selectCellRange()

```ts
selectCellRange: (range, opts?) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:303](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L303)

Selects a rectangle using the requested replace/include/exclude mode.

#### Parameters

##### range

[`CellSelectionRange`](CellSelectionRange.md)

##### opts?

[`SelectCellRangeOptions`](SelectCellRangeOptions.md)

#### Returns

`void`

***

### setCellSelection()

```ts
setCellSelection: (updater) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:310](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L310)

Updates cell selection state with a next value or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`CellSelectionState`](../type-aliases/CellSelectionState.md)\>

#### Returns

`void`

***

### setFocusedCell()

```ts
setFocusedCell: (rowId, columnId) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:314](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L314)

Collapses the selection to a single cell at the given coordinates.

#### Parameters

##### rowId

`string`

##### columnId

`string`

#### Returns

`void`
