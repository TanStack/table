---
id: row_getValue
title: row_getValue
---

# Function: row\_getValue()

```ts
function row_getValue<TFeatures, TData>(row, columnId): unknown;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L20)

Reads and caches this row's value for a column.

The value is produced by the column accessor. Missing columns or display
columns without an accessor return `undefined`.

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
const firstName = row_getValue(row, 'firstName')
```
