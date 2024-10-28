---
id: header_getResizeHandler
title: header_getResizeHandler
---

# Function: header\_getResizeHandler()

```ts
function header_getResizeHandler<TFeatures, TData, TValue>(header, _contextDocument?): (event) => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

• **\_contextDocument?**: `Document`

## Returns

`Function`

### Parameters

• **event**: `unknown`

### Returns

`void`

## Defined in

[features/column-resizing/ColumnResizing.utils.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/ColumnResizing.utils.ts#L58)
