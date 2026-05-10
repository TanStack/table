---
id: table_getExpandedDepth
title: table_getExpandedDepth
---

# Function: table\_getExpandedDepth()

```ts
function table_getExpandedDepth<TFeatures, TData>(table): number;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L208)

Returns expanded depth for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const value = table_getExpandedDepth(table)
```
