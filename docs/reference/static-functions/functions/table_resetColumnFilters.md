---
id: table_resetColumnFilters
title: table_resetColumnFilters
---

# Function: table\_resetColumnFilters()

```ts
function table_resetColumnFilters<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:284](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L284)

Resets the table's column filters state slice.

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
table_resetColumnFilters(table)
table_resetColumnFilters(table, true)
```
