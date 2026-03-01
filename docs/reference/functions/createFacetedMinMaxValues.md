---
id: createFacetedMinMaxValues
title: createFacetedMinMaxValues
---

# Function: createFacetedMinMaxValues()

```ts
function createFacetedMinMaxValues<TFeatures, TData>(): (table, columnId) => () => [number, number] | undefined;
```

Defined in: [features/column-faceting/createFacetedMinMaxValues.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedMinMaxValues.ts#L8)

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
