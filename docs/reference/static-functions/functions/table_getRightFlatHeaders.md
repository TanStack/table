---
id: table_getRightFlatHeaders
title: table_getRightFlatHeaders
---

# Function: table\_getRightFlatHeaders()

```ts
function table_getRightFlatHeaders<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:544](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L544)

Returns right flat headers for the table.

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

`any`[]

## Example

```ts
const value = table_getRightFlatHeaders(table)
```
