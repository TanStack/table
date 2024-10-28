---
id: table_getExpandedDepth
title: table_getExpandedDepth
---

# Function: table\_getExpandedDepth()

```ts
function table_getExpandedDepth<TFeatures, TData>(table): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L103)
