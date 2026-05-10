---
id: getDefaultPaginationState
title: getDefaultPaginationState
---

# Function: getDefaultPaginationState()

```ts
function getDefaultPaginationState(): PaginationState;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L20)

Returns the default pagination state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`PaginationState`](../../index/interfaces/PaginationState.md)

## Example

```ts
const initialValue = getDefaultPaginationState()
```
