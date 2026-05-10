---
id: getDefaultExpandedState
title: getDefaultExpandedState
---

# Function: getDefaultExpandedState()

```ts
function getDefaultExpandedState(): ExpandedState;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L21)

Returns the default expanded state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`ExpandedState`](../../index/type-aliases/ExpandedState.md)

## Example

```ts
const initialValue = getDefaultExpandedState()
```
