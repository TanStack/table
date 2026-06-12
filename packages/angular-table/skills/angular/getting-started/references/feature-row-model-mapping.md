# Feature → Row Model Mapping & Optional Patterns

Reference material extracted from the getting-started SKILL.md.

---

## Feature → row model mapping

Every opt-in v9 feature has two pieces:

1. The **feature** itself in `features` — adds APIs (e.g.
   `column.toggleSorting()`) and the matching state slice.
2. A **row-model factory slot** on the `features` object — produces the derived
   row output. Without it, sort/filter/paginate UI updates but rows don't reorder.

Fn registries (`sortFns`, `filterFns`, `aggregationFns`) are also slots on the
`features` object, not parameters to the factory calls.

| Feature                                                                                                                                              | Slot needed on `features`                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `rowSortingFeature`                                                                                                                                  | `sortedRowModel: createSortedRowModel()` + `sortFns`                                         |
| `columnFilteringFeature` / `globalFilteringFeature`                                                                                                  | `filteredRowModel: createFilteredRowModel()` + `filterFns`                                   |
| `rowPaginationFeature`                                                                                                                               | `paginatedRowModel: createPaginatedRowModel()`                                               |
| `rowExpandingFeature`                                                                                                                                | `expandedRowModel: createExpandedRowModel()`                                                 |
| `columnGroupingFeature`                                                                                                                              | `groupedRowModel: createGroupedRowModel()` + `aggregationFns`                                |
| `columnFacetingFeature`                                                                                                                              | `facetedRowModel: createFacetedRowModel()` (+ `facetedMinMaxValues` / `facetedUniqueValues`) |
| `rowSelectionFeature`                                                                                                                                | (no row model needed)                                                                        |
| `columnVisibilityFeature` / `columnOrderingFeature` / `columnPinningFeature` / `columnSizingFeature` / `columnResizingFeature` / `rowPinningFeature` | (no row model needed)                                                                        |

---

## Lower-severity failure modes (MEDIUM)

### Wrong `createColumnHelper` generic order

```ts
// ❌ v8 shape
const columnHelper = createColumnHelper<Person>()

// ✅ v9 — features first
const columnHelper = createColumnHelper<typeof features, Person>()
```

Or use `createAppColumnHelper<Person>()` from a `createTableHook(...)` factory,
which pre-binds `TFeatures`.

### Importing only `FlexRenderDirective` and missing the shorthand

`FlexRender` is preferred — it imports both `FlexRenderDirective` (the long
`*flexRender`) and `FlexRenderCell` (the shorthand). If you only import one,
`*flexRenderCell` won't compile.
