---
id: table_getOrderColumnsFn
title: table_getOrderColumnsFn
---

# Function: table\_getOrderColumnsFn()

```ts
function table_getOrderColumnsFn<TFeatures, TData>(table): (columns) => Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L67)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(columns): Column_Internal<TFeatures, TData, unknown>[];
```

### Parameters

#### columns

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

### Returns

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]
