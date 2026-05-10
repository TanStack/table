---
id: row_getParentRow
title: row_getParentRow
---

# Function: row\_getParentRow()

```ts
function row_getParentRow<TFeatures, TData>(row): 
  | Row<TFeatures, TData>
  | undefined;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L120)

Returns parent row for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

  \| [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>
  \| `undefined`

## Example

```ts
const value = row_getParentRow(row)
```
