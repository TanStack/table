---
id: table_setColumnSizing
title: table_setColumnSizing
---

# Function: table\_setColumnSizing()

```ts
function table_setColumnSizing<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnSizingState`](../type-aliases/columnsizingstate.md)\>

## Returns

`void`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L128)
