---
id: getDefaultRowPinningState
title: getDefaultRowPinningState
---

# Function: getDefaultRowPinningState()

```ts
function getDefaultRowPinningState(): RowPinningState;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L24)

Returns the default row pinning state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`RowPinningState`](../../index/interfaces/RowPinningState.md)

## Example

```ts
const initialValue = getDefaultRowPinningState()
```
