---
id: table_resetColumnVisibility
title: table_resetColumnVisibility
---

# Function: table\_resetColumnVisibility()

```ts
function table_resetColumnVisibility<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L233)

Resets the table's column visibility state slice.

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
table_resetColumnVisibility(table)
table_resetColumnVisibility(table, true)
```
