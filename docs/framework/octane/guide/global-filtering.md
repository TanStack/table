---
title: Global Filtering (Octane) Guide
---

## Examples

Want to skip to the implementation? Check out these Octane examples:

- [Column Filters](../examples/filters)
- [Fuzzy Search](../examples/filters-fuzzy)

### Global Filtering Setup

Here's how you set up your table to use global filtering features. Global filtering depends on column filtering, so add `columnFilteringFeature` before `globalFilteringFeature`. Adding the global filtering feature enables the related APIs. Additionally, if using client-side filtering, you also need to set up `filteredRowModel` after its associated feature because row model slots are type-checked.

```tsx
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
} from '@tanstack/octane-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(), // if using client-side filtering
  // manualFiltering: true, // if using manual server-side filtering
  filterFns: { includesString: filterFn_includesString },
})

const table = useTable({
  features,
  columns,
  data,
})
```

> **Note:** The `filterFns` registry above lists only the built-in filter function this table uses. Spreading the entire built-in `filterFns` registry (`filterFns: { ...filterFns }`) still works, but it puts every built-in filter function in your bundle. Register just the functions you use, or pass a function directly to the `globalFilterFn` option with no registration at all.

## Global Filtering (Octane) Guide

Filtering comes in 2 flavors: Column Filtering and Global Filtering.

This guide will focus on global filtering, which is a filter that is applied across all columns.

### Client-Side vs Server-Side Filtering

Filtering should operate over the same dataset as sorting and pagination. Use client-side filtering when the browser has the complete dataset; use server-side filtering when it has only a page or another subset, unless filtering just the loaded rows is intentional.

See the [Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side) for the full decision framework, performance factors, and guidance for combining data operations.

The client-side filtered row model also invokes the page-index auto-reset hook when global filtering inputs change. Whether the page index resets depends on the `autoResetPageIndex`, `autoResetAll`, and `manualPagination` options. If filtering is manual and this row model is omitted or bypassed, a global filter state change does not invoke that hook, so reset server-side pagination in the filter change handler when needed.

### Manual Server-Side Global Filtering

If you have decided that you need to implement server-side global filtering instead of using the built-in client-side global filtering, here's how you do that.

No `filteredRowModel` is needed for manual server-side global filtering. Instead, the `data` that you pass to the table should already be filtered. However, if you have added a `filteredRowModel` to `tableFeatures`, you can tell the table to skip it by setting the `manualFiltering` option to `true`.

```tsx
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
} from '@tanstack/octane-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
}) // no filteredRowModel for manual server-side global filtering

const table = useTable({
  features,
  data,
  columns,
  manualFiltering: true,
})
```

Note: When using manual global filtering, many of the options that are discussed in the rest of this guide will have no effect. When manualFiltering is set to true, the table instance will not apply any global filtering logic to the rows that are passed to it. Instead, it will assume that the rows are already filtered and will use the data that you pass to it as-is.

### Client-Side Global Filtering

If you are using the built-in client-side global filtering, add the `globalFilteringFeature` (along with its required `columnFilteringFeature` prerequisite), the `filteredRowModel` factory, and `filterFns` to your `tableFeatures` call:

```tsx
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
} from '@tanstack/octane-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})

const table = useTable({
  features,
  // other options...
})
```

### Global Filter Function

The `globalFilterFn` option allows you to specify the filter function that will be used for global filtering. The filter function can be a string that references a filter function (built-in or custom) registered in the `filterFns` slot on `tableFeatures`, or a filter function passed directly.

```tsx
const table = useTable({
  features,
  data,
  columns,
  globalFilterFn: 'includesString', // built-in filter function
})
```

By default there are 12 built-in filter functions to choose from:

- `includesString` - Case-insensitive string inclusion
- `includesStringSensitive` - Case-sensitive string inclusion
- `equalsString` - Case-insensitive string equality
- `equals` - Strict equality `===`
- `weakEquals` - Weak equality `==`
- `arrIncludes` - The row's array (or string) value includes at least one of the filter values
- `arrIncludesAll` - The row's array value includes every filter value
- `arrIncludesSome` - The row's array value includes at least one of the filter values
- `arrHas` - The row's scalar value equals at least one of the filter values
- `inNumberRange` - Inclusive `[min, max]` number range (endpoints normalized and swapped if reversed)
- `between` - Exclusive min/max range (blank endpoints are open-ended)
- `betweenInclusive` - Inclusive min/max range (blank endpoints are open-ended)

