---
id: table_setColumnFilters
title: table_setColumnFilters
---

# Function: table\_setColumnFilters()

```ts
function table_setColumnFilters<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnFiltersState`](../type-aliases/columnfiltersstate.md)\>

## Returns

`void`

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L172)
