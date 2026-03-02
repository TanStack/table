---
title: Table Instance Guide
---

## API

[Table API](../api/core/table)

## Table Instance Guide

TanStack Table is a headless UI library. When we talk about the `table` or "table instance", we're not talking about a literal `<table>` element. Instead, we're referring to the core table object that contains the table state and APIs. The `table` instance is created by calling your adapter's `_createTable` function (e.g. `useTable`, `createTable`, or `injectTable`).

The `table` instance that is returned from the `_createTable` function (from the framework adapter) is the main object that you will interact with to read and mutate the table state. It is the one place where everything happens in TanStack Table. When you get to the point where you are rendering your UI, you will use APIs from this `table` instance.

### Creating a Table Instance

To create a table instance, 3 `options` are required: `columns`, `data`, and `_features`. The `_features` option declares which table features your table uses (enabling tree-shaking—you only bundle what you use). The core row model is included automatically; add additional row models via `_rowModels` when you need filtering, sorting, pagination, etc. There are dozens of other table options to configure features and behavior.

#### Defining Data

Define your data as an array of objects with a stable reference. `data` can come from anywhere like an API response or defined statically in your code, but it must have a stable reference to prevent infinite re-renders. If using TypeScript, the type that you give your data will be used as a `TData` generic. See the [Data Guide](./data) for more info.

#### Defining Columns

Column definitions are covered in detail in the previous section in the [Column Def Guide](./column-defs). We'll note here, however, that when you define the type of your columns, you should use the same `TData` type that you used for your data.

```ts
const _features = tableFeatures({}) // Define which features your table uses
const columns: ColumnDef<typeof _features, User>[] = [] // Pass User type as TData; use typeof _features for TFeatures
//or
const columnHelper = createColumnHelper<typeof _features, User>() // Pass both TFeatures and TData in v9
```

The column definitions are where we will tell TanStack Table how each column should access and/or transform row data with either an `accessorKey` or `accessorFn`. See the [Column Def Guide](./column-defs#creating-accessor-columns) for more info.

#### Defining Features and Row Models

This is explained in much more detail in the [Row Models Guide](./row-models). In v9, you declare which features your table uses via `_features` (using `tableFeatures()`), and which row models to apply via `_rowModels`. The core row model is always included automatically. For a basic table with no filtering, sorting, or pagination, pass an empty features object and empty row models:

```ts
import { tableFeatures } from '@tanstack/[framework]-table'

const _features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = _createTable({
  _features,
  _rowModels: {}, // Core row model is automatic; add filteredRowModel, sortedRowModel, etc. as needed
  columns,
  data,
})
```

#### Initializing the Table Instance

With our `_features`, `columns`, `data`, and `_rowModels` defined, we can now create our basic table instance, along side any other table options that we want to pass in.

> **Framework note:** This guide uses React examples. Other frameworks (Angular, Lit, Solid, Svelte, Vue) use `createTable`, `injectTable`, or similar with the same options.

```ts
//vanilla js
const table = _createTable({ _features, _rowModels: {}, columns, data })

//angular
this.table = injectTable({ _features, _rowModels: {}, columns: this.columns, data: this.data() })

//lit
const table = this.tableController.table({ _features, _rowModels: {}, columns, data })

//react
const table = useTable({ _features, _rowModels: {}, columns, data })

//solid
const table = createTable({ _features, _rowModels: {}, columns, get data() { return data() } })

//svelte
const table = createTable({ _features, _rowModels: {}, columns, data })

//vue
const table = useTable({ _features, _rowModels: {}, columns, data })
```

So what's in the `table` instance? Let's take a look at what interactions we can have with the table instance.

### Table State

The table instance contains all of the table state, which can be accessed via the `table.store.state` API. Each table feature registers various states in the table state. For example, the row selection feature registers `rowSelection` state, the pagination feature registers `pagination` state, etc.

Each feature will also have corresponding state setter APIs and state resetter APIs on the table instance. For example, the row selection feature will have a `setRowSelection` API and a `resetRowSelection`.

```ts
table.store.state.rowSelection //read the row selection state
table.setRowSelection((old) => ({...old})) //set the row selection state
table.resetRowSelection() //reset the row selection state
```

This is covered in more detail in the [Table State Guides](../framework/react/guide/table-state)

### Table APIs

There are dozens of table APIs created by each feature to help you either read or mutate the table state in different ways.

API reference docs for the core table instance and all other feature APIs can be found throughout the API docs.

For example, you can find the core table instance API docs here: [Table API](../api/core/table#table-api)

### Table Row Models

There is a special set of table instance APIs for reading rows out of the table instance called row models. TanStack Table has advanced features where the rows that are generated may be very different than the array of `data` that you originally passed in. To learn more about the different row models that you can pass in as a table option, see the [Row Models Guide](./row-models).
