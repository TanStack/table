# Example: Basic Subscribe

This example demonstrates fine-grained state subscriptions using `table.subscribe()` for optimized rendering in Lit tables.

**Key Features:**

- **Fine-grained subscriptions**: Using `table.subscribe()` to subscribe only to the state each component needs
- **TableController**: Lit ReactiveController for managing table instances and subscriptions
- **External atoms**: State management via `createAtom` from `@tanstack/store` for independent control
- **Performance optimized**: Only UI elements re-render when their subscribed state changes
- **Complete feature set**: Row selection, column filtering, global filtering, sorting, and pagination

**What this shows:**

1. **Table body** - Re-renders only when filtering or pagination state changes
2. **Pagination controls** - Re-render only when pagination state changes (page index/size)
3. **Row selection** - Includes per-row checkboxes and page-level select-all
4. **Selection summary** - Re-renders only when row selection changes
5. **Sortable headers** - Click headers to sort data
6. **Data regeneration** - Buttons to test with 1,000 and 200,000 rows
7. **Table state debug view** - Full table state displayed as JSON for debugging

This pattern is ideal for large tables where you want to minimize unnecessary re-renders by having precise control over which components subscribe to which state slices.

## Running the Example

To run this example:

```bash
npm install
npm run start
```

The example will start a dev server with hot module reloading. The table loads with 1,000 rows by default and can be stress-tested with 200,000 rows.
