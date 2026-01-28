---
id: header_getResizeHandler
title: header_getResizeHandler
---

# Function: header\_getResizeHandler()

```ts
function header_getResizeHandler<TFeatures, TData, TValue>(header, _contextDocument?): (event) => void;
```

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L45)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### header

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>

### \_contextDocument?

`Document`

## Returns

```ts
(event): void;
```

### Parameters

#### event

`unknown`

### Returns

`void`
