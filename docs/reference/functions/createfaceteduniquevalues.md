---
id: createFacetedUniqueValues
title: createFacetedUniqueValues
---

# Function: createFacetedUniqueValues()

```ts
function createFacetedUniqueValues<TFeatures, TData>(): (table, columnId) => () => Map<any, number>
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

`Map`\<`any`, `number`\>

## Defined in

[features/column-faceting/createFacetedUniqueValues.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedUniqueValues.ts#L8)
