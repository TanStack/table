---
id: table_getColumnIndexes
title: table_getColumnIndexes
---

# Function: table\_getColumnIndexes()

```ts
function table_getColumnIndexes<TFeatures, TData>(table): ColumnIndexes;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L40)

Builds column-id to index records for each visible pinning region.

All four regions are built in one pass so a single memo entry serves every
`column_getIndex` lookup without per-column scans.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`ColumnIndexes`](../../index/interfaces/ColumnIndexes.md)

## Example

```ts
const indexes = table_getColumnIndexes(table)
```
