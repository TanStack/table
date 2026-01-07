# Large Table Example

This example demonstrates the `createTableHook` composition pattern for TanStack Table v9, similar to TanStack Form's `createFormHook`.

## What This Demonstrates

### Single Source of Truth (`createTableHook`)

The `hooks/table.ts` file sets up everything in one place:

- **Features** - `_features` defines which table features are enabled
- **Row Models** - Pre-configured sorted, filtered, and paginated row models
- **Default Options** - Any table options can be set as defaults (except columns/data/store/state/initialState)
- **Contexts** - Created internally, with `TFeatures` already baked in
- **Context Hooks** - `useTableContext`, `useCellContext`, `useHeaderContext` - all typed!
- **Pre-bound Components** - Table, cell, and header components
- **Column Helper** - `createAppColumnHelper` pre-bound to your features

### No Generics Needed in Components

Because `TFeatures` is baked into the context hooks at creation time, your custom components don't need type annotations:

```tsx
// components/table-components.tsx
function PaginationControls() {
  const table = useTableContext() // TFeatures already known!
  return <table.Subscribe selector={(s) => s.pagination}>...</table.Subscribe>
}
```

### Simplified Column Helper

Since `TFeatures` is configured once in `createTableHook`, the `createAppColumnHelper` only needs `TData`:

```tsx
// TFeatures already bound - only need TData!
const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
])
```

### Simplified useAppTable

Since `_features`, `_rowModels`, and default options are configured once in `createTableHook`, `useAppTable` only needs `columns` and `data`:

```tsx
const table = useAppTable({
  columns,
  data, // TData inferred from this
})
```

### Pre-bound Components

**Table Components** (accessible via `table.ComponentName`):

- `PaginationControls` - Full pagination UI
- `RowCount` - Row count display
- `TableToolbar` - Header with title and actions

**Cell Components** (accessible via `cell.ComponentName` in `AppCell`):

- `TextCell` - Generic text renderer
- `NumberCell` - Formatted number renderer
- `StatusCell` - Status badge
- `ProgressCell` - Progress bar
- `RowActionsCell` - Row action buttons (view, edit, delete)

**Header Components** (accessible via `header.ComponentName` in `AppHeader`):

- `SortIndicator` - Sort direction icon
- `ColumnFilter` - Filter input

**Footer Components** (accessible via `footer.ComponentName` in `AppFooter`):

- `FooterColumnId` - Display the column ID
- `FooterSum` - Sum aggregation for numeric columns

### App Wrapper Components

The `useAppTable` hook returns these wrapper components:

- `AppTable` - Root wrapper providing table context
- `AppCell` - Cell wrapper with pre-bound cellComponents
- `AppHeader` - Header wrapper with pre-bound headerComponents
- `AppFooter` - Footer wrapper with pre-bound headerComponents

### Subscribe Integration

All App wrapper components support an optional `selector` prop for optimized re-renders:

```tsx
// Without selector - children is a function receiving the entity
<table.AppCell cell={c}>
  {(cell) => <td><cell.TextCell /></td>}
</table.AppCell>

// With selector - children receives both entity and selected state
<table.AppCell cell={c} selector={(state) => state.columnFilters}>
  {(cell, filters) => <td>{filters.length} filters</td>}
</table.AppCell>

// AppTable with selector
<table.AppTable selector={(state) => state.pagination}>
  {(pagination) => <div>Page {pagination.pageIndex + 1}</div>}
</table.AppTable>
```

This wraps the children in a `Subscribe` component for fine-grained reactivity.

## File Structure

```
src/
├── hooks/
│   └── table.ts             # createTableHook setup with features, row models, and components
├── components/
│   ├── cell-components.tsx  # TextCell, NumberCell, StatusCell, ProgressCell, RowActionsCell
│   ├── header-components.tsx # SortIndicator, ColumnFilter
│   └── table-components.tsx # PaginationControls, RowCount, TableToolbar
├── main.tsx                 # App entry point with table component
├── makeData.ts              # Mock data generator
└── index.css                # Styles
```

## Running the Example

```bash
cd examples/react/large-table
pnpm install
pnpm dev
```
