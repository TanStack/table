---
id: table_getColumn
title: table_getColumn
---

# Function: table\_getColumn()

```ts
function table_getColumn<TFeatures, TData>(table, columnId): 
  | Column<TFeatures, TData, unknown>
  | undefined;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.utils.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L146)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

  \| [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>
  \| `undefined`
