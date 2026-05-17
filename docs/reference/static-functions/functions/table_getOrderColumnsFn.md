---
id: table_getOrderColumnsFn
title: table_getOrderColumnsFn
---

# Function: table\_getOrderColumnsFn()

```ts
function table_getOrderColumnsFn<TFeatures, TData>(table): (columns) => Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L144)

Creates the ordering function used to arrange leaf columns.

The returned function applies `state.columnOrder`, preserves unspecified
columns in their original order, then delegates to grouping rules.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(columns): Column_Internal<TFeatures, TData, unknown>[];
```

### Parameters

#### columns

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

### Returns

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const orderColumnsForTable = table_getOrderColumnsFn(table)
```
