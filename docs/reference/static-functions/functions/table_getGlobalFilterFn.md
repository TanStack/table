---
id: table_getGlobalFilterFn
title: table_getGlobalFilterFn
---

# Function: table\_getGlobalFilterFn()

```ts
function table_getGlobalFilterFn<TFeatures, TData>(table): 
  | FilterFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L57)

Returns global filter fn for the table.

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

  \| [`FilterFn`](../../index/interfaces/FilterFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

## Example

```ts
const value = table_getGlobalFilterFn(table)
```
