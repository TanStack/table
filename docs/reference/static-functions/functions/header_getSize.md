---
id: header_getSize
title: header_getSize
---

# Function: header\_getSize()

```ts
function header_getSize<TFeatures, TData, TValue>(header): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:193](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L193)

Computes a header's rendered size from its leaf headers.

Group headers sum the sizes of all descendant leaf columns. Leaf headers use
their column's current size.

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

## Returns

`number`

## Example

```ts
const width = header_getSize(header)
```
