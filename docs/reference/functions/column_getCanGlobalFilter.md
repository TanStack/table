---
id: column_getCanGlobalFilter
title: column_getCanGlobalFilter
---

# Function: column\_getCanGlobalFilter()

```ts
function column_getCanGlobalFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L9)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`
