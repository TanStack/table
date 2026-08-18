---
title: Overview
---

> NOTE: If you are upgrading from TanStack Table v8, start with the migration guide for your framework:

<!-- ::start:framework -->

# React

- [Migrating to v9](./framework/react/guide/migrating)

# Preact

- [Migrating to v9](./framework/preact/guide/migrating)

# Octane

- Octane support is new in v9, so there is nothing to migrate. Start with the [Octane Quick Start](./framework/octane/quick-start).

# Solid

- [Migrating to v9](./framework/solid/guide/migrating)

# Svelte

- [Migrating to v9](./framework/svelte/guide/migrating)

# Vue

- [Migrating to v9](./framework/vue/guide/migrating)

# Angular

- [Migrating to v9](./framework/angular/guide/migrating)

# Ember

- Ember support is new in v9, so there is nothing to migrate. Start with the [Quick Start](./framework/ember/quick-start).

# Lit

- [Migrating to v9](./framework/lit/guide/migrating)

# Alpine

- Alpine support is new in v9, so there is nothing to migrate. Start with the [Quick Start](./framework/alpine/quick-start).

# Vanilla

- The vanilla `@tanstack/table-core` entry point changed in v9. See the [Vanilla Quick Start](./framework/vanilla/quick-start) page for the new setup.

<!-- ::end:framework -->

TanStack Table is the best way to build your own powerful table and datagrid components with _blazingly fast_ performance, but most importantly, with **100% control over your own design and markup.**

In this new age of AI, where markup can be generated in seconds, the old value proposition of pre-built components (saving you the typing) matters less than ever. What matters now is owning and controlling the result, and that is exactly what TanStack Table gives you.

