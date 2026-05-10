---
id: getDefaultRowSelectionState
title: getDefaultRowSelectionState
---

# Function: getDefaultRowSelectionState()

```ts
function getDefaultRowSelectionState(): RowSelectionState;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L21)

Returns the default row selection state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`RowSelectionState`](../../index/type-aliases/RowSelectionState.md)

## Example

```ts
const initialValue = getDefaultRowSelectionState()
```
