---
id: row_getIsAllParentsExpanded
title: row_getIsAllParentsExpanded
---

# Function: row\_getIsAllParentsExpanded()

```ts
function row_getIsAllParentsExpanded<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:339](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L339)

Checks whether every ancestor of this row is expanded.

The current row is not considered; only its parent chain is walked.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const parentsExpanded = row_getIsAllParentsExpanded(row)
```
