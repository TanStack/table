---
id: table_resetColumnSizing
title: table_resetColumnSizing
---

# Function: table\_resetColumnSizing()

```ts
function table_resetColumnSizing<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:266](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L266)

Resets the table's column sizing state slice.

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
table_resetColumnSizing(table)
table_resetColumnSizing(table, true)
```
