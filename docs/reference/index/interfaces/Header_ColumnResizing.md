---
id: Header_ColumnResizing
title: Header_ColumnResizing
---

# Interface: Header\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L79)

## Properties

### getResizeHandler()

```ts
getResizeHandler: (context?) => (event) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L85)

Creates the `onMouseDown`/`onTouchStart` handler for a resize handle.

Dragging and release listeners are installed and cleaned up automatically.

#### Parameters

##### context?

`Document`

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`
