---
id: row_getIsExpanded
title: row_getIsExpanded
---

# Function: row\_getIsExpanded()

```ts
function row_getIsExpanded<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:282](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L282)

Returns is expanded for a row.

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
const value = row_getIsExpanded(row)
```
