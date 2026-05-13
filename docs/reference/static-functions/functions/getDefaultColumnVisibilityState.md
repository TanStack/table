---
id: getDefaultColumnVisibilityState
title: getDefaultColumnVisibilityState
---

# Function: getDefaultColumnVisibilityState()

```ts
function getDefaultColumnVisibilityState(): ColumnVisibilityState;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L21)

Returns the default column visibility state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ColumnVisibilityState`](../../index/type-aliases/ColumnVisibilityState.md)

## Example

```ts
const initialValue = getDefaultColumnVisibilityState()
```
