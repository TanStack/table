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

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L61)

Resolves the filter function used for global filtering.

Function-valued `options.globalFilterFn` is returned directly, `'auto'`
delegates to `table_getGlobalAutoFilterFn`, and string values are looked up in
the table's filter function registry.

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
const filterFn = table_getGlobalFilterFn(table)
```
