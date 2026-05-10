---
id: table_resetRowSelection
title: table_resetRowSelection
---

# Function: table\_resetRowSelection()

```ts
function table_resetRowSelection<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L56)

Resets the table's row selection state slice.

By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetRowSelection(table)
table_resetRowSelection(table, true)
```
