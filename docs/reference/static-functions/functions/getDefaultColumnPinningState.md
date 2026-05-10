---
id: getDefaultColumnPinningState
title: getDefaultColumnPinningState
---

# Function: getDefaultColumnPinningState()

```ts
function getDefaultColumnPinningState(): ColumnPinningState;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L32)

Returns the default column pinning state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ColumnPinningState`](../../index/interfaces/ColumnPinningState.md)

## Example

```ts
const initialValue = getDefaultColumnPinningState()
```
