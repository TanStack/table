---
title: Column Ordering
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-ordering](../framework/react/examples/column-ordering)
- [column-ordering-dnd](../framework/react/examples/column-dnd)

## API

[Column Ordering API](../api/features/column-ordering)

## Column Ordering Guide

By default, columns are ordered in the order they are defined in the `columns` array. However, you can manually specify the column order using the `columnOrder` state. Other features like column pinning and grouping can also affect the column order.

### What Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](../guide/column-pinning) - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual **Column Ordering** - A manually specified column order is applied.
3. [Grouping](../guide/grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.columnGroupingMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

> **Note:** `columnOrder` state will only affect unpinned columns if used in conjunction with column pinning.

### Column Order State

If you don't provide a `columnOrder` state, TanStack Table will just use the order of the columns in the `columns` array. However, you can provide an array of string column ids to the `columnOrder` state to specify the order of the columns.

#### Default Column Order

If all you need to do is specify the initial column order, you can just specify the `columnOrder` state in the `initialState` table option.

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  }
  //...
});
```

> **Note:** If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //optionally initialize the column order
//...
const table = useReactTable({
  //...
  state: {
    columnOrder,
    //...
  }
  onColumnOrderChange: setColumnOrder,
  //...
});
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, you can set up the logic something like this:

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.id));

//depending on your dnd solution of choice, you may or may not need state like this
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//util function to splice and reorder the columnOrder array
const reorderColumn = <TData extends RowData>(
  movingColumnId: Column<TData>,
  targetColumnId: Column<TData>,
): string[] => {
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumnId),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0],
  );
  setColumnOrder(newColumnOrder);
};

const handleDragEnd = (e: DragEvent) => {
  if(!movingColumnId || !targetColumnId) return;
  setColumnOrder(reorderColumn(movingColumnId, targetColumnId));
};

//use your dnd solution of choice
```
