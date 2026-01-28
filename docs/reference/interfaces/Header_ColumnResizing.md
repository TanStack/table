---
id: Header_ColumnResizing
title: Header_ColumnResizing
---

# Interface: Header\_ColumnResizing

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L73)

## Properties

### getResizeHandler()

```ts
getResizeHandler: (context?) => (event) => void;
```

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L80)

Returns an event handler function that can be used to resize the header. It can be used as an:
- `onMouseDown` handler
- `onTouchStart` handler
The dragging and release events are automatically handled for you.

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
