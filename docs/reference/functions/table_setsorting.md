---
id: table_setSorting
title: table_setSorting
---

# Function: table\_setSorting()

```ts
function table_setSorting<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`SortingState`](../type-aliases/sortingstate.md)\>

## Returns

`void`

## Defined in

[features/row-sorting/RowSorting.utils.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L11)
