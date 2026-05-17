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

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:315](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L315)

Returns whether a filter value should be removed from filter state.

This checks the filter function's `autoRemove` hook and built-in empty-value rules.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### filterFn?

[`FilterFn`](../../index/interfaces/FilterFn.md)\<`TFeatures`, `TData`\>

### value?

`any`

### column?

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const removeFilter = shouldAutoRemoveFilter(filterFn, value, column)
```
