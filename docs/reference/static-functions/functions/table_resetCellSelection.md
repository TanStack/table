---
id: table_resetCellSelection
title: table_resetCellSelection
---

# Function: table\_resetCellSelection()

```ts
function table_resetCellSelection<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L70)

Resets `cellSelection` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.cellSelection` when it
exists. Passing `true` ignores initial state and resets to an empty selection.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetCellSelection(table, true)
```
