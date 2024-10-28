---
id: table_getPageOptions
title: table_getPageOptions
---

# Function: table\_getPageOptions()

```ts
function table_getPageOptions<TFeatures, TData>(table): number[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`[]

## Defined in

[features/row-pagination/RowPagination.utils.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L118)
