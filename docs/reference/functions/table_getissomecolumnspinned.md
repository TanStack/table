---
id: table_getIsSomeColumnsPinned
title: table_getIsSomeColumnsPinned
---

# Function: table\_getIsSomeColumnsPinned()

```ts
function table_getIsSomeColumnsPinned<TFeatures, TData>(table, position?): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

## Returns

`boolean`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L184)
