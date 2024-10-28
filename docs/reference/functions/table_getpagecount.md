---
id: table_getPageCount
title: table_getPageCount
---

# Function: table\_getPageCount()

```ts
function table_getPageCount<TFeatures, TData>(table): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Defined in

[features/row-pagination/RowPagination.utils.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L187)
