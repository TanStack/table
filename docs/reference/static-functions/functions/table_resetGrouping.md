---
id: table_resetGrouping
title: table_resetGrouping
---

# Function: table\_resetGrouping()

```ts
function table_resetGrouping<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L221)

Resets the table's grouping state slice.

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
table_resetGrouping(table)
table_resetGrouping(table, true)
```
