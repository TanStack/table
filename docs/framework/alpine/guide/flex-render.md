---
title: FlexRender (Alpine) Guide
---

Alpine column definitions commonly contain strings or functions that return HTML strings for `header`, `cell`, `footer`, and `aggregatedCell`. The rendering utilities resolve those definitions with the correct table context.

## `FlexRender` vs `flexRender`

`FlexRender` is the recommended table-aware wrapper. Pass exactly one `cell`, `header`, or `footer` object:

```html
<template x-for="header in headerGroup.headers" :key="header.id">
  <th>
    <span x-show="!header.isPlaceholder" x-html="FlexRender({ header })"></span>
  </th>
</template>

<template x-for="cell in row.getVisibleCells()" :key="cell.id">
  <td x-html="FlexRender({ cell })"></td>
</template>
```

Import `FlexRender` from `@tanstack/alpine-table` and expose it to the Alpine data scope, or use `table.FlexRender` on a table created by the adapter. For footer groups, call `FlexRender({ footer: header })`.

For cells, `FlexRender` selects `aggregatedCell` for aggregated rows, falls back to `cell`, and returns `null` for grouping placeholders.

`flexRender` is the lower-level function for a definition and context:

```ts
import { flexRender } from '@tanstack/alpine-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

It invokes function renderers and passes non-functions through unchanged. It does not select grouped-cell renderers or suppress grouping placeholders.

Because `x-html` inserts HTML, only render markup produced by code you trust. Escape or sanitize untrusted data before including it in a renderer result. Use `x-text` or normal DOM bindings instead when a renderer only needs to display text.

Placeholder headers remain the template's layout decision. Check `header.isPlaceholder` unless a spanning-header layout intentionally renders that placeholder.
