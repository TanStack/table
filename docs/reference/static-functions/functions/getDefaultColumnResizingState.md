---
id: getDefaultColumnResizingState
title: getDefaultColumnResizingState
---

# Function: getDefaultColumnResizingState()

```ts
function getDefaultColumnResizingState(): columnResizingState;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L27)

Creates the default transient column resizing state.

The feature default represents no active drag interaction. Reset APIs use
this value when `defaultState` is `true`.

## Returns

[`columnResizingState`](../../index/interfaces/columnResizingState.md)

## Example

```ts
const resizeInfo = getDefaultColumnResizingState()
```
