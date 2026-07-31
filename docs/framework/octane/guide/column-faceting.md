---
title: Faceting (Octane) Guide
---

## Examples

Want to skip to the implementation? Check out these Octane examples:

- [Faceted Filters](../examples/filters-faceted)
- [Bucketed Faceted Filters](../examples/filters-faceted-bucketed)

### Faceting Setup

Here's how you set up your table to use faceting features. Adding the faceting feature enables the related APIs. Additionally, if using client-side faceting, you also need to set up `filteredRowModel` and `facetedRowModel` after their associated features because row model slots are type-checked.

```tsx
import {
  useTable,
  tableFeatures,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFacetedMinMaxValues,
  createFilteredRowModel,
  filterFns,
} from '@tanstack/octane-table'

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(), // if using client-side filtering
  facetedRowModel: createFacetedRowModel(), // if using client-side faceting
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns,
})

const table = useTable({
  features,
  columns,
  data,
})
```

## Faceting (Octane) Guide

### What is Faceting?

Faceting derives information that can be used to build filtering interfaces. For a given column, faceting can answer questions such as:

- Which values are available?
- How often does each value occur?
- What is the minimum and maximum value among the available rows?
- Which rows should be used for a custom facet calculation?

For example, an application could use faceting to render a plan filter like this:

```text
Plan
☐ Free        128
☐ Pro          47
☐ Enterprise    9
```

The plan names and counts are derived from the table's faceted row model. If a filter on another column changes, such as `Region = Europe`, the plan counts update to describe only the rows in that region.

Faceting does not apply filters to the table. It provides values, counts, ranges, or rows that you can use to build a filter UI. The column filtering feature owns the filter state and determines which rows match the selected filter values.

#### Faceting vs Row Aggregation

Faceting and row aggregation both summarize data, but they serve different purposes. Faceting produces metadata for filter controls, such as available values, occurrence counts, or a numeric range. Row aggregation computes result values over a set of rows, such as a sum, average, or total, for display in footers or grouped rows.

Faceted counts do not create aggregate rows or use a column's `aggregationFn`. A useful way to distinguish the features is:

- Filtering answers: Which rows remain?
- Faceting answers: Which filtering choices remain?
- Row aggregation answers: What summary value can be calculated from these rows?

### How Column Faceting Responds to Filters

A column's faceted row model includes rows that pass every applicable filter except that column's own filter. This lets a facet continue to show alternative choices while the user edits it.

Consider a table with `Region` and `Plan` filters:

1. The user selects `Region = Europe`.
2. The `Plan` facet applies the region filter and recalculates its plan counts.
3. The user selects `Plan = Pro`.
4. The table displays only European Pro rows.
5. The `Plan` facet still calculates its choices from all European rows because it excludes its own `Plan` filter.

Other facets do apply the selected plan filter. For example, a `Status` facet would now describe only European Pro rows. This is what allows multiple facets to narrow each other.

Client-side faceting needs both `filteredRowModel` and `facetedRowModel` to provide this behavior. Without a filtered row model, the faceted row model falls back to the pre-filtered rows, so its values will not react to other column filters.

### Faceting APIs

Use the faceting API that matches the filter interface you are building:

| API                               | Result                                  | Common uses                                            |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| `column.getFacetedRowModel()`     | Rows that pass the other active filters | Custom facet calculations                              |
| `column.getFacetedUniqueValues()` | A `Map` of values to occurrence counts  | Checkboxes, select menus, and autocomplete suggestions |
| `column.getFacetedMinMaxValues()` | A `[min, max]` tuple or `undefined`     | Number inputs and range sliders                        |

The row model factories registered in `tableFeatures` enable these APIs:

- `createFacetedRowModel()` is required for client-side faceting.
- `createFacetedUniqueValues()` is required for unique values and counts.
- `createFacetedMinMaxValues()` is required for numeric minimum and maximum values.

Register only the factories your table uses. The complete setup near the top of this guide registers all three.

### Unique Values and Counts

`column.getFacetedUniqueValues()` returns a `Map` whose keys are facet values and whose values are occurrence counts. You can turn that map into a sorted list for an autocomplete or select control:

```ts
const suggestions = Array.from(column.getFacetedUniqueValues().entries())
  .sort(([valueA], [valueB]) => String(valueA).localeCompare(String(valueB)))
  .slice(0, 5_000)
```

Each entry contains both the value and its count:

```tsx
return (
  <select>
    {suggestions.map(([value, count]) => (
      <option key={String(value)} value={String(value)}>
        {String(value)} ({count})
      </option>
    ))}
  </select>
)
```

For a scalar column, each row normally contributes one value, so the occurrence count is also a row count. A row can contribute more than one facet value by defining the column's `getUniqueValues` option. In that case, the counts describe occurrences and their total can be greater than the number of rows.

```tsx
columnHelper.accessor('tags', {
  header: 'Tags',
  getUniqueValues: (row) => row.tags,
})
```

If you want each count to represent rows, make sure `getUniqueValues` returns each value no more than once per row.

### Reactive Facet Controls in Octane

Facet values are often read inside a filter component that receives a stable `column` object. Subscribe that component to the filter state so it updates when another facet changes. `table.Subscribe` keeps the subscription local to the component that renders the facet controls.

