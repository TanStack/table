---
title: Filters
---

## Examples

Want to skip to the implementation? Check out these examples:

- [filters](../examples/react/filters) (includes faceting)
- [editable-data](../examples/react/editable-data)
- [expanding](../examples/react/expanding)
- [grouping](../examples/react/grouping)
- [pagination](../examples/react/pagination)
- [row-selection](../examples/react/row-selection)

## API

[Filters API](../api/features/filters)

## Guide

Filters come in two flavors:

- Column filters
  - A filter that is applied to a single column's accessor value.
  - Stored in the `state.columnFilters` array as an object containing the columnId and the filter value.
- Global filters
  - A single filter value that is applied to all or some of columns' accessor values.
  - Stored in the `state.globalFilter` array as any value, usually a string.

TODO