You can also define your own custom global filter function and pass it directly to the `globalFilterFn` table option, as shown [below](#custom-global-filter-function).

### Global Filter State

The `globalFilter` state slice holds the current global filter value, usually a search string (the slice is typed as `any` so custom global filter functions can accept other value shapes). For reactive reads that should re-render your UI, use `table.state.globalFilter`. In event handlers, you can read the current snapshot with `table.atoms.globalFilter.get()`, but this read does not subscribe the component to future changes.

If you need access to the global filter state outside of the table, you can own the slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the filter value can be used elsewhere (such as in a query key for server-side filtering) without forcing the component that owns the table to re-render.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/octane-store'

const globalFilterAtom = useCreateAtom<string>('')

// subscribe to the atom wherever you need the value (e.g. for a query key)
const globalFilter = useSelector(globalFilterAtom)

const table = useTable({
  features,
  // other options...
  atoms: {
    globalFilter: globalFilterAtom, // table.setGlobalFilter now updates globalFilterAtom
  },
})
```

Alternatively, the v8-style `state.globalFilter` plus `onGlobalFilterChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [globalFilter, setGlobalFilter] = useState<string>('')

const table = useTable({
  features,
  // other options...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter,
})
```

### Adding global filter input to UI

TanStack table will not add a global filter input UI to your table. You should manually add it to your UI to allow users to filter the table. For example, you can add an input UI above the table to allow users to enter a search term. Read the value reactively with `table.state.globalFilter` and update it with `table.setGlobalFilter`.

```tsx
return (
  <div>
    <input
      value={table.state.globalFilter ?? ''}
      onInput={(e) =>
        table.setGlobalFilter(String((e.target as HTMLInputElement).value))
      }
      placeholder="Search..."
    />
  </div>
)
```

> **Note:** Use `onInput` for text inputs in Octane. `onChange` is the native change event and only fires on blur or Enter, not on every keystroke.

### Custom Global Filter Function

If you want to use a custom global filter function, you can define the function and pass it to the `globalFilterFn` option.

> **Note:** It is often a popular idea to use fuzzy filtering functions for global filtering. This is discussed in the [Fuzzy Filtering Guide](./fuzzy-filtering).

```tsx
const customFilterFn = (row, columnId, filterValue) => {
  return // true if the row should be included in the filtered rows
}

const table = useTable({
  features,
  // other options...
  globalFilterFn: customFilterFn,
})
```

### Initial Global Filter State

If you want to set an initial global filter state when the table is initialized, you can pass the global filter state as part of the table `initialState` option. However, if you are controlling the slice yourself, set the starting value on your external atom or Octane state instead.

```tsx
const table = useTable({
  features,
  // other options...
  initialState: {
    globalFilter: 'search term', // if not controlling globalFilter state, set initial state here
  },
})
```

> NOTE: Do not use both `initialState.globalFilter` and a controlled `globalFilter` (via `atoms` or `state`) at the same time, as the controlled value will override `initialState.globalFilter`.

### Disable Global Filtering

By default, global filtering is enabled for all columns. You can disable the global filtering for all columns by using the enableGlobalFilter table option. You can also turn off both column and global filtering by setting the enableFilters table option to false.

Disabling global filtering will cause the column.getCanGlobalFilter API to return false for that column.

```tsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableGlobalFilter: false, // disable global filtering for this column
  },
  //...
]
//...
const table = useTable({
  features,
  // other options...
  columns,
  enableGlobalFilter: false, // disable global filtering for all columns
})
```

### Global Filter APIs

There are several APIs that are useful for hooking up your global filter UI:

- `table.setGlobalFilter` - Set the global filter value. Useful for connecting a search input's `onInput` handler.
- `table.resetGlobalFilter` - Reset the global filter value to its initial state, or clear it with `table.resetGlobalFilter(true)`.
- `table.getGlobalFilterFn` - Returns the filter function currently used for global filtering.
- `table.getGlobalAutoFilterFn` - Returns the default global filter function (currently `includesString`).
- `column.getCanGlobalFilter` - Returns whether a column participates in global filtering. Useful for debugging which columns are searched.
