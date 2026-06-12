---
title: Fuzzy Filtering (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Fuzzy Search](../examples/filters-fuzzy)

### Angular Setup

```ts
import { signal } from '@angular/core'
import { injectTable, tableFeatures, columnFilteringFeature, globalFilteringFeature, rowSortingFeature, createFilteredRowModel, createSortedRowModel, filterFns, sortFns, metaHelper } from '@tanstack/angular-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

interface FuzzyFilterMeta { itemRank?: RankingInfo }

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter }, // fuzzyFilter defined below
  sortFns: { ...sortFns, fuzzy: fuzzySort }, // fuzzySort defined below
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Fuzzy Filtering (Angular) Guide

Fuzzy filtering is a technique that allows you to filter data based on approximate matches. This can be useful when you want to search for data that is similar to a given value, rather than an exact match.

You can implement a client side fuzzy filtering by defining a custom filter function. This function should take in the row, columnId, and filter value, and return a boolean indicating whether the row should be included in the filtered data.

Fuzzy filtering is mostly used with global filtering, but you can also apply it to individual columns. We will discuss how to implement fuzzy filtering for both cases.

> **Note:** You will need to install the `@tanstack/match-sorter-utils` library to use fuzzy filtering.
> TanStack Match Sorter Utils is a fork of [match-sorter](https://github.com/kentcdodds/match-sorter) by Kent C. Dodds. It was forked in order to work better with TanStack Table's row by row filtering approach.

Using the match-sorter libraries is optional, but the TanStack Match Sorter Utils library provides a great way to both fuzzy filter and sort by the rank information it returns, so that rows can be sorted by their closest matches to the search query.

### Defining a Custom Fuzzy Filter Function

First, define the filter meta shape and the features type that includes it:

```typescript
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, TableFeatures, RowData } from '@tanstack/angular-table'

interface FuzzyFilterMeta { itemRank?: RankingInfo }
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }
```

Then define the fuzzy filter function using those types:

```typescript
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

Register the fuzzy filter and the filter meta slot in `tableFeatures` instead of using `declare module` augmentation:

```typescript
import { metaHelper } from '@tanstack/angular-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
```

The `filterMeta` slot types the per-row filter metadata for this table. The `fuzzy` key in `filterFns` lets you reference the function by the string `'fuzzy'` in column `filterFn` options and `globalFilterFn`.

### Using Fuzzy Filtering with Global Filtering

To use fuzzy filtering with global filtering, register the fuzzy filter function in the `filterFns` slot of `tableFeatures` and reference it in the `globalFilterFn` option of the table:

```typescript
import {
  injectTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  metaHelper,
} from '@tanstack/angular-table'

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

readonly table = injectTable(() => ({
  features,
  columns,
  data,
  globalFilterFn: 'fuzzy',
}))
```

### Using Fuzzy Filtering with Column Filtering

To use fuzzy filtering with column filtering, register your fuzzy filter function in the `filterFns` slot of `tableFeatures` (as shown in the setup snippet above). You can then specify the fuzzy filter by name in the `filterFn` option of the column definition:

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
import { sortFns } from '@tanstack/angular-table'
import type { SortFn } from '@tanstack/angular-table'

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

You can then pass this sorting function directly to the `sortFn` option of the column definition:

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', // using our custom fuzzy filter function (registered above)
  sortFn: fuzzySort, // pass our custom fuzzy sort function directly
}
```

> **Note:** `fuzzySort` can also be referenced by the string `'fuzzy'` if it is registered in the `sortFns` slot of `tableFeatures` (as shown in the setup snippet above). Passing the function directly to `sortFn` skips the need to register it.
