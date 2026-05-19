---
id: column_getCanGroup
title: column_getCanGroup
---

# Function: column\_getCanGroup()

```ts
function column_getCanGroup<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L67)

Checks whether this column can be used for grouping.

Grouping must be enabled at the column and table level, and the column must
either have an accessor or provide `getGroupingValue`.

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
const canGroup = column_getCanGroup(column)
```
