---
id: table_toggleAllRowsExpanded
title: table_toggleAllRowsExpanded
---

# Function: table\_toggleAllRowsExpanded()

```ts
function table_toggleAllRowsExpanded<TFeatures, TData>(table, expanded?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **expanded?**: `boolean`

## Returns

`void`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L31)
