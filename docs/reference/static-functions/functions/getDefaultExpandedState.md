---
id: getDefaultExpandedState
title: getDefaultExpandedState
---

# Function: getDefaultExpandedState()

```ts
function getDefaultExpandedState(): ExpandedState;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L22)

Creates the default expanded state.

The feature default is an empty map, meaning no rows are expanded. Reset APIs
use this value when `defaultState` is `true`.

## Returns

[`ExpandedState`](../../index/type-aliases/ExpandedState.md)

## Example

```ts
const expanded = getDefaultExpandedState()
```
