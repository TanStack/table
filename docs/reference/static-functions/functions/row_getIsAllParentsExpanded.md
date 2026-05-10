---
id: row_getIsAllParentsExpanded
title: row_getIsAllParentsExpanded
---

# Function: row\_getIsAllParentsExpanded()

```ts
function row_getIsAllParentsExpanded<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:324](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L324)

Returns is all parents expanded for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

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
const value = row_getIsAllParentsExpanded(row)
```
