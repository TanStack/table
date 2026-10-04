# Expanding

Expansion controls row-tree inclusion; the renderer owns disclosure controls and detail panels.

## Setup

```ts
import {
  createExpandedRowModel,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/table-core'

type Node = { id: string; children?: Node[] }
export const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})
export const options = { getSubRows: (row: Node) => row.children }
```

## Core patterns

```ts
const detailOptions = { getRowCanExpand: () => true }
const isDetailOpen = row.getIsExpanded()
```

For custom detail UI, render an additional row/panel when `isDetailOpen` is true.

## Common mistakes

### [HIGH] Omitting the subrow accessor

Wrong: `const options = { data: nestedRows }`

Correct: `const options = { data: nestedRows, getSubRows: (row: Node) => row.children }`

Nested object structure is not inferred automatically.

Source: `docs/framework/react/guide/expanding.md#table-rows-as-expanded-data`

### [HIGH] Expecting detail markup from state

Wrong: `row.toggleExpanded(true)`

Correct: `if (row.getIsExpanded()) renderDetail(row.original)`

Table is headless and cannot render a custom detail panel.

Source: `docs/framework/react/guide/expanding.md#custom-expanding-ui`

### [HIGH] Misreading pagination placement

Wrong: `const options = { paginateExpandedRows: false }; const leafOnlyPages = true`

Correct: `const options = { paginateExpandedRows: false }; const descendantsStayWithParent = true`

This option controls whether expansion happens before or after pagination; it does not make page size count only leaf rows.

Source: `packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-expanding/` for expansion state, row APIs, and model placement.

## Sources

- `TanStack/table:docs/framework/react/guide/expanding.md`
- `TanStack/table:packages/table-core/src/features/row-expanding`
- `TanStack/table:examples/react/expanding`
