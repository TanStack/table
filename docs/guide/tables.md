---
title: Table Instance Guide
---

## API

[Table API](../../api/core/table)

## Table Instance Guide

TanStack Table is a headless UI library. When we talk about the `table` or "table instance", we're not talking about a literal `<table>` element. Instead, we're referring to the core table object that contains the table state and APIs. The `table` instance is created by calling your adapter's `createTable` function (e.g. `useReactTable`, `createSolidTable`, `createSvelteTable`, `useQwikTable`, `useVueTable`).

### Creating a Table Instance

To create a table instance, 2 `options` are required: `columns` and `data`. There are dozens of other table options to configure features and behavior, but these 2 are required.

#### Defining Data

`data` is an array of objects that will be turned into the rows of your table. Each object in the array represents a row of data (under normal circumstances). If you are using TypeScript, we usually define a type for the shape of our data. This type is used as a generic type for all of the other table, column, row, and cell instances. This type is usually referred to as `TData`.

For example, if we have a table that displays a list of users in an array like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

Then we can define a User (TData) type like this:

```ts
//TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

We can then define our `data` array with this type, and then TanStack Table will be able to intelligently infer lots of types for us later on in our columns, rows, cells, etc.

```ts
//note: data needs a "stable" reference in order to prevent infinite re-renders
const data: User[] = []
//or
const [data, setData] = React.useState<User[]>([])
//or
const data = ref<User[]>([])
//etc...
```

> Note: `data` needs a "stable" reference (especially in React) in order to prevent infinite re-renders. This is why we recommend using `React.useState` or `React.useMemo`, or defining your data outside of the same react component that creates the table instance, or using a library like TanStack Query to manage your data state.

#### Defining Columns

Column definitions are covered in detail in the next section in the [Column Def Guide](../column-defs.md). We'll note here, however, that when you define the type of your columns, you should use the same `TData` type that you used for you data.

```ts
const columns: ColumnDef<User>[] = [] //Pass User type as the generic TData type
//or
const columnHelper = createColumnHelper<User>() //Pass User type as the generic TData type
```

The column definitions are where we will tell TanStack Table how each column should access and/or transform row data with either an `accessorKey` or `accessorFn`. See the [Column Def Guide](../column-defs#creating-accessor-columns) for more info.

#### Creating the Table Instance

With our `columns` and `data` defined, we can now create our basic table instance.

```ts
//vanilla js
const table = createTable({ columns, data })

//react
const table = useReactTable({ columns, data })

//solid
const table = createSolidTable({ columns, data })

//svelte
const table = createSvelteTable({ columns, data })

//vue
const table = useVueTable({ columns, data })
```

So what's in the `table` instance? Let's take a look at what interactions we can have with the table instance.

### Table State

The table instance contains all of the table state, which can be accessed via the `table.getState()` API. Each table feature registers various states in the table state. For example, the row selection feature registers `rowSelection` state, the pagination feature registers `pagination` state, etc.

Each feature will also have corresponding state setter APIs and state resetter APIs on the table instance. For example, the row selection feature will have a `setRowSelection` API and a `resetRowSelection`.

```ts
table.getState().rowSelection //read the row selection state
table.setRowSelection((old) => ({...old})) //set the row selection state
table.resetRowSelection() //reset the row selection state
```

### Table APIs

There are dozens of table APIs created by each feature to help you either read or mutate the table state in different ways.

API reference docs for the core table instance and all other feature APIs can be found throughout the API docs.

For example, you can find the core table instance API docs here: [Table API](../../api/core/table#table-api)

### Table Row Models

There is a special set of table instance APIs for reading rows out of the table instance called row models. TanStack Table has advanced features where the rows that are generated may be very different than the array of `data` that you originally passed in. To learn more about the different row models that you can pass in as a table option, see the [Row Models Guide](../row-models.md).
