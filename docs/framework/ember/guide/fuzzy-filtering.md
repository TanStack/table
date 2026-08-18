---
title: Fuzzy Filtering (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Fuzzy Search](../examples/filters-fuzzy)

### Fuzzy Filtering Setup

Here's how you set up your table to use fuzzy filtering features. Adding the fuzzy filtering feature enables the related APIs. If you use client-side fuzzy filtering and sorting, also set up `filteredRowModel` and `sortedRowModel` after their features, since row model slots are type-checked.

```ts
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  metaHelper,
} from '@tanstack/ember-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(), // if using client-side filtering
  // manualFiltering: true, // if using manual server-side filtering
  sortedRowModel: createSortedRowModel(), // if using client-side sorting
  // manualSorting: true, // if using manual server-side sorting
  filterFns: { fuzzy: fuzzyFilter },
  sortFns: { fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

// inside your Glimmer component
table = useTable(() => ({
  features,
  columns,
  data: this.data,
}))
```

> [!NOTE]
> The `filterFns` and `sortFns` registries above list only the custom `fuzzy` functions this guide uses. Spreading the entire built-in registries (`filterFns: { ...filterFns, fuzzy: fuzzyFilter }`) still works, but it puts every built-in function in your bundle. Register just the functions you use, or pass functions directly to the `filterFn` and `sortFn` column options with no registration.

## Fuzzy Filtering (Ember) Guide

Fuzzy filtering is a technique that allows you to filter data based on approximate matches. This can be useful when you want to search for data that is similar to a given value, rather than an exact match.

You can implement client-side fuzzy filtering by defining a custom filter function. This function should take in the row, columnId, and filter value, and return a boolean indicating whether the row should be included in the filtered data.

Fuzzy filtering is mostly used with global filtering, but you can also apply it to individual columns. We will discuss how to implement fuzzy filtering for both cases.

> [!NOTE]
> You will need to install the `@tanstack/match-sorter-utils` library to use fuzzy filtering.
> TanStack Match Sorter Utils is a fork of [match-sorter](https://github.com/kentcdodds/match-sorter) by Kent C. Dodds. It was forked to work better with TanStack Table's row by row filtering approach.

Using the match-sorter libraries is optional, but the TanStack Match Sorter Utils library provides a great way to both fuzzy filter and sort by the rank information it returns, so that rows can be sorted by their closest matches to the search query.

### Defining a Custom Fuzzy Filter Function

Here's an example of a custom fuzzy filter function. First, define the filter meta shape and a features type that includes it:

```typescript
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, TableFeatures } from '@tanstack/ember-table'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// A features type that carries the filterMeta shape
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string)

  // Store the itemRank info
  addMeta?.({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
```

In this function, we're using the `rankItem` function from the `@tanstack/match-sorter-utils` library to rank the item. We then store the ranking information in the filter meta of the row (the `addMeta` callback is optional, so call it with optional chaining), and return whether the item passed the ranking criteria.

To reference this filter function by the string name `'fuzzy'` and type the stored filter meta, register both in the `tableFeatures` call using the `filterFns` and `filterMeta` slots:

```typescript
import { tableFeatures, metaHelper } from '@tanstack/ember-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { fuzzy: fuzzyFilter },
  sortFns: { fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
```

No `declare module` augmentation is needed. The `filterFns` and `filterMeta` slots are scoped to this features object and only affect tables created with it.

### Using Fuzzy Filtering with Global Filtering

To use fuzzy filtering with global filtering, register the fuzzy filter function in the `filterFns` slot on `tableFeatures` and reference it in the `globalFilterFn` option of the table:

```ts
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  metaHelper,
} from '@tanstack/ember-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(), // needed if you want sorting with fuzzy rank
  filterFns: { fuzzy: fuzzyFilter },
  sortFns: { fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

// inside your Glimmer component
table = useTable(() => ({
  features,
  columns,
  data: this.data,
  globalFilterFn: 'fuzzy',
}))
```

### Using Fuzzy Filtering with Column Filtering

To use fuzzy filtering with column filtering, register your fuzzy filter function in the `filterFns` slot on `tableFeatures` (as shown above). You can then specify the fuzzy filter by name in the `filterFn` option of the column definition:

```ts
const columns = columnHelper.columns([
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy', // using our custom fuzzy filter function
  }),
  // other columns...
])
```

In this example, we're applying the fuzzy filter to a column that combines the firstName and lastName fields of the data.

#### Sorting with Fuzzy Filtering

When using fuzzy filtering with column filtering, you might also want to sort the data based on the ranking information. You can do this by defining a custom sorting function:

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortFn_alphanumeric } from '@tanstack/ember-table'
import type { SortFn } from '@tanstack/ember-table'

const fuzzySort: SortFn<FuzzyFeatures, Person> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  const rankA = rowA.columnFiltersMeta[columnId]?.itemRank
  const rankB = rowB.columnFiltersMeta[columnId]?.itemRank
  if (rankA && rankB) {
    dir = compareItems(rankA, rankB)
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir
}
```

In this function, we're comparing the ranking information of the two rows. If the ranks are equal, we fall back to alphanumeric sorting.

Register `fuzzySort` in the `sortFns` slot on `tableFeatures` (as shown in the setup section above) and reference it by name in the column definition:

```ts
columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
  header: 'Full Name',
  cell: (info) => info.getValue(),
  filterFn: 'fuzzy', // using our custom fuzzy filter function (registered in features)
  sortFn: 'fuzzy', // using our custom fuzzy sort function (registered in features)
})
```

You can also pass `fuzzySort` directly as a function to the `sortFn` column option instead of a string reference, which skips the registration step.
