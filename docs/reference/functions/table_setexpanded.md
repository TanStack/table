---
id: table_setExpanded
title: table_setExpanded
---

# Function: table\_setExpanded()

```ts
function table_setExpanded<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ExpandedState`](../type-aliases/expandedstate.md)\>

## Returns

`void`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L24)
