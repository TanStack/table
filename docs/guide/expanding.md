---
title: Expanding Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [expanding](../../framework/react/examples/expanding)
- [grouping](../../framework/react/examples/grouping)

## API

[Expanding API](../../api/features/expanding)

## Expanding Feature Guide

Expanding is a feature that allows you to show and hide additional rows of data related to a specific row. This can be useful in cases where you have hierarchical data and you want to allow users to drill down into the data from a higher level.

To use the expanding feature, you need to define the getExpandedRowModel function in your table options. This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows.

```ts
const table = useReactTable({
  // other options...
  getExpandedRowModel: getExpandedRowModel(),
})
```

Expanded data can either contain table rows or any other data you want to display. We will discuss how to handle both cases in this guide.

### Table rows expanded data

Expanded rows data will usually come within your table data object. for example, your data object could look like this:

```ts
type Person = {
  id: number
  name: string
  age: number
  children: Person[]
}

const data: Person =  [
  { id: 1, name: 'John', age: 30, children: [{ id: 2, name: 'Jane', age: 5 }] },
  { id: 3, name: 'Doe', age: 40, children: [{ id: 4, name: 'Alice', age: 10 }] },
]
```

Then you should use the getSubRows function to return the children array in each row as expanded rows.

```ts
const table = useReactTable({
  // other options...
  getSubRows: (row) => row.children, // return the children array as expanded rows
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

### Custom data as expanded data

If your expanded data is not part of your table data object. You do not need to use the getSubRows function. Instead, you should use the getRowCanExpand option in the table instance and add your expanded data within your table UI.

```ts
//...
const table = useReactTable({
  // other options...
  getRowCanExpand: (row) => true, // Add your logic to determine if a row can be expanded. True means all rows include expanded data
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // The number of columns you wish to span
            // Your custom Expanded data goes here
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### Expanded rows state

You might want to access and manage the expanded state of the rows in your table if expanded data is not part of your table data object or if you are doing server-side expansion. You can use the expanded state and onExpandedChange option to manage the expanded state on your own.

```ts
const [expanded, setExpanded] = useState<ExpandedState>({})

const table = useReactTable({
  // other options...
  getState: () => ({
    expanded: expanded,
  }),
  onExpandedChange: setExpanded
})
```

The ExpandedState type is defined as follows:

```ts
type ExpandedState = true | Record<string, boolean>
```

If the ExpandedState is true, it means all rows are expanded. If it's a record, only the rows with IDs present as keys in the record and have their value set to true are expanded.  For example, if the expanded state is { row1: true, row2: false }, it means the row with ID row1 is expanded and the row with ID row2 is not expanded.  This state is used by the table to determine which rows are expanded and should display their subRows, if any.

### UI toggling handler for expanded rows

TanStack table will not add a toggling handler UI for expanded data to your table. You should manually add it manually within each row's ui to allow users to expand and collapse the row. For example, you can add a button ui within the columns definition.

```ts
const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
  {
    Header: 'Children',
    Cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
      </div>
    },
  },
]
```

### Filtering Expanded Rows

By default, the global and column filters will search through the parent rows. If you want to search through the expanded rows as well, you can use the `filterFromLeafRows` and `maxLeafRowFilterDepth` options.

```ts
//...
const table = useReactTable({
  // other options...
  getSubRows: row => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // search through the expanded rows
  maxLeafRowFilterDepth: 1, // limit the depth of the expanded rows that are searched
})
```

The `filterFromLeafRows` option will allow the global and column filters to search through the expanded rows. The `maxLeafRowFilterDepth` option will limit the depth of the expanded rows that are searched. In this example, the global and column filters will search through the parent rows and the first level of expanded rows.

### Paginating Expanded Rows

By default, expanded rows are paginated along with the rest of the table (which means expanded rows may span multiple pages). If you want to disable this behavior (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size) you can use the `paginateExpandedRows` option.

```ts
const table = useReactTable({
  // other options...
  paginateExpandedRows: false,
})
```

### Pinning Expanded Rows

Pinning expanded rows works the same way as pinning regular rows. You can pin expanded rows to the top or bottom of the table. Please refer to the [Pinning Guide](./pinning.md) for more information on row pinning.

### Sorting Expanded Rows

By default, expanded rows are sorted along with the rest of the table.

### Manual Expanding (server-side)

If you are doing server-side expansion, you can enable manual row expansion by setting the manualExpanding option to true. This means that the `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model.

```ts
const table = useReactTable({
  // other options...
  manualExpanding: true,
})
```
