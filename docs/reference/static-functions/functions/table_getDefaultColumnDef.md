---
id: table_getDefaultColumnDef
title: table_getDefaultColumnDef
---

# Function: table\_getDefaultColumnDef()

```ts
function table_getDefaultColumnDef<TFeatures, TData>(table): Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L76)

Returns default column def for the table.

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

`Partial`\<[`ColumnDef`](../../index/type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Example

```ts
const value = table_getDefaultColumnDef(table)
```
