---
id: table_getIsSomeColumnsVisible
title: table_getIsSomeColumnsVisible
---

# Function: table\_getIsSomeColumnsVisible()

```ts
function table_getIsSomeColumnsVisible<TFeatures, TData>(table): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:318](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L318)

Returns is some columns visible for the table.

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
const value = table_getIsSomeColumnsVisible(table)
```
