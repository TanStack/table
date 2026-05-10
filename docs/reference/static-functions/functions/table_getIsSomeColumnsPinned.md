---
id: table_getIsSomeColumnsPinned
title: table_getIsSomeColumnsPinned
---

# Function: table\_getIsSomeColumnsPinned()

```ts
function table_getIsSomeColumnsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:312](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L312)

Returns is some columns pinned for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Returns

`boolean`

## Example

```ts
const value = table_getIsSomeColumnsPinned(table)
```