```tsx
function FacetOptions({ table, column }) @{
  <table.Subscribe selector={(state) => state.columnFilters}>
    {() => (
      <FacetOptionList
        column={column}
        isSelected={isSelected}
        toggleValue={toggleValue}
      />
    )}
  </table.Subscribe>
}

function FacetOptionList({ column, isSelected, toggleValue }) @{
  const values = Array.from(column.getFacetedUniqueValues().entries())

  @for (const [value, count] of values; key String(value)) {
    <label>
      <input
        type="checkbox"
        checked={isSelected(value)}
        onChange={() => toggleValue(value)}
      />
      {String(value)} ({count})
    </label>
  }
}
```

The filter function for the column still determines how the selected values match rows. See the [Column Filtering Guide](./column-filtering) for filter functions and filter state, or the [Faceted Filters example](../examples/filters-faceted) for a complete implementation.

### Minimum and Maximum Values

`column.getFacetedMinMaxValues()` returns the numeric range available after applying the other active filters. It returns `undefined` when there are no numeric values.

```tsx
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1]

return (
  <input
    type="range"
    min={min}
    max={max}
    value={currentValue}
    onChange={(event) =>
      column.setFilterValue(Number(event.currentTarget.value))
    }
  />
)
```

The minimum and maximum describe the values that are available to the filter UI. Your column's filter function determines how a selected value or range filters rows.

### Bucketed Faceting for Continuous Values

Raw unique values are not always useful. Dates, file sizes, durations, prices, and measurements can produce hundreds or thousands of distinct values. These columns are often easier to filter when their values are placed into meaningful buckets:

```text
Last login
☐ Today
☐ Yesterday
☐ This week
☐ This month
☐ Older
```

You can use the column's `getUniqueValues` option to return a bucket key for faceting while keeping the original accessor value for rendering and other table features.

```tsx
type StorageBucket =
  | 'under-1-gb'
  | '1-to-10-gb'
  | '10-to-100-gb'
  | '100-gb-plus'

const GB = 1024 ** 3

function getStorageBucket(value: number): StorageBucket {
  if (value < GB) return 'under-1-gb'
  if (value < 10 * GB) return '1-to-10-gb'
  if (value < 100 * GB) return '10-to-100-gb'
  return '100-gb-plus'
}

const storageBucketFilter = constructFilterFn({
  resolveDataValue: (value) => getStorageBucket(value as number),
  filter: (bucket, selected: Array<StorageBucket>) => selected.includes(bucket),
  autoRemove: (selected: Array<StorageBucket>) => selected.length === 0,
})

columnHelper.accessor('storageBytes', {
  header: 'Storage',
  getUniqueValues: (row) => [getStorageBucket(row.storageBytes)],
  filterFn: storageBucketFilter,
})
```

Faceting and filtering should use the same bucket definitions so the displayed counts match the rows selected by each bucket. The column keeps its raw numeric value, so there is no need to create a hidden derived column only for faceting. See the [Bucketed Faceted Filters example](../examples/filters-faceted-bucketed) for complete date and storage bucket filters.

### Client-Side Faceting and Performance

The built-in client-side faceting row models are memoized. They recalculate when their input rows or relevant filter state changes. The cost still depends on the number of rows, columns, and unique values in the table.

For columns with many unique values, consider these options:

- Render only the first or most relevant values instead of every map entry.
- Let users search the available values before rendering a long list.
- Bucket continuous or high-cardinality values into useful ranges.
- Move faceting to the server when the complete dataset is not available in the browser.

Avoid sorting or converting a large facet map repeatedly in unrelated components. Derive and render facet options close to the component that subscribes to the relevant filter state.

### Custom Server-Side Faceting

When filtering is performed on the server, the rows loaded into the browser may not contain enough information to calculate complete facet values or counts. In that case, calculate the facets on the server and provide custom `facetedUniqueValues` and `facetedMinMaxValues` factories.

Each factory receives the table and a column ID, then returns a function that resolves the faceted result. The regular column APIs will return the server-provided values.

```ts
const facetingData = await fetchFacets(activeFilters)

const features = tableFeatures({
  columnFacetingFeature,
  facetedUniqueValues: (_table, columnId) => () => {
    const uniqueValueMap = new Map<string, number>()
    // Populate the map from facetingData for columnId.
    return uniqueValueMap
  },
  facetedMinMaxValues: (_table, columnId) => () => {
    // Read the range from facetingData for columnId.
    return [min, max]
  },
})

const table = useTable({
  features,
  columns,
  data,
})
```

To match the built-in column faceting behavior, a server query for one column should apply the other active filters but exclude that column's own filter. This keeps alternative choices available in the current facet while allowing facets to narrow each other.

You can also fetch facet values and pass them directly to your filter components without using the TanStack Table faceting APIs.

### Global Faceting

Global faceting derives values across every leaf column that can participate in global filtering. It is useful for autocomplete suggestions or other metadata associated with a global filter. The global faceted row model applies active column filters and excludes the global filter itself.

If the table uses global filtering, register `globalFilteringFeature` so the row filtering pipeline evaluates the global filter. The same faceting factories used by column faceting also power these table APIs:

```ts
const globalFacetedRows = table.getGlobalFacetedRowModel().flatRows

const suggestions = Array.from(table.getGlobalFacetedUniqueValues().entries())

const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1]
```

Custom faceting factories receive the internal `__global__` column ID for global requests. You can branch on that ID when the server returns separate column and global facet results:

```ts
const features = tableFeatures({
  columnFacetingFeature,
  facetedUniqueValues: (_table, columnId) => () => {
    if (columnId === '__global__') {
      return new Map(globalFacets.uniqueValues)
    }

    return new Map(columnFacets[columnId]?.uniqueValues)
  },
})
```
