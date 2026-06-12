---
title: Fuzzy Filtering (React) Guide
---

## Examples

Want to skip to the implementation? Check out these React examples:

- [Fuzzy Search](../examples/filters-fuzzy)

### React Setup

```tsx
import { useTable, tableFeatures, columnFilteringFeature, globalFilteringFeature, rowSortingFeature, createFilteredRowModel, createSortedRowModel, filterFns, sortFns, metaHelper } from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const table = useTable({
  features,
  columns,
  data,
})
```

## Fuzzy Filtering (React) Guide

Fuzzy filtering is a technique that allows you to filter data based on approximate matches. This can be useful when you want to search for data that is similar to a given value, rather than an exact match.

You can implement a client side fuzzy filtering by defining a custom filter function. This function should take in the row, columnId, and filter value, and return a boolean indicating whether the row should be included in the filtered data.

Fuzzy filtering is mostly used with global filtering, but you can also apply it to individual columns. We will discuss how to implement fuzzy filtering for both cases.

> **Note:** You will need to install the `@tanstack/match-sorter-utils` library to use fuzzy filtering.
> TanStack Match Sorter Utils is a fork of [match-sorter](https://github.com/kentcdodds/match-sorter) by Kent C. Dodds. It was forked in order to work better with TanStack Table's row by row filtering approach.

Using the match-sorter libraries is optional, but the TanStack Match Sorter Utils library provides a great way to both fuzzy filter and sort by the rank information it returns, so that rows can be sorted by their closest matches to the search query.

### Defining a Custom Fuzzy Filter Function

Here's an example of a custom fuzzy filter function. First, define the filter meta shape and a features type that includes it:

```typescript
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, RowData, TableFeatures } from '@tanstack/react-table'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// A features type that carries the filterMeta shape
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, RowData> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta?.({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
```

In this function, we're using the `rankItem` function from the `@tanstack/match-sorter-utils` library to rank the item. We then store the ranking information in the filter meta of the row (the `addMeta` callback is optional, so call it with optional chaining), and return whether the item passed the ranking criteria.

To reference this filter function by the string name `'fuzzy'` and type the stored filter meta, register both in the `tableFeatures` call using the `filterFns` and `filterMeta` slots:

```typescript
import { tableFeatures, metaHelper } from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
```

No `declare module` augmentation is needed. The `filterFns` and `filterMeta` slots are scoped to this features object and only affect tables created with it.

### Using Fuzzy Filtering with Global Filtering

To use fuzzy filtering with global filtering, register the fuzzy filter function in the `filterFns` slot on `tableFeatures` and reference it in the `globalFilterFn` option of the table:

```typescript
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  metaHelper,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(), // needed if you want sorting with fuzzy rank
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const table = useTable({
  features,
  columns,
  data,
  globalFilterFn: 'fuzzy',
})
```

### Using Fuzzy Filtering with Column Filtering

To use fuzzy filtering with column filtering, pass your fuzzy filter function to `createFilteredRowModel` (merging it with the built-in `filterFns`). You can then specify the fuzzy filter by name in the `filterFn` option of the column definition:

```typescript
const column = [
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //using our custom fuzzy filter function
  },
  // other columns...
];
```

In this example, we're applying the fuzzy filter to a column that combines the firstName and lastName fields of the data.

#### Sorting with Fuzzy Filtering

When using fuzzy filtering with column filtering, you might also want to sort the data based on the ranking information. You can do this by defining a custom sorting function:

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortFns } from '@tanstack/react-table'
import type { SortFn } from '@tanstack/react-table'

const fuzzySort: SortFn<FuzzyFeatures, Person> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

In this function, we're comparing the ranking information of the two rows. If the ranks are equal, we fall back to alphanumeric sorting.

Register `fuzzySort` in the `sortFns` slot on `tableFeatures` (as shown in the setup section above) and reference it by name in the column definition:

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', // using our custom fuzzy filter function (registered in features)
  sortFn: 'fuzzy', // using our custom fuzzy sort function (registered in features)
}
```

You can also pass `fuzzySort` directly as a function to the `sortFn` column option instead of a string reference, which skips the registration step.
