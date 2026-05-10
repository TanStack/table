---
id: getDefaultColumnFiltersState
title: getDefaultColumnFiltersState
---

# Function: getDefaultColumnFiltersState()

```ts
function getDefaultColumnFiltersState(): ColumnFiltersState;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L21)

Returns the default column filters state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ColumnFiltersState`](../../index/type-aliases/ColumnFiltersState.md)

## Example

```ts
const initialValue = getDefaultColumnFiltersState()
```