TanStack Table might be a bit of a different table library than you are used to. It is **_NOT_** a pre-built table component, like you might find from a library like [AG Grid](https://ag-grid.com?utm_source=reacttable&utm_campaign=githubreacttable). Instead, TanStack Table is a headless UI library that gives you the power to build your own fully customizable table and datagrid components the right way with whatever JavaScript libraries, component libraries, or design systems you want. TanStack Table is the _engine_ that you can hook up to your own favorite front-end tech, no matter what you're already using or want to use.

At its core, TanStack Table is **agnostic**. ~95% of the source code of TanStack Table is written in vanilla, framework-agnostic TypeScript, and thin framework adapters are available for your favorite frameworks. Official adapters are provided for React, Preact, Octane, Vue, Solid, Svelte, Angular, Ember, Lit, and Alpine, or you can use the core directly in vanilla JavaScript via `@tanstack/table-core`.

It also **does not care which CSS or component library** you use, and is compatible with anything from Tailwind, Bootstrap, Material UI, ShadCN UI, or even your own custom design system.

## What is "Headless" UI?

**Headless UI** is a term for libraries and utilities that provide the logic, state, processing, and APIs for UI elements and interactions, but **do not provide markup, styles, or pre-built implementations**. The hardest parts of building complex UIs usually revolve around state, events, side effects, and data processing. By removing those concerns from the markup and styles, your logic becomes more modular and reusable, while you keep complete control over the look and feel. When you use a headless library like TanStack Table, the complex work of data processing, state management, and business logic is handled for you, leaving you to focus on the higher-cardinality decisions that differ across designs and use cases.

> Want to dive deeper? [Read more about Headless UI](https://www.merrickchristensen.com/articles/headless-user-interface-components/).

Here's the difference in practice. With a pre-built table component, you pass props in and style the result from the outside, limited to whatever the component's props and theme APIs allow. With TanStack Table, you create a table instance and use its state and APIs to render your own markup:

<!-- ::start:framework -->

# React

```diff
- {/* Pass props into a pre-built component and hope you can style it */}
- <PrebuiltDataGrid
-   data={data}
-   columns={columns}
-   theme={messyThemeOverrides}
-   sx={cssOverridesThatHopefullyWork}
-   positionPagination={"however-my-stakeholders-are-feeling-today"}
- />
+ // Build your own markup from the table instance's state and APIs
+ const table = useTable({ features, columns, data })
+
+ return (
+   <table className="anything-you-want">
+     <thead>
+       {/* need to really customize the functionality in your headers? no problem! */}
+       {table.getHeaderGroups().map((headerGroup) => ( ... ))}
+     </thead>
+     <tbody>
+       {/* want to add virtualization here? no problem! */}
+       {table.getRowModel().rows.map((row) => ( ... ))}
+     </tbody>
+   </table>
+ )
```

# Preact

```diff
- {/* Pass props into a pre-built component and hope you can style it */}
- <PrebuiltDataGrid
-   data={data}
-   columns={columns}
-   theme={messyThemeOverrides}
-   sx={cssOverridesThatHopefullyWork}
-   positionPagination={"however-my-stakeholders-are-feeling-today"}
- />
+ // Build your own markup from the table instance's state and APIs
+ const table = useTable({ features, columns, data })
+
+ return (
+   <table className="anything-you-want">
+     <thead>
+       {/* need to really customize the functionality in your headers? no problem! */}
+       {table.getHeaderGroups().map((headerGroup) => ( ... ))}
+     </thead>
+     <tbody>
+       {/* want to add virtualization here? no problem! */}
+       {table.getRowModel().rows.map((row) => ( ... ))}
+     </tbody>
+   </table>
+ )
```

# Octane

```diff
- {/* Pass props into a pre-built component and hope you can style it */}
- <PrebuiltDataGrid
-   data={data}
-   columns={columns}
-   theme={messyThemeOverrides}
-   sx={cssOverridesThatHopefullyWork}
-   positionPagination={"however-my-stakeholders-are-feeling-today"}
- />
+ // Build your own markup from the table instance's state and APIs
+ const table = useTable({ features, columns, data })
+
+ <table className="anything-you-want">
+   <thead>
+     {/* need to really customize the functionality in your headers? no problem! */}
+     @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) { ... }
+   </thead>
+   <tbody>
+     @for (const row of table.getRowModel().rows; key row.id) { ... }
+   </tbody>
+ </table>
```

# Solid

```diff
- {/* Pass props into a pre-built component and hope you can style it */}
- <PrebuiltDataGrid
-   data={data()}
-   columns={columns}
-   theme={messyThemeOverrides}
-   sx={cssOverridesThatHopefullyWork}
-   positionPagination={"however-my-stakeholders-are-feeling-today"}
- />
+ // Build your own markup from the table instance's state and APIs
+ const table = createTable({ features, columns, get data() { return data() } })
+
+ return (
+   <table class="anything-you-want">
+     <thead>
+       {/* need to really customize the functionality in your headers? no problem! */}
+       <For each={table.getHeaderGroups()}>{(headerGroup) => ( ... )}</For>
+     </thead>
+     <tbody>
+       {/* want to add virtualization here? no problem! */}
+       <For each={table.getRowModel().rows}>{(row) => ( ... )}</For>
+     </tbody>
+   </table>
+ )
```

# Svelte

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <PrebuiltDataGrid
-   {data}
-   {columns}
-   theme={messyThemeOverrides}
-   sx={cssOverridesThatHopefullyWork}
-   positionPagination="however-my-stakeholders-are-feeling-today"
- />
+ <!-- Build your own markup from the table instance's state and APIs -->
+ <script>
+   const table = createTable({ features, columns, get data() { return data } })
+ </script>
+
+ <table class="anything-you-want">
+   <thead>
+     <!-- need to really customize the functionality in your headers? no problem! -->
+     {#each table.getHeaderGroups() as headerGroup} ... {/each}
+   </thead>
+   <tbody>
+     <!-- want to add virtualization here? no problem! -->
+     {#each table.getRowModel().rows as row} ... {/each}
+   </tbody>
+ </table>
```

# Vue

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <PrebuiltDataGrid
-   :data="data"
-   :columns="columns"
-   :theme="messyThemeOverrides"
-   :sx="cssOverridesThatHopefullyWork"
-   position-pagination="however-my-stakeholders-are-feeling-today"
- />
+ <!-- Build your own markup from the table instance's state and APIs -->
+ <script setup>
+ const table = useTable({ features, columns, data })
+ </script>
+
+ <template>
+   <table class="anything-you-want">
+     <thead>
+       <!-- need to really customize the functionality in your headers? no problem! -->
+       <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">...</tr>
+     </thead>
+     <tbody>
+       <!-- want to add virtualization here? no problem! -->
+       <tr v-for="row in table.getRowModel().rows" :key="row.id">...</tr>
+     </tbody>
+   </table>
+ </template>
```

# Angular

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <prebuilt-data-grid
-   [data]="data"
-   [columns]="columns"
-   [theme]="messyThemeOverrides"
-   [styleOverrides]="cssOverridesThatHopefullyWork"
-   positionPagination="however-my-stakeholders-are-feeling-today"
- />
+ // Build your own markup from the table instance's state and APIs
+ readonly table = injectTable(() => ({ features, columns, data: this.data() }))
+
+ <!-- in your component template -->
+ <table class="anything-you-want">
+   <thead>
+     <!-- need to really customize the functionality in your headers? no problem! -->
+     @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) { ... }
+   </thead>
+   <tbody>
+     <!-- want to add virtualization here? no problem! -->
+     @for (row of table.getRowModel().rows; track row.id) { ... }
+   </tbody>
+ </table>
```

# Ember

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <PrebuiltDataGrid
-   @data={{this.data}}
-   @columns={{this.columns}}
-   @theme={{this.messyThemeOverrides}}
-   @styleOverrides={{this.cssOverridesThatHopefullyWork}}
-   @positionPagination="however-my-stakeholders-are-feeling-today"
- />
+ // Build your own markup from the table instance's state and APIs
+ table = useTable(() => ({ features, columns, data: this.data }))
+
+ get rows() { return this.table.getRowModel().rows }
+ get headerGroups() { return this.table.getHeaderGroups() }
+
+ <template>
+   <table class="anything-you-want">
+     <thead>
+       {{! need to really customize the functionality in your headers? no problem! }}
+       {{#each this.headerGroups as |headerGroup|}} ... {{/each}}
+     </thead>
+     <tbody>
+       {{! want to add virtualization here? no problem! }}
+       {{#each this.rows as |row|}} ... {{/each}}
+     </tbody>
+   </table>
+ </template>
```

# Lit

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <prebuilt-data-grid
-   .data=${data}
-   .columns=${columns}
-   .theme=${messyThemeOverrides}
-   .sx=${cssOverridesThatHopefullyWork}
-   positionPagination="however-my-stakeholders-are-feeling-today"
- ></prebuilt-data-grid>
+ // Build your own markup from the table instance's state and APIs
+ private tableController = new TableController(this)
+
+ render() {
+   const table = this.tableController.table({ features, columns, data: this.data })
+
+   return html`
+     <table class="anything-you-want">
+       <thead>
+         <!-- need to really customize the functionality in your headers? no problem! -->
+         ${table.getHeaderGroups().map((headerGroup) => html`...`)}
+       </thead>
+       <tbody>
+         <!-- want to add virtualization here? no problem! -->
+         ${table.getRowModel().rows.map((row) => html`...`)}
+       </tbody>
+     </table>
+   `
+ }
```

# Alpine

```diff
- <!-- Pass props into a pre-built component and hope you can style it -->
- <prebuilt-data-grid
-   data="data"
-   columns="columns"
-   theme="messy-theme-overrides"
-   position-pagination="however-my-stakeholders-are-feeling-today"
- ></prebuilt-data-grid>
+ // Build your own markup from the table instance's state and APIs
+ Alpine.data('myTable', () => {
+   const table = createTable({ features, columns, get data() { return data } })
+   return { table }
+ })
+
+ <!-- in your markup -->
+ <table class="anything-you-want" x-data="myTable">
+   <thead>
+     <!-- need to really customize the functionality in your headers? no problem! -->
+     <template x-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">...</template>
+   </thead>
+   <tbody>
+     <!-- want to add virtualization here? no problem! -->
+     <template x-for="row in table.getRowModel().rows" :key="row.id">...</template>
+   </tbody>
+ </table>
```

# Vanilla

```diff
- // Configure a pre-built widget and hope you can style it
- new PrebuiltDataGrid('#my-table', {
-   data,
-   columns,
-   theme: messyThemeOverrides,
-   positionPagination: 'however-my-stakeholders-are-feeling-today',
- })
+ // Build your own markup from the table instance's state and APIs
+ const table = constructTable({ features, columns, data })
+
+ // render however you like: DOM APIs, innerHTML, or your own template system
+ table.getHeaderGroups().forEach((headerGroup) => { ... })
+ table.getRowModel().rows.forEach((row) => { ... })
```

<!-- ::end:framework -->

## Features

TanStack Table is packed with features, but you only ever bundle the ones you use. Many libraries claim to be "lightweight"; TanStack Table happens to be lightweight too (under 20 KB even with every feature enabled), but more importantly, it is **modular**! You register only the features and row models that your table actually uses, and your bundler tree-shakes away the rest. A basic table bundles just the small core. The code for sorting, filtering, grouping, and every other feature below is only included in your bundle once you register it. So if you only use half of the features from TanStack Table, you only bundle about half of the library.

We like to think of TanStack Table as more of a "system" for building tables than just a library, as it is one of the most customizable table libraries ever built. TanStack Table has the following built-in features, plus a custom feature (plugin) system for adding your own state and APIs.

<!-- ::start:framework -->

# React

- [Column Filtering](./framework/react/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/react/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/react/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/react/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/react/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/react/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/react/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/react/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/react/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/react/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/react/guide/pagination) - Paginate rows
- [Row Pinning](./framework/react/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/react/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/react/guide/sorting) - Sort rows by column values

# Preact

- [Column Filtering](./framework/preact/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/preact/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/preact/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/preact/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/preact/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/preact/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/preact/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/preact/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/preact/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/preact/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/preact/guide/pagination) - Paginate rows
- [Row Pinning](./framework/preact/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/preact/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/preact/guide/sorting) - Sort rows by column values

# Octane

- [Column Filtering](./framework/octane/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/octane/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/octane/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/octane/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/octane/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/octane/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/octane/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/octane/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/octane/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/octane/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/octane/guide/pagination) - Paginate rows
- [Row Pinning](./framework/octane/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/octane/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/octane/guide/sorting) - Sort rows by column values

# Solid

- [Column Filtering](./framework/solid/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/solid/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/solid/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/solid/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/solid/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/solid/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/solid/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/solid/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/solid/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/solid/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/solid/guide/pagination) - Paginate rows
- [Row Pinning](./framework/solid/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/solid/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/solid/guide/sorting) - Sort rows by column values

# Svelte

- [Column Filtering](./framework/svelte/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/svelte/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/svelte/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/svelte/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/svelte/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/svelte/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/svelte/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/svelte/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/svelte/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/svelte/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/svelte/guide/pagination) - Paginate rows
- [Row Pinning](./framework/svelte/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/svelte/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/svelte/guide/sorting) - Sort rows by column values

# Vue

- [Column Filtering](./framework/vue/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/vue/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/vue/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/vue/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/vue/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/vue/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/vue/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/vue/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/vue/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/vue/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/vue/guide/pagination) - Paginate rows
- [Row Pinning](./framework/vue/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/vue/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/vue/guide/sorting) - Sort rows by column values

# Angular

- [Column Filtering](./framework/angular/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/angular/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/angular/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/angular/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/angular/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/angular/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/angular/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/angular/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/angular/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/angular/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/angular/guide/pagination) - Paginate rows
- [Row Pinning](./framework/angular/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/angular/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/angular/guide/sorting) - Sort rows by column values

# Ember

- [Column Filtering](./framework/ember/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/ember/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/ember/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/ember/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/ember/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/ember/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/ember/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/ember/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/ember/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/ember/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/ember/guide/pagination) - Paginate rows
- [Row Pinning](./framework/ember/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/ember/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/ember/guide/sorting) - Sort rows by column values

# Lit

- [Column Filtering](./framework/lit/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/lit/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/lit/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/lit/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/lit/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/lit/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/lit/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/lit/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/lit/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/lit/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/lit/guide/pagination) - Paginate rows
- [Row Pinning](./framework/lit/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/lit/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/lit/guide/sorting) - Sort rows by column values

# Alpine

- [Column Filtering](./framework/alpine/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/alpine/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/alpine/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/alpine/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/alpine/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/alpine/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/alpine/guide/column-visibility) - Hide/show columns
- [Faceting](./framework/alpine/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Global Filtering](./framework/alpine/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/alpine/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/alpine/guide/pagination) - Paginate rows
- [Row Pinning](./framework/alpine/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/alpine/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/alpine/guide/sorting) - Sort rows by column values

<!-- ::end:framework -->

## Composition

Headless doesn't just mean "bring your own styles". Because you own the markup, the event handlers, and (optionally) the state, TanStack Table composes cleanly with whatever else your table needs:

- **Your own state**: Any slice of table state (sorting, filters, pagination, etc.) can be lifted out of the table and managed however you like: in your framework's state, in a global store, or even in the URL.
- **Your own features**: Custom features let you add your own state and APIs directly to the table instance, right alongside the built-in ones. See the Custom Features guide for your framework.
- **Your own logic**: Anything else (fancy interactions, analytics, drag and drop, etc.) is just code you write around the table. There is no black box to fight against.

This also makes it easy to pair TanStack Table with other TanStack libraries:

- [TanStack Virtual](https://tanstack.com/virtual/latest) - Virtualize thousands of rows or columns without changing any table logic (see the Virtualization guide for your framework)
- [TanStack Query](https://tanstack.com/query/latest) - Fetch and cache server-side data for manual pagination, sorting, and filtering
- [TanStack Form](https://tanstack.com/form/latest) - Build editable cells and inline row editing with validation
- [TanStack Pacer](https://tanstack.com/pacer/latest) - Debounce or throttle filter inputs and other rapid-fire interactions
- [TanStack Hotkeys](https://tanstack.com/hotkeys/latest) - Add type-safe keyboard shortcuts for table navigation and actions
- [TanStack Store](https://tanstack.com/store/latest) - Already powers table state under the hood; provide your own atoms to take full control of any state slice

## Get Started

Ready to build something? Head to the Quick Start for your framework, then explore the runnable examples:

<!-- ::start:framework -->

# React

- [React Quick Start](./framework/react/quick-start)
- [Kitchen Sink example](./framework/react/examples/kitchen-sink) - Most of the built-in features working together in one table

Using a component library? These examples pair TanStack Table with popular React component libraries, with both a basic version and an advanced (kitchen sink) version for each:

- ShadCN (Base UI): [Basic Example](./framework/react/examples/lib-shadcn-base) | [Advanced Example](./framework/react/examples/kitchen-sink-shadcn-base)
- ShadCN (Radix UI): [Basic Example](./framework/react/examples/lib-shadcn-radix) | [Advanced Example](./framework/react/examples/kitchen-sink-shadcn-radix)
- HeroUI: [Basic Example](./framework/react/examples/lib-hero-ui) | [Advanced Example](./framework/react/examples/kitchen-sink-hero-ui)
- React Aria: [Basic Example](./framework/react/examples/lib-react-aria) | [Advanced Example](./framework/react/examples/kitchen-sink-react-aria)
- Material UI: [Basic Example](./framework/react/examples/lib-material-ui) | [Advanced Example](./framework/react/examples/kitchen-sink-material-ui)
- Mantine: [Basic Example](./framework/react/examples/lib-mantine) | [Advanced Example](./framework/react/examples/kitchen-sink-mantine)
- Chakra UI: [Basic Example](./framework/react/examples/lib-chakra-ui) | [Advanced Example](./framework/react/examples/kitchen-sink-chakra-ui)

# Preact

- [Preact Quick Start](./framework/preact/quick-start)
- [Kitchen Sink example](./framework/preact/examples/kitchen-sink) - Most of the built-in features working together in one table

# Octane

- [Octane Quick Start](./framework/octane/quick-start)
- [Kitchen Sink example](./framework/octane/examples/kitchen-sink) - Most of the built-in features working together in one table

# Solid

- [Solid Quick Start](./framework/solid/quick-start)
- [Kitchen Sink example](./framework/solid/examples/kitchen-sink) - Most of the built-in features working together in one table

# Svelte

- [Svelte Quick Start](./framework/svelte/quick-start)
- [Kitchen Sink example](./framework/svelte/examples/kitchen-sink) - Most of the built-in features working together in one table

# Vue

- [Vue Quick Start](./framework/vue/quick-start)
- [Kitchen Sink example](./framework/vue/examples/kitchen-sink) - Most of the built-in features working together in one table

# Angular

- [Angular Quick Start](./framework/angular/quick-start)
- [Kitchen Sink example](./framework/angular/examples/kitchen-sink) - Most of the built-in features working together in one table

# Ember

- [Ember Quick Start](./framework/ember/quick-start)
- [Kitchen Sink example](./framework/ember/examples/kitchen-sink) - Most of the built-in features working together in one table

# Lit

- [Lit Quick Start](./framework/lit/quick-start)
- [Kitchen Sink example](./framework/lit/examples/kitchen-sink) - Most of the built-in features working together in one table

# Alpine

- [Alpine Quick Start](./framework/alpine/quick-start)
- [Basic example](./framework/alpine/examples/basic-create-table) - A simple table to get you started

# Vanilla

- [Vanilla Quick Start](./framework/vanilla/quick-start)
- [Basic example](./framework/vanilla/examples/basic) - A simple table built directly on `@tanstack/table-core`

<!-- ::end:framework -->
