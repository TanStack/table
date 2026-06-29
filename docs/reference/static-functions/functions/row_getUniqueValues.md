---
id: row_getUniqueValues
title: row_getUniqueValues
---

# Function: row\_getUniqueValues()

```ts
function row_getUniqueValues<TFeatures, TData>(row, columnId): unknown;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L50)

Reads and caches the values used by faceting/grouping for a column.

If the column defines `getUniqueValues`, that result is used. Otherwise the
row's accessor value is wrapped in a single-item array.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

`unknown`

## Example

```ts
const values = row_getUniqueValues(row, 'tags')
```
