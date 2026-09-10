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

Defined in: [core/rows/coreRowsFeature.utils.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L199)

Looks up this row's direct parent, if it has one.

Parent lookup prefers the core row model for structural parents, then falls
back to the pre-pagination row model for generated parent rows.

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
const parent = row_getParentRow(row)
```
