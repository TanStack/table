---
id: createFacetedMinMaxValues
title: createFacetedMinMaxValues
---

# Function: createFacetedMinMaxValues()

```ts
function createFacetedMinMaxValues<TFeatures, TData>(): (table, columnId) => () => undefined | [number, number]
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

`undefined` \| [`number`, `number`]

## Defined in

[features/column-faceting/createFacetedMinMaxValues.ts:7](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/createFacetedMinMaxValues.ts#L7)
