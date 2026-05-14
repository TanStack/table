---
id: header_getSize
title: header_getSize
---

# Function: header\_getSize()

```ts
function header_getSize<TFeatures, TData, TValue>(header): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L185)

Returns size for a header.

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

## Returns

`number`

## Example

```ts
const value = header_getSize(header)
```
