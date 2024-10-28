---
id: table_setColumnVisibility
title: table_setColumnVisibility
---

# Function: table\_setColumnVisibility()

```ts
function table_setColumnVisibility<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnVisibilityState`](../type-aliases/columnvisibilitystate.md)\>

## Returns

`void`

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L141)
