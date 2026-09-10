---
id: getDefaultRowSelectionState
title: getDefaultRowSelectionState
---

# Function: getDefaultRowSelectionState()

```ts
function getDefaultRowSelectionState(): RowSelectionState;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L31)

Creates the default row selection state.

The feature default is an empty map, meaning no rows are selected. Reset APIs
use this value when `defaultState` is `true`.

## Returns

[`RowSelectionState`](../../index/type-aliases/RowSelectionState.md)

## Example

```ts
const selection = getDefaultRowSelectionState()
```
