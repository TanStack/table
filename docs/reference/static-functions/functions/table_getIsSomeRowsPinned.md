---
id: table_getIsSomeRowsPinned
title: table_getIsSomeRowsPinned
---

# Function: table\_getIsSomeRowsPinned()

```ts
function table_getIsSomeRowsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L88)

Returns is some rows pinned for the table.

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

[`RowPinningPosition`](../../index/type-aliases/RowPinningPosition.md)

## Returns

`boolean`

## Example

```ts
const value = table_getIsSomeRowsPinned(table)
```
