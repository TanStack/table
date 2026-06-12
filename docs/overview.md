---
title: Overview
---

TanStack Table is a **headless UI** library for building powerful tables and datagrids. Its core is **framework agnostic**, which means its API is the same regardless of the framework you are using. Official adapters are provided for React, Preact, Vue, Solid, Svelte, Angular, and Lit, and you can use the core directly in vanilla TypeScript or JavaScript via `@tanstack/table-core`.

> **These docs are for TanStack Table v9, which is currently in beta.** The docs for v8, the latest stable release, live at [tanstack.com/table/v8](https://tanstack.com/table/v8). When installing v9 packages, use the `beta` npm tag (see the [Installation](./installation) page).

If you are upgrading from v8, start with the migration guide for your framework:

<!-- ::start:framework -->

# React

- [Migrating to V9](./framework/react/guide/migrating)

# Preact

- [Migrating to V9](./framework/preact/guide/migrating)

# Solid

- [Migrating to V9](./framework/solid/guide/migrating)

# Svelte

- [Migrating to V9](./framework/svelte/guide/migrating)

# Vue

- [Migrating to V9](./framework/vue/guide/migrating)

# Angular

- [Migrating to V9](./framework/angular/guide/migrating)

# Lit

- [Migrating to V9](./framework/lit/guide/migrating)

# Vanilla

- The vanilla `@tanstack/table-core` entry point changed in v9. See the [Vanilla JS](./vanilla) page for the new setup.

<!-- ::end:framework -->

## What is "Headless" UI?

**Headless UI** is a term for libraries and utilities that provide the logic, state, processing, and APIs for UI elements and interactions, but **do not provide markup, styles, or pre-built implementations**. The hardest parts of building complex UIs usually revolve around state, events, side effects, and data processing. By removing those concerns from the markup and styles, your logic becomes more modular and reusable, while you keep complete control over the look and feel. When you use a headless library like TanStack Table, the complex work of data processing, state management, and business logic is handled for you, leaving you to focus on the higher-cardinality decisions that differ across designs and use cases.

> Want to dive deeper? [Read more about Headless UI](https://www.merrickchristensen.com/articles/headless-user-interface-components/).

## Component-Based vs Headless Libraries

In the ecosystem of table and datagrid libraries, there are two main categories, and each comes with tradeoffs:

**Component-based table libraries** ship a feature-rich, drop-in solution with ready-to-use components, markup, styles, and theming. [AG Grid](https://ag-grid.com/react-data-grid/?utm_source=reacttable&utm_campaign=githubreacttable) is a great example of this kind of library, and is by far our favorite grid-sibling (don't tell the others). You get a turn-key experience with little setup, at the cost of less control over markup, theme-based styling, larger bundle sizes, and tighter coupling to specific frameworks and platforms. **If you want a ready-to-use table and design or bundle size are not hard requirements**, a component-based library like AG Grid is a great choice.

**Headless table libraries** supply functions, state, and utilities that you wire into your own table markup (or attach to existing markup). You get full control over markup and styles, support for every styling pattern (CSS, CSS-in-JS, UI component libraries), smaller bundle sizes, and portability anywhere JavaScript runs, at the cost of a bit more setup and no provided markup or themes. **If you want a lighter-weight table or full control over the design**, TanStack Table was made for you.

## TypeScript

While TanStack Table is written in [TypeScript](https://www.typescriptlang.org/), using TypeScript in your application is optional (but recommended, as it comes with outstanding benefits to both you and your codebase).

If you use TypeScript, you will get top-notch type safety and editor autocomplete for all table APIs and state.

## Agnostic

Since TanStack Table is headless and runs on a vanilla TypeScript core, it is agnostic in a couple of ways:

1. TanStack Table is **framework agnostic**, which means you can use it with any JavaScript framework (or library) that you want. TanStack Table provides ready-to-use adapters for React, Preact, Vue, Solid, Svelte, Angular, and Lit out of the box, and the framework-agnostic core works in vanilla TypeScript or JavaScript and even in JS-to-native platforms like React Native. You can also create your own adapter if you need to.
2. TanStack Table is **CSS / component library agnostic**, which means that you can use TanStack Table with whatever CSS strategy or component library you want. TanStack Table itself does not render any table markup or styles. You bring your own! Want to use Tailwind or ShadCN? No problem! Want to use Material UI or Bootstrap? No problem! Have your own custom design system? TanStack Table was made for you!

## Core Objects and Types

Before diving into the object model, it helps to understand three concepts that are new in v9 and shape how everything else works:

- **Opt-in features**: Every table feature (sorting, filtering, row selection, and so on) is now opt-in. You declare exactly which features your table uses via the `features` table option, built with the `tableFeatures()` helper. This enables tree-shaking, so you only bundle the code for the features you actually use. If you want every feature enabled, v8-style, you can pass the provided `stockFeatures` object instead.
- **State atoms backed by TanStack Store**: Each slice of table state (sorting, pagination, column visibility, and so on) lives in its own reactive atom powered by [TanStack Store](https://tanstack.com/store/latest). Adapters subscribe to only the atoms you actually read, enabling fine-grained re-rendering, and you can supply your own external atoms to take full control of any state slice.
- **Row models as explicit opt-ins**: Data transformations such as filtering, sorting, grouping, expanding, and pagination are performed by row models that you register explicitly as factory slots on the `tableFeatures()` call, using factories like `createSortedRowModel()` and `createFilteredRowModel()`. If you do not register a row model, its processing code never ships in your bundle.

The table core then uses the following abstractions, commonly exposed by adapters:

- [Data](./guide/data) - The core data array you provide the table
- [Column Defs](./guide/column-defs): Objects used to configure a column and its data model, display templates, and more
- [Table Instance](./guide/tables): The core table object containing both state and API
- [Row Models](./guide/row-models): How the `data` array is transformed into useful rows depending on the features you are using
- [Rows](./guide/rows): Each row mirrors its respective row data and provides row-specific APIs
- [Cells](./guide/cells): Each cell mirrors its respective row-column intersection and provides cell-specific APIs
- [Header Groups](./guide/header-groups):  Header groups are computed slices of nested header levels, each containing a group of headers
- [Headers](./guide/headers): Each header is either directly associated with or derived from its column def and provides header-specific APIs
- [Columns](./guide/columns): Each column mirrors its respective column def and also provides column-specific APIs

## Features

TanStack Table will help you build just about any type of table you can imagine. It has built-in state and APIs for the following features, each of which you can opt in to individually:

<!-- ::start:framework -->

# React

- [Faceting](./framework/react/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/react/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/react/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/react/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/react/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/react/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/react/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/react/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/react/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/react/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/react/guide/pagination) - Paginate rows
- [Row Pinning](./framework/react/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/react/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/react/guide/sorting) - Sort rows by column values

# Preact

- [Faceting](./framework/preact/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/preact/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/preact/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/preact/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/preact/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/preact/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/preact/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/preact/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/preact/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/preact/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/preact/guide/pagination) - Paginate rows
- [Row Pinning](./framework/preact/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/preact/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/preact/guide/sorting) - Sort rows by column values

# Solid

- [Faceting](./framework/solid/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/solid/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/solid/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/solid/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/solid/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/solid/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/solid/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/solid/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/solid/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/solid/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/solid/guide/pagination) - Paginate rows
- [Row Pinning](./framework/solid/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/solid/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/solid/guide/sorting) - Sort rows by column values

# Svelte

- [Faceting](./framework/svelte/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/svelte/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/svelte/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/svelte/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/svelte/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/svelte/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/svelte/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/svelte/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/svelte/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/svelte/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/svelte/guide/pagination) - Paginate rows
- [Row Pinning](./framework/svelte/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/svelte/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/svelte/guide/sorting) - Sort rows by column values

# Vue

- [Faceting](./framework/vue/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/vue/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/vue/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/vue/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/vue/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/vue/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/vue/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/vue/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/vue/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/vue/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/vue/guide/pagination) - Paginate rows
- [Row Pinning](./framework/vue/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/vue/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/vue/guide/sorting) - Sort rows by column values

# Angular

- [Faceting](./framework/angular/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/angular/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/angular/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/angular/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/angular/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/angular/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/angular/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/angular/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/angular/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/angular/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/angular/guide/pagination) - Paginate rows
- [Row Pinning](./framework/angular/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/angular/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/angular/guide/sorting) - Sort rows by column values

# Lit

- [Faceting](./framework/lit/guide/column-faceting) - List unique values or min/max values for a column or for the entire table
- [Column Filtering](./framework/lit/guide/column-filtering) - Filter rows based on search values for a column
- [Column Grouping](./framework/lit/guide/grouping) - Group columns together, run aggregations, and more
- [Column Ordering](./framework/lit/guide/column-ordering) - Dynamically change the order of columns
- [Column Pinning](./framework/lit/guide/column-pinning) - Pin (Freeze) columns to the left or right of the table
- [Column Resizing](./framework/lit/guide/column-resizing) - Let users resize columns with drag handles
- [Column Sizing](./framework/lit/guide/column-sizing) - Dynamically change the size of columns
- [Column Visibility](./framework/lit/guide/column-visibility) - Hide/show columns
- [Global Filtering](./framework/lit/guide/global-filtering) - Filter rows based on search values for the entire table
- [Row Expanding](./framework/lit/guide/expanding) - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/lit/guide/pagination) - Paginate rows
- [Row Pinning](./framework/lit/guide/row-pinning) - Pin (Freeze) rows to the top or bottom of the table
- [Row Selection](./framework/lit/guide/row-selection) - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/lit/guide/sorting) - Sort rows by column values

# Vanilla

- Column Faceting - List unique lists of column values or min/max values for a column
- Column Filtering - Filter rows based on search values for a column
- Column Grouping - Group columns together, run aggregations, and more
- Column Ordering - Dynamically change the order of columns
- Column Pinning - Pin (Freeze) columns to the left or right of the table
- Column Resizing - Let users resize columns with drag handles
- Column Sizing - Dynamically change the size of columns
- Column Visibility - Hide/show columns
- Global Faceting - List unique lists of column values or min/max values for the entire table
- Global Filtering - Filter rows based on search values for the entire table
- Row Expanding - Expand/collapse rows (sub-rows)
- [Row Pagination](./framework/vanilla/guide/pagination) - Paginate rows
- Row Pinning - Pin (Freeze) rows to the top or bottom of the table
- Row Selection - Select/deselect rows (checkboxes)
- [Row Sorting](./framework/vanilla/guide/sorting) - Sort rows by column values

<!-- ::end:framework -->

These are just some of the capabilities that you can build with TanStack Table. There are many more features that are possible with TanStack Table that you can add along-side the built-in features.

Virtualization is an example of a feature that is not built in to TanStack Table, but can be achieved by using another library (like [TanStack Virtual](https://tanstack.com/virtual/latest)) alongside your other table rendering logic. Each framework has its own Virtualization guide in the Feature Guides section of the navigation.

TanStack Table also supports custom features (plugins) that you can use to modify the table instance and add your own custom logic to the table in a more integrated way. See the Custom Features guide for your framework to learn more.

And of course, you can just write your own state and hooks to add whatever other features you want for your table. The features from the TanStack Table core are just a solid foundation to build on, with a large focus on performance and DX.
