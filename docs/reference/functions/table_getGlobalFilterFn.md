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

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L27)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

  \| [`FilterFn`](../interfaces/FilterFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`
