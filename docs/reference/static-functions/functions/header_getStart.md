---
id: header_getStart
title: header_getStart
---

# Function: header\_getStart()

```ts
function header_getStart<TFeatures, TData, TValue>(header): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L224)

Computes a header's offset from the start of its header group.

The offset is the previous sibling header's start plus size, or `0` for the
first header in the group.

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
const offset = header_getStart(header)
```
