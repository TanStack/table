---
id: Header_ColumnResizing
title: Header_ColumnResizing
---

# Interface: Header\_ColumnResizing

## Properties

### getResizeHandler()

```ts
getResizeHandler: (context?) => (event) => void;
```

Returns an event handler function that can be used to resize the header. It can be used as an:
- `onMouseDown` handler
- `onTouchStart` handler

The dragging and release events are automatically handled for you.

#### Parameters

• **context?**: `Document`

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:101](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L101)
