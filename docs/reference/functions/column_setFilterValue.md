---
id: column_setFilterValue
title: column_setFilterValue
---

# Function: column\_setFilterValue()

```ts
function column_setFilterValue<TFeatures, TData, TValue>(column, value): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L119)

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

### value

`any`

## Returns

`void`
