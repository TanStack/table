---
id: header_getResizeHandler
title: header_getResizeHandler
---

# Function: header\_getResizeHandler()

```ts
function header_getResizeHandler<TFeatures, TData, TValue>(header, _contextDocument?): (event) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L91)

Creates the pointer/touch start handler for resizing a header.

The handler records starting sizes for all leaf headers, tracks drag deltas,
writes transient resize info, and commits column sizes on change or drag end
depending on `columnResizeMode`.

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
