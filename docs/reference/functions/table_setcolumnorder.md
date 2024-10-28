---
id: table_setColumnOrder
title: table_setColumnOrder
---

# Function: table\_setColumnOrder()

```ts
function table_setColumnOrder<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnOrderState`](../type-aliases/columnorderstate.md)\>

## Returns

`void`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L50)
