---
id: row_getToggleExpandedHandler
title: row_getToggleExpandedHandler
---

# Function: row\_getToggleExpandedHandler()

```ts
function row_getToggleExpandedHandler<TFeatures, TData>(row): () => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`void`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L194)
