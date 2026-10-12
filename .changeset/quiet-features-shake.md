---
'@tanstack/table-core': patch
'@tanstack/table-devtools': patch
---

Improve tree-shaking further. The core no longer bundles the column ordering, column pinning, or row expanding code it used for leaf column order, pinned header order, and row display order, so a minimal table is about 0.27 kB (brotli) smaller. Features no longer bundle code from other features a table doesn't register: column sizing, column ordering, and cell selection without column pinning or column visibility, column pinning without column visibility, row pinning without row expanding, the paginated row model without row expanding, and the faceted unique and min/max values without global filtering. Without `globalFilteringFeature`, global facets now include no columns, the same as the filtered row model. Memoized row, column, header, and cell APIs also allocate less: each memo no longer creates an `onAfterUpdate` wrapper it doesn't need. `table.getOrderColumnsFn()`, which column ordering already assigned, is now declared on its table type.

The devtools Features panel sizes are regenerated for these changes.
