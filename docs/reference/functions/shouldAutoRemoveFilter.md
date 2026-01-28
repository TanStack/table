---
id: shouldAutoRemoveFilter
title: shouldAutoRemoveFilter
---

# Function: shouldAutoRemoveFilter()

```ts
function shouldAutoRemoveFilter<TFeatures, TData, TValue>(
   filterFn?, 
   value?, 
   column?): boolean;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L194)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### filterFn?

[`FilterFn`](../interfaces/FilterFn.md)\<`TFeatures`, `TData`\>

### value?

`any`

### column?

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`
