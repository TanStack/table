---
name: Column Pinning
id: column-pinning
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-pinning](../examples/react/column-pinning)

## API

[Columm Pinning API](../api/column-pinning.md)

## Guide

There are 3 table features that can reorder columns, which happen in the following order:

1. **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual [**Column Ordering**](../column-ordering) - A manually specified column order is applied.
3. [**Grouping**](../grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.columnGroupingMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

TODO
