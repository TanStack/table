---
id: table_getOrderColumnsFn
title: table_getOrderColumnsFn
---

# Function: table\_getOrderColumnsFn()

```ts
function table_getOrderColumnsFn<TFeatures, TData>(table): (columns) => Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Parameters

• **columns**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L67)
