---
id: row_getUniqueValues
title: row_getUniqueValues
---

# Function: row\_getUniqueValues()

```ts
function row_getUniqueValues<TFeatures, TData>(row, columnId): unknown;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L48)

Returns unique values for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

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
const value = row_getUniqueValues(row)
```
