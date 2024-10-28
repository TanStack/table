---
id: table_getIsAllRowsExpanded
title: table_getIsAllRowsExpanded
---

# Function: table\_getIsAllRowsExpanded()

```ts
function table_getIsAllRowsExpanded<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L79)
