---
id: table_getGlobalAutoFilterFn
title: table_getGlobalAutoFilterFn
---

# Function: table\_getGlobalAutoFilterFn()

```ts
function table_getGlobalAutoFilterFn(): FilterFn<any, any>;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L43)

Returns global auto filter fn for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Returns

[`FilterFn`](../../index/interfaces/FilterFn.md)\<`any`, `any`\>

## Example

```ts
const value = table_getGlobalAutoFilterFn(table)
```
