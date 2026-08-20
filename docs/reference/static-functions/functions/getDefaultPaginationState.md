---
id: getDefaultPaginationState
title: getDefaultPaginationState
---

# Function: getDefaultPaginationState()

```ts
function getDefaultPaginationState(): PaginationState;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L21)

Creates the default pagination state used by the pagination feature.

The feature default starts at the first page with a page size of 10. Reset
APIs use this value when `defaultState` is `true`.

## Returns

[`PaginationState`](../../index/interfaces/PaginationState.md)

## Example

```ts
const pagination = getDefaultPaginationState()
```
