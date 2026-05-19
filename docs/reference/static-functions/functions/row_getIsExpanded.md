---
id: row_getIsExpanded
title: row_getIsExpanded
---

# Function: row\_getIsExpanded()

```ts
function row_getIsExpanded<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:296](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L296)

Checks whether this row is expanded.

`options.getIsRowExpanded` can override state-derived behavior. Otherwise
the row is expanded when expanded state is `true` or contains this row id.

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
const expanded = row_getIsExpanded(row)
```
