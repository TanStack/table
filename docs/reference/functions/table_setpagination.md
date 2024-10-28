---
id: table_setPagination
title: table_setPagination
---

# Function: table\_setPagination()

```ts
function table_setPagination<TFeatures, TData>(table, updater): undefined | void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`PaginationState`](../interfaces/paginationstate.md)\>

## Returns

`undefined` \| `void`

## Defined in

[features/row-pagination/RowPagination.utils.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L30)
