---
id: getDefaultColumnSizingState
title: getDefaultColumnSizingState
---

# Function: getDefaultColumnSizingState()

```ts
function getDefaultColumnSizingState(): ColumnSizingState;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L28)

Creates the default committed column sizing state.

The feature default is an empty map, so columns fall back to their column def
size or the built-in sizing defaults.

## Returns

[`ColumnSizingState`](../../index/type-aliases/ColumnSizingState.md)

## Example

```ts
const sizing = getDefaultColumnSizingState()
```
