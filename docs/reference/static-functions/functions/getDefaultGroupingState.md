---
id: getDefaultGroupingState
title: getDefaultGroupingState
---

# Function: getDefaultGroupingState()

```ts
function getDefaultGroupingState(): GroupingState;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L25)

Returns the default grouping state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`GroupingState`](../../index/type-aliases/GroupingState.md)

## Example

```ts
const initialValue = getDefaultGroupingState()
```
