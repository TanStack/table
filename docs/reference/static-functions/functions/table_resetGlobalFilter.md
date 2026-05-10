---
id: table_resetGlobalFilter
title: table_resetGlobalFilter
---

# Function: table\_resetGlobalFilter()

```ts
function table_resetGlobalFilter<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L102)

Resets the table's global filter state slice.

By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetGlobalFilter(table)
table_resetGlobalFilter(table, true)
```
