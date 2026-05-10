---
id: table_getIsAllRowsExpanded
title: table_getIsAllRowsExpanded
---

# Function: table\_getIsAllRowsExpanded()

```ts
function table_getIsAllRowsExpanded<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:174](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L174)

Returns is all rows expanded for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const value = table_getIsAllRowsExpanded(table)
```
