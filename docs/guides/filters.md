# Column Filters

Let's learn about **column filters**!

Column filters are stored in the `state.filters` array. Each item in the array is an object containing the column id and the filter value.

> NOTE: Filters are applied in the order they are specified, which can have various performance implications depending on how each filter is implemented and the resulting rows from each filter

## Can-Filter Option Priority

The ability for a column to be **column** filtered is determined by the following fallback logic:

```tsx
const canColumnFilter =
  column.enableAllFilters ??
  column.enableColumnFilter ??
  instance.options.enableFilters ??
  instance.options.enableColumnFilters ??
  column.defaultCanColumnFilter ??
  column.defaultCanFilter ??
  !!column.accessorFn
```

The ability for a column to be **globally** filtered is determined by the following fallback logic:

```tsx
const canGlobalFiler =
  ((instance.options.enableFilters ??
    instance.options.enableGlobalFilter ??
    column.enableAllFilters ??
    column.enableGlobalFilter ??
    column.defaultCanFilter ??
    column.defaultCanGlobalFilter ??
    !!column.accessorFn) &&
    instance.options.getColumnCanGlobalFilterFn?.(column)) ??
  true
```

Each option can be set to `true` or `false` to override the default behavior below it.
