---
id: getDefaultColumnSizingState
title: getDefaultColumnSizingState
---

# Function: getDefaultColumnSizingState()

```ts
function getDefaultColumnSizingState(): ColumnSizingState;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L27)

Returns the default column sizing state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ColumnSizingState`](../../index/type-aliases/ColumnSizingState.md)

## Example

```ts
const initialValue = getDefaultColumnSizingState()
```
