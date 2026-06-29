---
id: table_getExpandedDepth
title: table_getExpandedDepth
---

# Function: table\_getExpandedDepth()

```ts
function table_getExpandedDepth<TFeatures, TData>(table): number;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L227)

Computes the deepest expanded row id depth.

Row ids are split on `.`; expanded-all state scans the current row model,
while explicit expanded state scans its expanded id keys.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const depth = table_getExpandedDepth(table)
```
