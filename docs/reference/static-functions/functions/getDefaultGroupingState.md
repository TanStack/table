---
id: getDefaultGroupingState
title: getDefaultGroupingState
---

# Function: getDefaultGroupingState()

```ts
function getDefaultGroupingState(): GroupingState;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L25)

Creates the default grouping state.

The feature default is an empty array, meaning no columns are grouped. Reset
APIs use this value when `defaultState` is `true`.

## Returns

[`GroupingState`](../../index/type-aliases/GroupingState.md)

## Example

```ts
const grouping = getDefaultGroupingState()
```
