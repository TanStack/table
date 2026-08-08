---
id: cell_getSelectionStartHandler
title: cell_getSelectionStartHandler
---

# Function: cell\_getSelectionStartHandler()

```ts
function cell_getSelectionStartHandler<TFeatures, TData, TValue>(cell, _contextDocument?): (e) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1408](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1408)

Creates a handler that begins a selection at this cell.

Follows `header_getResizeHandler`: the enable check is resolved once outside
the returned closure and guarded again inside it, the document is injectable
for SSR and cross-document rendering, and the document-level `mouseup`
listener is attached here so a drag released outside the table still ends.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

### \_contextDocument?

`Document`

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

## Example

```tsx
<td onMouseDown={cell.getSelectionStartHandler()} />
```
