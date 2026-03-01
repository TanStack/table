---
id: isSubRowSelected
title: isSubRowSelected
---

# Function: isSubRowSelected()

```ts
function isSubRowSelected<TFeatures, TData>(row): boolean | "some" | "all";
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:425](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L425)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean` \| `"some"` \| `"all"`
