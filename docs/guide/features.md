---
title: Features Guide
---

## Why the `features` Option Is Required

TanStack Table v9 requires a `features` option so that every table explicitly declares the capabilities it uses. In previous versions, we were cautious about expanding TanStack Table because every new capability risked adding code for all users, even when only a small percentage of applications needed it. That constraint helped keep the library small, but it also limited how much existing features could grow and how many new features we could offer.

The v9 plugin architecture removes that constraint. Each feature can now grow in capability, and TanStack Table can offer more features without including all of their code in every application. The total potential bundle size increased from about 14 kB in v8 to about 25 kB in v9, but most users should receive a smaller bundle when they register only the features they need. An application that uses roughly half of TanStack Table's available capabilities no longer has to ship the other half.

TanStack Table v9 is a headless, tree-shakable library built around a plugin architecture. A table always includes the small set of core features needed to create tables, columns, headers, rows, and cells. Other capabilities, including sorting, filtering, pagination, selection, and sizing, are opt-in.

Each feature contributes its own state, options, defaults, lifecycle hooks, and APIs to the table and its related objects. The feature object you register also controls the TypeScript surface: APIs for an omitted feature do not appear on the table, columns, rows, headers, or cells.

## Choose your features with `tableFeatures`

Every table declares its static feature set with `tableFeatures()`. A table that only needs core behavior uses an empty feature object:

```ts
import { tableFeatures, useTable } from '@tanstack/react-table'

const features = tableFeatures({})

function Table() {
  const table = useTable({
    features,
    columns,
    data,
  })

  // render the table...
}
```

Import and register only the optional features that table needs:

```ts
import {
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})
```

Define the feature object outside the component when possible. It is static configuration, and keeping it stable avoids rebuilding table structures and gives shared column definitions and helpers one reusable `typeof features` type.

`tableFeatures()` also validates relationships between slots. For example, a `sortedRowModel` requires `rowSortingFeature`, while `globalFilteringFeature` requires `columnFilteringFeature`. Missing prerequisites produce a type error that names the required feature.

## Features, Row Models, and Functions Are Separate

A feature adds state and APIs, but it does not perform client-side data processing by itself. Client-side row models are optional. Add the corresponding row-model factory only when TanStack Table should process the data in the browser. If your server performs that work, keep the feature for its state and APIs, and omit the client-side row model.

The following example enables client-side filtering, sorting, and pagination:

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

The pieces have distinct jobs:

- Feature objects provide state, options, event handlers, and instance APIs.
- Row models perform client-side filtering, grouping, sorting, expansion, pagination, and faceting.
- Function registries provide named filter, sort, and aggregation implementations.

Register only the functions you use. Importing individual functions preserves tree-shaking; spreading a complete built-in function registry includes every implementation in that registry. A function passed directly to a column option does not need to be registered by name.

For server-side processing, keep the feature for its state and APIs, omit the client-side row model, and configure the matching `manual*` option where applicable. See the [Row Models Guide](./row-models) and [Client-Side vs Server-Side Guide](./client-side-vs-server-side) for those data-flow choices.

## Using Every Stock Feature

`stockFeatures` is the complete collection of optional features. It is convenient for prototypes, shared compatibility layers, or tables that genuinely use most features:

```ts
import { stockFeatures, tableFeatures } from '@tanstack/react-table'

const features = tableFeatures({
  ...stockFeatures,
})
```

Because this imports the complete collection, it includes all stock feature code. Prefer individual feature imports when bundle size and tree-shaking matter. `stockFeatures` also does not add client-side row models or function registries; add those separately when needed.

## Stock Features

- `cellSelectionFeature`: [Cell Selection](../framework/react/guide/cell-selection) adds cell-range selection state and APIs.
- `cellSpanningFeature`: [Cell Spanning](../framework/react/guide/cell-spanning) lets cells span rows or columns.
- `columnFacetingFeature`: [Faceting](../framework/react/guide/column-faceting) derives unique values, ranges, and counts for filtering UIs.
- `columnFilteringFeature`: [Column Filtering](../framework/react/guide/column-filtering) filters individual columns and provides column-filter state.
- `columnGroupingFeature`: [Grouping](../framework/react/guide/grouping) groups rows by column values.
- `columnOrderingFeature`: [Column Ordering](../framework/react/guide/column-ordering) controls the order of columns.
- `columnPinningFeature`: [Column Pinning](../framework/react/guide/column-pinning) pins columns to the left or right side of a table.
- `columnResizingFeature`: [Column Resizing](../framework/react/guide/column-resizing) adds resize interactions and builds on column sizing.
- `columnSizingFeature`: [Column Sizing](../framework/react/guide/column-sizing) stores and exposes column width information.
- `columnVisibilityFeature`: [Column Visibility](../framework/react/guide/column-visibility) shows and hides columns.
- `globalFilteringFeature`: [Global Filtering](../framework/react/guide/global-filtering) filters rows across multiple columns and builds on column filtering.
- `rowAggregationFeature`: [Aggregation](../framework/react/guide/aggregation) calculates totals and other aggregate values over row sets.
- `rowExpandingFeature`: [Expanding](../framework/react/guide/expanding) controls expanded rows and visible sub-rows.
- `rowPaginationFeature`: [Pagination](../framework/react/guide/pagination) provides page state, navigation APIs, and optional client-side pagination.
- `rowPinningFeature`: [Row Pinning](../framework/react/guide/row-pinning) pins rows to the top or bottom of the table.
- `rowSelectionFeature`: [Row Selection](../framework/react/guide/row-selection) manages selected-row state and APIs.
- `rowSortingFeature`: [Sorting](../framework/react/guide/sorting) manages sort state and optional client-side row ordering.

These are the features included by `stockFeatures`. Fuzzy filtering is a filtering recipe built from the filtering and sorting features, while virtualization is provided by TanStack Virtual rather than a Table feature.

To build and type your own plugin, see the framework-specific [Custom Plugins guide](../framework/react/guide/custom-features).
