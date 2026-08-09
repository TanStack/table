---
id: cell_getSelectionExtendHandler
title: cell_getSelectionExtendHandler
---

# Function: cell\_getSelectionExtendHandler()

```ts
function cell_getSelectionExtendHandler<TFeatures, TData, TValue>(cell): (_e) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1490](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1490)

Creates a handler that extends the active range to this cell during a drag.

No rAF coalescing is needed here, unlike the resize handler: `mouseenter`
fires once per cell boundary crossed rather than continuously, and deferring
it by a frame would only delay the highlight.

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

## Returns

```ts
(_e): void;
```

### Parameters

#### \_e

`unknown`

### Returns

`void`

## Example

```tsx
<td onMouseEnter={cell.getSelectionExtendHandler()} />
```
