# Row identity and display order

Read when implementing persistent row identity, row numbering, or access to original versus accessor-derived data.

## Identity

`row.id` defaults to an index-derived ID. Supply `getRowId: (row) => row.id` using an application ID when state must survive page changes or insertion. Grouping and expansion can append IDs for generated rows. Use `table.getRow(id)` for a loaded row and the final `table.getRowModel().rows` for rendering.

## Number rows in display order

<!-- skill-snippet:check -->

```ts
import { createColumnHelper, tableFeatures } from '@tanstack/table-core'

type Person = { id: string; name: string }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
export const rowNumberColumn = helper.display({
  id: 'rowNumber',
  header: '#',
  cell: ({ row }) => {
    const displayIndex = row.getDisplayIndex()
    return displayIndex === -1 ? '' : displayIndex + 1
  },
})
```

`row.getDisplayIndex()` follows filtering, grouping, sorting, and expansion before pagination. It returns `-1` for a row absent from the current display order. `row.index` remains the creation-time position within its parent array, so it is not a filtered or sorted display index.

Read the public method instead of `_displayIndexCache`. That internal cache may be stale; `getDisplayIndex()` refreshes display order and checks that the cached slot still contains the row.

## Original and accessor values

`row.original` is the unmodified input record. `row.getValue(columnId)` caches the accessor result; `row.renderValue(columnId)` additionally uses `renderFallbackValue` for an undefined value. Call both methods on the row to retain the receiver.

`row.subRows`, `row.parentId`, `row.depth`, and `row.getParentRow()` describe hierarchy. `table.getMaxSubRowDepth()` returns the memoized deepest structural depth of the core model. Read the feature architecture's expanding or grouping reference only when changing those behaviors.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/core/rows/` and `dist/index.d.ts` for the public row declarations.

## Sources

- `TanStack/table:docs/guide/rows.md`
- `TanStack/table:packages/table-core/src/core/rows/coreRowsFeature.utils.ts`
