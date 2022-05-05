---
name: Row Selection
route: /api/row-selection
menu: API
---

## Examples

Want to skip to the implementation? Check out these examples:

- [row-selection](../examples/row-selection)
- [expanding](../examples/expanding)

## State

Row selection state is stored on the table instance using the following shape:

```tsx
export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}
```

## Table Options

### `enableRowSelection`

```tsx
enableRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
```

- Enables/disables row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable row selection for that row

### `enableMultiRowSelection`

```tsx
enableMultiRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
```

- Enables/disables multiple row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren

### `enableSubRowSelection`

```tsx
enableSubRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
```

Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.

(Use in combination with expanding or grouping features)

### `onRowSelectionChange`

```tsx
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

## Table Instance API

### `getToggleRowSelectedHandler`

```tsx
type getToggleRowSelectedHandler = (
  rowId: string
) => undefined | ((e: unknown) => void)
```

Returns the props for the `<input type="checkbox" />` element in a row that will toggle row selection and provides checked/indeterminate state.

### `getToggleAllRowsSelectedProps`

```tsx
type ToggleRowSelectedProps = {
  onChange?: (e: unknown) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
}

getToggleAllRowsSelectedProps: <
  TGetter extends Getter<ToggleRowSelectedProps>
>(
  userProps?: TGetter
) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
```

Returns the props for the `<input type="checkbox" />` element in a column header that will toggle row selection for all rows in the table and provides checked/indeterminate state.

### `getToggleAllPageRowsSelectedProps`

```tsx
getToggleAllPageRowsSelectedProps: <
  TGetter extends Getter<ToggleRowSelectedProps>
>(
  userProps?: TGetter
) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
```

Returns the props for the `<input type="checkbox" />` element in a column header that will toggle row selection for all rows on the current page and provides checked/indeterminate state.

### `setRowSelection`

```tsx
setRowSelection: (updater: Updater<RowSelectionState>) => void
```

Sets or updates the `state.rowSelection` state.

### `resetRowSelection`

```tsx
resetRowSelection: () => void
```

Resets the **rowSelection** state for the table back to its initial state.

### `toggleRowSelected`

```tsx
toggleRowSelected: (rowId: string, value?: boolean) => void
```

Selects/deselects a row.

### `getRowCanSelect`

```tsx
getRowCanSelect: (rowId: string) => boolean
```

Returns whether or not a row can be selected.

### `getRowCanSelectSubRows`

```tsx
getRowCanSelectSubRows: (rowId: string) => boolean
```

Returns whether or not a row's sub-rows can be automatically selected when the parent row is selected.

### `getRowCanMultiSelect`

```tsx
getRowCanMultiSelect: (rowId: string) => boolean
```

Returns whether or not a row can be multi-selected. TODO clarify

### `getRowIsSelected`

```tsx
getRowIsSelected: (rowId: string) => boolean
```

Returns whether or not a row is selected.

### `getRowIsSomeSelected`

```tsx
getRowIsSomeSelected: (rowId: string) => boolean
```

Returns whether or not any sub-rows of a row are selected.

### `getIsAllRowsSelected`

```tsx
getIsAllRowsSelected: () => boolean
```

Returns whether or not all rows in the table are selected.

### `getIsAllPageRowsSelected`

```tsx
getIsAllPageRowsSelected: () => boolean
```

Returns whether or not all rows on the current page are selected.

### `getIsSomeRowsSelected`

```tsx
getIsSomeRowsSelected: () => boolean
```

Returns whether or not any rows in the table are selected.

### `getIsSomePageRowsSelected`

```tsx
getIsSomePageRowsSelected: () => boolean
```

Returns whether or not any rows on the current page are selected.

### `queueResetRowSelection`

```tsx
queueResetRowSelection: () => void
```

TODO

### `toggleAllRowsSelected`

```tsx
toggleAllRowsSelected: (value: boolean) => void
```

Selects/deselects all rows in the table.

### `toggleAllPageRowsSelected`

```tsx
toggleAllPageRowsSelected: (value: boolean) => void
```

Selects/deselects all rows on the current page.

### `getPreSelectedRowModel`

```tsx
getPreSelectedRowModel: () => RowModel<TGenerics>
```

TODO

### `queueResetRowSelection`

```tsx
queueResetRowSelection: () => void
```

TODO

### `getSelectedRowModel`

```tsx
getSelectedRowModel: () => RowModel<TGenerics>
```

TODO

### `getFilteredSelectedRowModel`

```tsx
getFilteredSelectedRowModel: () => RowModel<TGenerics>
```

TODO

### `getGroupedSelectedRowModel`

```tsx
getGroupedSelectedRowModel: () => RowModel<TGenerics>
```

TODO

## Row API

### `getIsSelected`

```tsx
getIsSelected: () => boolean
```

Returns whether or not the row is selected.

### `getIsSomeSelected`

```tsx
getIsSomeSelected: () => boolean
```

Returns whether or not some of the row's sub rows are selected.

### `getCanSelect`

```tsx
getCanSelect: () => boolean
```

Returns whether or not the row can be selected.

### `getCanMultiSelect`

```tsx
getCanMultiSelect: () => boolean
```

Returns whether or not the row can multi-select. TODO clarify

### `toggleSelected`

```tsx
toggleSelected: (value?: boolean) => void
```

Selects/deselects the row.

### `getToggleSelectedProps`

```tsx
type ToggleRowSelectedProps = {
  onChange?: (e: unknown) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
}

getToggleSelectedProps: <TGetter extends Getter<ToggleRowSelectedProps>>(
  userProps?: TGetter
) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
```

Returns the props for the `<input type="checkbox" />` element in the row that will toggle row selection and provides checked/indeterminate state.
