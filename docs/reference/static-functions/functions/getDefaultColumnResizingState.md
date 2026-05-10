---
id: getDefaultColumnResizingState
title: getDefaultColumnResizingState
---

# Function: getDefaultColumnResizingState()

```ts
function getDefaultColumnResizingState(): columnResizingState;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L26)

Returns the default column resizing state.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

[`columnResizingState`](../../index/interfaces/columnResizingState.md)

## Example

```ts
const initialValue = getDefaultColumnResizingState()
```
