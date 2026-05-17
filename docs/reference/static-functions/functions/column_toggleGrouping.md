---
id: column_toggleGrouping
title: column_toggleGrouping
---

# Function: column\_toggleGrouping()

```ts
function column_toggleGrouping<TFeatures, TData, TValue>(column): void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L41)

Adds or removes this column id from the grouping state.

Existing grouped columns keep their order. A column already present in
`state.grouping` is removed; otherwise it is appended.

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

`void`

## Example

```ts
column_toggleGrouping(column)
```
