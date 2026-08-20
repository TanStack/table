---
id: getDefaultCellSelectionState
title: getDefaultCellSelectionState
---

# Function: getDefaultCellSelectionState()

```ts
function getDefaultCellSelectionState(): CellSelectionState;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L42)

Creates the default cell selection state.

The feature default is an empty selection. Reset APIs use this value when
`defaultState` is `true`.

## Returns

[`CellSelectionState`](../../index/type-aliases/CellSelectionState.md)

## Example

```ts
const selection = getDefaultCellSelectionState()
```
