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

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:348](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L348)

Returns whether a filter value should be removed from filter state.

`undefined` always removes: it is the universal "clear this filter"
sentinel used by `setFilterValue(undefined)` and functional updaters. For
any other value, a filter function's `autoRemove` hook is authoritative
when provided, so custom filter functions can keep values (such as empty
strings) that the default heuristic would drop. Without an `autoRemove`
hook, empty strings are removed.

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

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const removeFilter = shouldAutoRemoveFilter(filterFn, value, column)
```
