---
id: TableOptions_ColumnResizing
title: TableOptions_ColumnResizing
---

# Interface: TableOptions\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L20)

## Properties

### columnResizeDirection?

```ts
optional columnResizeDirection: ColumnResizeDirection;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L32)

Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.

***

### columnResizeMode?

```ts
optional columnResizeMode: ColumnResizeMode;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L24)

Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.

***

### enableColumnResizing?

```ts
optional enableColumnResizing: boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L28)

Enables or disables column resizing for the column.

***

### onColumnResizingChange?

```ts
optional onColumnResizingChange: OnChangeFn<columnResizingState>;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L36)

If provided, this function will be called with an `updaterFn` when `state.columnResizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnResizing` from your own managed state.
