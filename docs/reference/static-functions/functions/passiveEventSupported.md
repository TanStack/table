---
id: passiveEventSupported
title: passiveEventSupported
---

# Function: passiveEventSupported()

```ts
function passiveEventSupported(): boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:320](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L320)

Detects whether the current environment supports passive event listeners.

Column resizing uses this to register pointer and touch listeners with the safest available options.

## Returns

`boolean`

## Example

```ts
const canUsePassiveListeners = passiveEventSupported()
```
