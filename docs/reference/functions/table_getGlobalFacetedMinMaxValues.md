---
id: table_getGlobalFacetedMinMaxValues
title: table_getGlobalFacetedMinMaxValues
---

# Function: table\_getGlobalFacetedMinMaxValues()

```ts
function table_getGlobalFacetedMinMaxValues<TFeatures, TData>(table): [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L49)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

\[`number`, `number`\] \| `undefined`
