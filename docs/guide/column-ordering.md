---
title: Column Ordering
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-ordering](../framework/react/examples/column-ordering)

## API

[Column Ordering API](../api/features/column-ordering)

## Column Ordering Guide

There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](../guide/column-pinning) - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual **Column Ordering** - A manually specified column order is applied.
3. [Grouping](../guide/grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.columnGroupingMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.
