---
title: Table Instance Guide
---

## Table Instance Guide

TanStack Table is a headless UI library. When we talk about the `table` or "table instance", we're not talking about a literal `<table>` element. Instead, we're referring to the core table object that coordinates table state and APIs. The `table` instance is created by calling your adapter's table creation function (e.g. `useTable`, `createTable`, `injectTable`, or `constructTable`).

The `table` instance returned from one of these functions is the main object that you will interact with to read and mutate the table state. It is the one place where everything happens in TanStack Table. When you get to the point where you are rendering your UI, you will use APIs from this `table` instance.

### Creating a Table Instance

To create a table instance, 3 `options` are required: `columns`, `data`, and `features`. The `features` option declares which table features your table uses (enabling tree-shaking, so you only bundle what you use). The core row model is included automatically; add additional row model factories as slots on the `tableFeatures()` call when you need filtering, sorting, pagination, etc. There are dozens of other table options to configure features and behavior.

#### Defining Data

Define your data as an array of objects with a stable reference. `data` can come from anywhere like an API response or defined statically in your code, but it must have a stable reference to prevent infinite re-renders. If using TypeScript, the type that you give your data will be used as a `TData` generic. See the [Data Guide](./data) for more info.

#### Defining Columns

Column definitions are covered in detail in the previous section in the [Column Def Guide](./column-defs). We'll note here, however, that when you define the type of your columns, you should use the same `TData` type that you used for your data.

```ts
const features = tableFeatures({}) // Define which features your table uses
const columns: ColumnDef<typeof features, User>[] = [] // Pass User type as TData; use typeof features for TFeatures
//or
const columnHelper = createColumnHelper<typeof features, User>() // Pass both TFeatures and TData in v9
```

The column definitions are where we will tell TanStack Table how each column should access and/or transform row data with either an `accessorKey` or `accessorFn`. See the [Column Def Guide](./column-defs#creating-accessor-columns) for more info.

#### Defining Features and Row Models

This is explained in much more detail in the [Row Models Guide](./row-models). In v9, you declare which features your table uses via `features` (using `tableFeatures()`), and row model factories live as slots on that same features object. The core row model is always included automatically. For a basic table with no filtering, sorting, or pagination, pass an empty features object:

<!-- ::start:framework -->

# React

```ts
import { tableFeatures, useTable } from '@tanstack/react-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = useTable({
  features,
  columns,
  data,
})
```

# Preact

```ts
import { tableFeatures, useTable } from '@tanstack/preact-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = useTable({
  features,
  columns,
  data,
})
```

# Vue

```ts
import { tableFeatures, useTable } from '@tanstack/vue-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = useTable({
  features,
  columns,
  data,
})
```

# Solid

```ts
import { tableFeatures, createTable } from '@tanstack/solid-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

# Svelte

```ts
import { tableFeatures, createTable } from '@tanstack/svelte-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

# Angular

```ts
import { injectTable, tableFeatures } from '@tanstack/angular-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))
```

# Lit

```ts
import { TableController, tableFeatures } from '@tanstack/lit-table'

const features = tableFeatures({}) // Core features only; add columnFilteringFeature, rowSortingFeature, etc. as needed

// inside your LitElement render():
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
})
```

# Vanilla

```ts
import { constructTable, tableFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})

const table = constructTable({
  features,
  columns,
  data,
})
```

<!-- ::end:framework -->

#### Initializing the Table Instance

With our `features`, `columns`, and `data` defined, we can now create our basic table instance, alongside any other table options that we want to pass in.

> **Framework note:** Each framework adapter has its own table creation function, but they all accept the same core options:

<!-- ::start:framework -->

# React

```ts
const table = useTable({ features, columns, data })
```

# Preact

```ts
const table = useTable({ features, columns, data })
```

# Vue

```ts
const table = useTable({ features, columns, data })
```

# Solid

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

# Svelte

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

# Angular

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))
```

# Lit

```ts
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
})
```

# Vanilla

```ts
const table = constructTable({ features, columns, data })
```

<!-- ::end:framework -->

So what's in the `table` instance? Let's take a look at what interactions we can have with the table instance.

### Table State

The table instance contains the state slices registered by its `features`. Each feature registers the state it owns. For example, the row selection feature registers `rowSelection` state, and the pagination feature registers `pagination` state. In v9, those slices are backed by TanStack Store atoms:

- `table.baseAtoms` are the internal writable atoms.
- `table.atoms` are the public readonly atoms for each slice.
- `table.store` is the readonly flat store derived from `table.atoms`.

```ts
table.atoms.rowSelection.get() // read the current row selection state
table.store.state.rowSelection // read the current table state snapshot
table.setRowSelection((old) => ({...old})) //set the row selection state
table.resetRowSelection() //reset the row selection state
```

Direct reads like `table.atoms.rowSelection.get()` and `table.store.state.rowSelection` are current values. Framework adapters add their own reactive state access APIs where needed. This is covered in more detail in the Table State Guide for your framework:

<!-- ::start:framework -->

# React

[Table State Guide](../framework/react/guide/table-state)

# Preact

[Table State Guide](../framework/preact/guide/table-state)

# Vue

[Table State Guide](../framework/vue/guide/table-state)

# Solid

[Table State Guide](../framework/solid/guide/table-state)

# Svelte

[Table State Guide](../framework/svelte/guide/table-state)

# Angular

[Table State Guide](../framework/angular/guide/table-state)

# Lit

[Table State Guide](../framework/lit/guide/table-state)

# Vanilla

[Table State Guide](../framework/vanilla/guide/table-state)

<!-- ::end:framework -->

### Table APIs

There are dozens of table APIs created by each feature to help you either read or mutate the table state in different ways.

API reference docs for the core table instance and all other feature APIs can be found throughout the [Reference Docs](../reference/index).

### Table Row Models

There is a special set of table instance APIs for reading rows out of the table instance called row models. TanStack Table has advanced features where the rows that are generated may be very different than the array of `data` that you originally passed in. To learn more about the different row models and how to register them, see the [Row Models Guide](./row-models).
