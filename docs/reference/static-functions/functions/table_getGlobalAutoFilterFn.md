---
id: table_getGlobalAutoFilterFn
title: table_getGlobalAutoFilterFn
---

# Function: table\_getGlobalAutoFilterFn()

```ts
function table_getGlobalAutoFilterFn(): <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L45)

Provides the built-in automatic global filter function.

Global filtering defaults to `includesString`, which gives search-box style
matching across globally filterable columns.

## Returns

\<`TFeatures`, `TData`\>(`row`, `columnId`, `filterValue`) => `boolean` & `object`

## Example

```ts
const filterFn = table_getGlobalAutoFilterFn()
```
