---
id: table_setPageIndex
title: table_setPageIndex
---

# Function: table\_setPageIndex()

```ts
function table_setPageIndex<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<`number`\>

## Returns

`void`

## Defined in

[features/row-pagination/RowPagination.utils.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L55)
