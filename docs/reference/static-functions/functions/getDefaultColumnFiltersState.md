---
id: getDefaultColumnFiltersState
title: getDefaultColumnFiltersState
---

# Function: getDefaultColumnFiltersState()

```ts
function getDefaultColumnFiltersState(): ColumnFiltersState;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L22)

Creates the default column filter state.

The feature default is an empty array, meaning no column filters are active.
Reset APIs use this value when `defaultState` is `true`.

## Returns

[`ColumnFiltersState`](../../index/type-aliases/ColumnFiltersState.md)

## Example

```ts
const filters = getDefaultColumnFiltersState()
```
