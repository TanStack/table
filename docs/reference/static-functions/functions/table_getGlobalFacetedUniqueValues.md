---
id: table_getGlobalFacetedUniqueValues
title: table_getGlobalFacetedUniqueValues
---

# Function: table\_getGlobalFacetedUniqueValues()

```ts
function table_getGlobalFacetedUniqueValues<TFeatures, TData>(table): Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L129)

Returns global faceted unique values for the table.

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

`Map`\<`any`, `number`\>

## Example

```ts
const value = table_getGlobalFacetedUniqueValues(table)
```
