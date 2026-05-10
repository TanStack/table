---
id: row_getCanExpand
title: row_getCanExpand
---

# Function: row\_getCanExpand()

```ts
function row_getCanExpand<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:304](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L304)

Returns whether a row can use expand.

This evaluates row data, table options, and feature-specific enablement rules.

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
const value = row_getCanExpand(row)
```
