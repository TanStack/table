---
id: Table_CellSelection
title: Table_CellSelection
---

# Interface: Table\_CellSelection\<TFeatures, TData\>

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:193](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L193)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:206](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L206)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L213)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L217)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L224)

Returns the selected ranges resolved into inclusive display-order indexes.

This is the memoized cache every per-cell read goes through. Ranges whose
corners no longer resolve are omitted.

#### Returns

[`CellSelectionBounds`](CellSelectionBounds.md)[]

***

### getCellSelectionColumnIds()

```ts
getCellSelectionColumnIds: () => string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L228)

Returns the ids of all columns intersected by the selection.

#### Returns

`string`[]

***

### getCellSelectionColumnIndexes()

```ts
getCellSelectionColumnIndexes: () => Record<string, number>;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:237](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L237)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:241](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L241)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:245](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L245)

Returns the active cell, i.e. the anchor of the most recent range.

#### Returns

  \| [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `any`\>
  \| `undefined`

***

### getSelectedCellCount()

```ts
getSelectedCellCount: () => number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:252](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L252)

Returns the number of selected cells.

Computed as rectangle arithmetic. Falls back to enumerating cells when
`enableCellSelection` is a per-cell predicate.

#### Returns

`number`

***

### getSelectedCellIds()

```ts
getSelectedCellIds: () => string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:259](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L259)

Returns the ids of all selected cells, in row-major order per range.

This expands the selection, so it costs one pass over the selected area.
It is memoized and never runs unless called.

#### Returns

`string`[]

***

### getSelectedCellRangesData()

```ts
getSelectedCellRangesData: () => unknown[][][];
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L267)

Returns each selected range's values as a row-major grid.

Indexed as `[rangeIndex][rowIndex][columnIndex]`. Serializing this to
clipboard text is left to userland, since the delimiter, the null
representation, and any quoting rules are application decisions.

#### Returns

`unknown`[][][]

***

### moveCellSelection()

```ts
moveCellSelection: (direction) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:272](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L272)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:278](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L278)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:282](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L282)

Selects every selectable cell in the table as one range.

#### Returns

`void`

***

### selectCellRange()

```ts
selectCellRange: (range, opts?) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:286](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L286)

Selects a rectangle, replacing the current selection unless `additive`.

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:293](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L293)

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

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:297](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L297)

Collapses the selection to a single cell at the given coordinates.

#### Parameters

##### rowId

`string`

##### columnId

`string`

#### Returns

`void`
