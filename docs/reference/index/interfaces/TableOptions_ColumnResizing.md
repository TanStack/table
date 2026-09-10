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

Defined in: [features/column-resizing/columnResizingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L34)

Sets the resize direction used to calculate drag offsets. Defaults to `ltr`.

***

### columnResizeMode?

```ts
optional columnResizeMode: ColumnResizeMode;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L26)

Determines when committed `columnSizing` values are updated. `onChange`
commits sizes while the resize handle is dragged; `onEnd` commits when the
resize interaction finishes.

***

### enableColumnResizing?

```ts
optional enableColumnResizing: boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L30)

Enables or disables column resizing for the whole table.

***

### onColumnResizingChange?

```ts
optional onColumnResizingChange: OnChangeFn<columnResizingState>;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L40)

Called with an updater when the transient `columnResizing` state changes.
Pair this with `state.columnResizing` when using external state; external
atoms can own the slice without this callback.
