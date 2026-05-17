---
id: column_getCanGlobalFilter
title: column_getCanGlobalFilter
---

# Function: column\_getCanGlobalFilter()

```ts
function column_getCanGlobalFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L20)

Checks whether this accessor column participates in global filtering.

The column must have an accessor and pass column-level, table-level, and
optional `getColumnCanGlobalFilter` checks.

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

## Returns

`boolean`

## Example

```ts
const canGlobalFilter = column_getCanGlobalFilter(column)
```
