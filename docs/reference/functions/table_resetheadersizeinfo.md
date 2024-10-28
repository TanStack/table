---
id: table_resetHeaderSizeInfo
title: table_resetHeaderSizeInfo
---

# Function: table\_resetHeaderSizeInfo()

```ts
function table_resetHeaderSizeInfo<TFeatures, TData>(table, defaultState?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **defaultState?**: `boolean`

## Returns

`void`

## Defined in

[features/column-resizing/ColumnResizing.utils.ts:239](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/ColumnResizing.utils.ts#L239)
