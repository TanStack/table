---
id: table_getCanPreviousPage
title: table_getCanPreviousPage
---

# Function: table\_getCanPreviousPage()

```ts
function table_getCanPreviousPage<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-pagination/RowPagination.utils.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L130)
