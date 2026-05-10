---
id: getDefaultColumnOrderState
title: getDefaultColumnOrderState
---

# Function: getDefaultColumnOrderState()

```ts
function getDefaultColumnOrderState(): ColumnOrderState;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L21)

Returns the default column order state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ColumnOrderState`](../../index/type-aliases/ColumnOrderState.md)

## Example

```ts
const initialValue = getDefaultColumnOrderState()
```
