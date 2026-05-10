---
id: createFacetedMinMaxValues
title: createFacetedMinMaxValues
---

# Function: createFacetedMinMaxValues()

```ts
function createFacetedMinMaxValues<TFeatures, TData>(): (table, columnId) => () => [number, number] | undefined;
```

Defined in: [features/column-faceting/createFacetedMinMaxValues.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedMinMaxValues.ts#L13)

Creates a memoized faceted min max values helper for faceted filtering.

The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Returns

```ts
(table, columnId): () => [number, number] | undefined;
```

### Parameters

#### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### columnId

`string`

### Returns

```ts
(): [number, number] | undefined;
```

#### Returns

\[`number`, `number`\] \| `undefined`
