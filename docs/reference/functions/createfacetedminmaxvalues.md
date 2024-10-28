---
id: createFacetedMinMaxValues
title: createFacetedMinMaxValues
---

# Function: createFacetedMinMaxValues()

```ts
function createFacetedMinMaxValues<TFeatures, TData>(): (table, columnId) => () => undefined | [number, number]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

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

[features/column-faceting/createFacetedMinMaxValues.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedMinMaxValues.ts#L8)
