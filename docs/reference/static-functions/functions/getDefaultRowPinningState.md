---
id: getDefaultRowPinningState
title: getDefaultRowPinningState
---

# Function: getDefaultRowPinningState()

```ts
function getDefaultRowPinningState(): RowPinningState;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L25)

Creates the default row pinning state.

Both pinning regions start empty. Reset APIs use this value when
`defaultState` is `true`.

## Returns

[`RowPinningState`](../../index/interfaces/RowPinningState.md)

## Example

```ts
const pinning = getDefaultRowPinningState()
```
