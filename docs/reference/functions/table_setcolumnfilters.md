---
id: table_setColumnFilters
title: table_setColumnFilters
---

# Function: table\_setColumnFilters()

```ts
function table_setColumnFilters<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnFiltersState`](../type-aliases/columnfiltersstate.md)\>

## Returns

`void`

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:147](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L147)
