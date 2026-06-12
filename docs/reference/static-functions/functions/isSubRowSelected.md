---
id: isSubRowSelected
title: isSubRowSelected
---

# Function: isSubRowSelected()

```ts
function isSubRowSelected<TFeatures, TData>(row): boolean | "some" | "all";
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:711](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L711)

Returns whether all, some, or none of a row's selectable descendants are selected.

The result is used to drive indeterminate row selection UI.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean` \| `"some"` \| `"all"`

## Example

```ts
const selectedState = isSubRowSelected(row)
```
