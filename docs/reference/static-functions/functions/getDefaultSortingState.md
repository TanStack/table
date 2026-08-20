---
id: getDefaultSortingState
title: getDefaultSortingState
---

# Function: getDefaultSortingState()

```ts
function getDefaultSortingState(): SortingState;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L26)

Creates the default sorting state.

The feature default is an empty array, meaning no columns are sorted. Reset
APIs use this value when `defaultState` is `true`.

## Returns

[`SortingState`](../../index/type-aliases/SortingState.md)

## Example

```ts
const sorting = getDefaultSortingState()
```
