---
id: getDefaultColumnVisibilityState
title: getDefaultColumnVisibilityState
---

# Function: getDefaultColumnVisibilityState()

```ts
function getDefaultColumnVisibilityState(): ColumnVisibilityState;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L22)

Creates the default column visibility state.

The feature default is an empty object, where missing column ids are treated
as visible. Reset APIs use this value when `defaultState` is `true`.

## Returns

[`ColumnVisibilityState`](../../index/type-aliases/ColumnVisibilityState.md)

## Example

```ts
const visibility = getDefaultColumnVisibilityState()
```
