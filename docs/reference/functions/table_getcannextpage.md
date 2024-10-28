---
id: table_getCanNextPage
title: table_getCanNextPage
---

# Function: table\_getCanNextPage()

```ts
function table_getCanNextPage<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-pagination/RowPagination.utils.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L137)
