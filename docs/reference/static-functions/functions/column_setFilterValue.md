---
id: column_setFilterValue
title: column_setFilterValue
---

# Function: column\_setFilterValue()

```ts
function column_setFilterValue<TFeatures, TData, TValue>(column, value): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L198)

Updates filter value for a column.

This delegates to the owning table state updater so external state, external atoms, and internal state stay synchronized.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### value

`any`

## Returns

`void`

## Example

```ts
column_setFilterValue(column, (old) => old)
```
