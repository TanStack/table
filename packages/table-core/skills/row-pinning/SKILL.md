---
name: row-pinning
description: >
  Pin stable row IDs into top, center, and bottom collections with rowPinningFeature and keepPinnedRows. Load for filtering/pagination visibility, explicit region rendering, or renderer-owned sticky CSS.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.53',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/row-pinning.md'
  - 'TanStack/table:packages/table-core/src/features/row-pinning'
  - 'TanStack/table:examples/react/row-pinning'
---

This skill builds on `core` and `table-features`. Pinning creates row regions; the renderer controls order and sticky layout.

## Setup

```ts
import { rowPinningFeature, tableFeatures } from '@tanstack/table-core'

type Person = { id: string; name: string }
export const features = tableFeatures({ rowPinningFeature })
export const options = {
  getRowId: (row: Person) => row.id,
  keepPinnedRows: true,
}
```

## Core Patterns

```ts
const regions = [
  table.getTopRows(),
  table.getCenterRows(),
  table.getBottomRows(),
]
for (const rows of regions) rows.forEach(renderRow)
```

Render each region explicitly if the visual order matters.

## Common Mistakes

### [HIGH] Persisting index-based IDs

Wrong: `const options = { getRowId: (_row: Person, index: number) => String(index) }`

Correct: `const options = { getRowId: (row: Person) => row.id }`

Indexes change under sorting, filtering, pagination, and insertion.

Source: `docs/framework/react/guide/row-pinning.md`

### [HIGH] Expecting sticky rows automatically

Wrong: `row.pin('top')`

Correct: `topRowElement.style.position = 'sticky'`

Pinning state does not style or place DOM elements.

Source: `examples/react/row-pinning/src/main.tsx`

## Choose the pinned-row visibility policy

- `keepPinnedRows: true` is the default. Pinned rows stay visible in their
  pinned region even when filtering or pagination removes them from the center
  row model.
- `keepPinnedRows: false` limits pinned rows to those present in the current
  filtered and paginated row model.

Choose explicitly based on product behavior; neither value is inherently wrong.

Source: `packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-pinning/` for region getters, row APIs, and `keepPinnedRows` semantics.
