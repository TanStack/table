---
id: getDefaultColumnOrderState
title: getDefaultColumnOrderState
---

# Function: getDefaultColumnOrderState()

```ts
function getDefaultColumnOrderState(): ColumnOrderState;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L22)

Creates the default column order state.

The feature default is an empty array, meaning leaf columns keep their natural
definition order. Reset APIs use this value when `defaultState` is `true`.

## Returns

[`ColumnOrderState`](../../index/type-aliases/ColumnOrderState.md)

## Example

```ts
const order = getDefaultColumnOrderState()
```
