---
title: Columns
---

## API

[Table API](../api/table.md)

## Guide

Column defs are the single most important part of building a table. They are responsible for:

- Building the underlying data model that will be used for everything including sorting, filtering, grouping, etc.
- Formatting the data model into what will be displayed in the table
- Creating [header groups, headers and footers](../headers)
- Creating columns for display-only purposes, eg. action buttons, checkboxes, expanders, sparklines, etc.

## Column Def Types

- `Display Columns`
  - Display columns do _not_ have a data model which means they cannot be sorted, filtered, etc, but they can be used to display arbitrary content in the table, eg. a row actions button, checkbox, expander, etc.
- `Grouping Columns`
  - Group columns do _not_ have a data model so they too cannot be sorted, filterd, etc, and are used to group other columns together. It's common to define a header or footer for a column group.
- `Data Columns`
  - Data columns have an underlying data model which means they can be sorted, filtered, grouped, etc.

Here's an example of creating some of these different column types:

```tsx
// Define your row shape
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// Make some columns!
const defaultColumns: ColumnDef<Person>[] = [
  // Display Column
  {
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  },
  // Grouping Column
  {
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      // Data Column
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      // Data Column
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  // Grouping Column
  {
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      // Data Column
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
      },
      // Grouping Column
      {
        header: 'More Info',
        columns: [
          // Data Column
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          },
          // Data Column
          {
            accessorKey: 'status',
            header: 'Status',
            footer: props => props.column.id,
          },
          // Data Column
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: props => props.column.id,
          },
        ],
      },
    ],
  },
]
```

## Creating Data Columns

Data columns are unique in that they must be configured to extract primitive values for each item in your `data` array.

There are 2 ways to do this:

- If your items are `objects`, use an object-key that corresponds to the value you want to extract.
- If your items are nested `arrays`, use an array index that corresponds to the value you want to extract.
- Use an accessor function that returns the value you want to extract.

## Object Keys

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

You could extract the `firstName` value like so:

```tsx
{
  accessorKey: 'firstName',
}
```

## Array Indices

If each of your items is an array with the following shape:

```tsx
type Sales = [Date, number]
```

You could extract the `number` value like so:

```tsx
{
  accessorKey: 1,
}
```

## Accessor Functions

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

You could extract a computed full-name value like so:

```tsx
{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

> 🧠 Remember, the accessed value is what is used to sort, filter, etc. so you'll want to make sure your accessor function returns a primitive value that can be manipulated in a meaningful way. If you return a non-primitive value like an object or array, you will need the appropriate filter/sort/grouping functions to manipulate them, or even supply your own! 😬

## Unique Column IDs

Columns are uniquely identified with 3 strategies:

- If defining a data column with an object key or array index, the same will be used to uniquely identify the column.
- If defining a data column with an accessor function
  - The columns `id` property will be used to uniquely identify the column OR
  - If a primitive `string` header is supplied, that header string will be used to uniquely identify the column

> 🧠 An easy way to remember: If you define a column with an accessor function, either provide a string header or provide a unique `id` property.

## Column Formatting & Rendering

By default, columns cells will display their data model value as a string. You can override this behavior by providing custom rendering implementations. Each implementation is provided relevant information about the cell, header or footer and returns something your framework [adapter](../guides/adapters.md) can render eg. JSX/Components/strings/etc. This will depend on which adapter you are using.

There are a couple of formatters available to you:

- `cell`: Used for formatting cells.
- `aggregatedCell`: Used for formatting cells when aggregated.
- `header`: Used for formatting headers.
- `footer`: Used for formatting footers.

## Cell Formatting

You can provide a custom cell formatter by passing a function to the `cell` property and using the `props.getValue()` function to access your cell's value:

```tsx
{
  accessorKey: 'firstName',
  cell: props => <span>{props.renderValue().toUpperCase()}</span>,
}
```

Cell formatters are also provided the `row` and `table` objects, allowing you to customize the cell formatting beyond just the cell value. The example below provides `firstName` as the accessor, but also displays a prefixed user ID located on the original row object:

```tsx
{
  accessorKey: 'firstName',
  cell: props => <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
}
```

## Aggregated Cell Formatting

For more info on aggregated cells, see [grouping](../grouping.md).

## Header & Footer Formatting

Headers and footer do not have access to row data, but still use the same concepts for displaying custom content.
