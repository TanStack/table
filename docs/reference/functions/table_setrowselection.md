---
id: table_setRowSelection
title: table_setRowSelection
---

# Function: table\_setRowSelection()

```ts
function table_setRowSelection<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`RowSelectionState`](../type-aliases/rowselectionstate.md)\>

## Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L14)
