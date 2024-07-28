---
id: header_getResizeHandler
title: header_getResizeHandler
---

# Function: header\_getResizeHandler()

```ts
function header_getResizeHandler<TFeatures, TData, TValue>(
   header, 
   table, 
   _contextDocument?): (event) => void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **\_contextDocument?**: `Document`

## Returns

`Function`

### Parameters

• **event**: `unknown`

### Returns

`void`

## Defined in

[features/column-resizing/ColumnResizing.utils.ts:42](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.utils.ts#L42)
