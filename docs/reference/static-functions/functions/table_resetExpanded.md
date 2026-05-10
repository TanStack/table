---
id: table_resetExpanded
title: table_resetExpanded
---

# Function: table\_resetExpanded()

```ts
function table_resetExpanded<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L97)

Resets the table's expanded state slice.

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
table_resetExpanded(table)
table_resetExpanded(table, true)
```
