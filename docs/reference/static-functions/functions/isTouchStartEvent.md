---
id: isTouchStartEvent
title: isTouchStartEvent
---

# Function: isTouchStartEvent()

```ts
function isTouchStartEvent(e): e is TouchEvent;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:364](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L364)

Narrows an unknown event to a `touchstart` event.

Column resizing uses this before reading touch coordinates and installing
touch-specific listeners.

## Parameters

### e

`unknown`

## Returns

`e is TouchEvent`

## Example

```ts
const isTouch = isTouchStartEvent(event)
```
