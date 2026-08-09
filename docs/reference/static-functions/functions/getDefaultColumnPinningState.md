---
id: getDefaultColumnPinningState
title: getDefaultColumnPinningState
---

# Function: getDefaultColumnPinningState()

```ts
function getDefaultColumnPinningState(): ColumnPinningState;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L40)

Creates the default column pinning state.

Both pinning regions start empty. Reset APIs use this value when
`defaultState` is `true`.

## Returns

[`ColumnPinningState`](../../index/interfaces/ColumnPinningState.md)

## Example

```ts
const pinning = getDefaultColumnPinningState()
```
