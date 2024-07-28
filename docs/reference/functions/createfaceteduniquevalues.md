---
id: createFacetedUniqueValues
title: createFacetedUniqueValues
---

# Function: createFacetedUniqueValues()

```ts
function createFacetedUniqueValues<TFeatures, TData>(): (table, columnId) => () => Map<any, number>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

### Returns

`Function`

#### Returns

`Map`\<`any`, `number`\>

## Defined in

[features/column-faceting/createFacetedUniqueValues.ts:7](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/createFacetedUniqueValues.ts#L7)
