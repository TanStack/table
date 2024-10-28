---
id: table_setColumnResizing
title: table_setColumnResizing
---

# Function: table\_setColumnResizing()

```ts
function table_setColumnResizing<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`columnResizingState`](../interfaces/columnresizingstate.md)\>

## Returns

`void`

## Defined in

[features/column-resizing/ColumnResizing.utils.ts:229](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/ColumnResizing.utils.ts#L229)
