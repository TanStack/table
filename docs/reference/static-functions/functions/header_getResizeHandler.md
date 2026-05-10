---
id: header_getResizeHandler
title: header_getResizeHandler
---

# Function: header\_getResizeHandler()

```ts
function header_getResizeHandler<TFeatures, TData, TValue>(header, _contextDocument?): (event) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L88)

Returns resize handler for a header.

This is the static implementation behind the matching header instance API and can account for nested header groups.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### header

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>

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

## Example

```ts
const onMouseDown = header_getResizeHandler(header)
```
