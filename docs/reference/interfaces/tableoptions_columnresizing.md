---
id: TableOptions_ColumnResizing
title: TableOptions_ColumnResizing
---

# Interface: TableOptions\_ColumnResizing

## Properties

### columnResizeDirection?

```ts
optional columnResizeDirection: ColumnResizeDirection;
```

Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnResizeDirection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:38](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L38)

***

### columnResizeMode?

```ts
optional columnResizeMode: ColumnResizeMode;
```

Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnresizemode)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L26)

***

### enableColumnResizing?

```ts
optional enableColumnResizing: boolean;
```

Enables or disables column resizing for the column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enablecolumnresizing)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L32)

***

### onColumnSizingInfoChange?

```ts
optional onColumnSizingInfoChange: OnChangeFn<ColumnResizingInfoState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnSizingInfo` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizingInfo` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizinginfochange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:44](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L44)
