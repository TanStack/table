---
id: table_getGlobalFacetedMinMaxValues
title: table_getGlobalFacetedMinMaxValues
---

# Function: table\_getGlobalFacetedMinMaxValues()

```ts
function table_getGlobalFacetedMinMaxValues<TFeatures, TData>(table): [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L89)

Returns global faceted min max values for the table.

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

\[`number`, `number`\] \| `undefined`

## Example

```ts
const value = table_getGlobalFacetedMinMaxValues(table)
```
