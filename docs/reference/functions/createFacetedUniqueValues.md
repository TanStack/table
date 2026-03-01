---
id: createFacetedUniqueValues
title: createFacetedUniqueValues
---

# Function: createFacetedUniqueValues()

```ts
function createFacetedUniqueValues<TFeatures, TData>(): (table, columnId) => () => Map<any, number>;
```

Defined in: [features/column-faceting/createFacetedUniqueValues.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedUniqueValues.ts#L8)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Returns

```ts
(table, columnId): () => Map<any, number>;
```

### Parameters

#### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### columnId

`string`

### Returns

```ts
(): Map<any, number>;
```

#### Returns

`Map`\<`any`, `number`\>
