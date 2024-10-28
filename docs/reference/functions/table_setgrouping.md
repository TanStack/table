---
id: table_setGrouping
title: table_setGrouping
---

# Function: table\_setGrouping()

```ts
function table_setGrouping<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`GroupingState`](../type-aliases/groupingstate.md)\>

## Returns

`void`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L138)
