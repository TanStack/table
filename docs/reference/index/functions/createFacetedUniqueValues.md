---
id: createFacetedUniqueValues
title: createFacetedUniqueValues
---

```ts
function createFacetedUniqueValues<TFeatures, TData>(): (table, columnId) => () => Map<any, number>;
```

Defined in: [features/column-faceting/createFacetedUniqueValues.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedUniqueValues.ts#L17)

Creates a memoized faceted unique values helper for faceted filtering.

The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Returns

(`table`, `columnId`) => () => `Map`\<`any`, `number`\>
