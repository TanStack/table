---
id: getDefaultSortingState
title: getDefaultSortingState
---

# Function: getDefaultSortingState()

```ts
function getDefaultSortingState(): SortingState;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L25)

Returns the default sorting state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`SortingState`](../../index/type-aliases/SortingState.md)

## Example

```ts
const initialValue = getDefaultSortingState()
```
