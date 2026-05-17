---
id: row_getCanExpand
title: row_getCanExpand
---

# Function: row\_getCanExpand()

```ts
function row_getCanExpand<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:319](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L319)

Checks whether this row can be expanded.

`options.getRowCanExpand` wins when provided. Otherwise rows can expand when
expanding is enabled and the row has subRows.

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
const canExpand = row_getCanExpand(row)
```
