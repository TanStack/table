---
id: isTouchStartEvent
title: isTouchStartEvent
---

# Function: isTouchStartEvent()

```ts
function isTouchStartEvent(e): e is TouchEvent;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:355](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L355)

Returns whether an event is a touch-start event.

Column resizing uses this to normalize mouse and touch resize interactions.

## Parameters

### e

`unknown`

## Returns

`e is TouchEvent`

## Example

```ts
const isTouch = isTouchStartEvent(event)
```
