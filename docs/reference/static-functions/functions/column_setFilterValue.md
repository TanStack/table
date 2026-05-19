---
id: column_setFilterValue
title: column_setFilterValue
---

# Function: column\_setFilterValue()

```ts
function column_setFilterValue<TFeatures, TData, TValue>(column, value): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:206](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L206)

Adds, updates, or removes this column's filter value.

The incoming value may be an updater. After resolution, `autoRemove` rules
decide whether the filter should be removed instead of stored.

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
column_setFilterValue(column, (old) => String(old ?? '').trim())
```
