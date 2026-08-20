---
title: FlexRender (Vanilla) Guide
---

The Vanilla adapter does not own a rendering engine. Its rendering helpers resolve plain column-definition values and functions, while your application decides how to turn the returned value into DOM nodes or HTML.

Import the helpers from the dedicated core entry point:

```ts
import { FlexRender, flexRender } from '@tanstack/table-core/flex-render'
```

## `FlexRender` vs `flexRender`

`FlexRender` is the table-aware wrapper. Pass exactly one `cell`, `header`, or `footer` object:

```ts
const headerContent = header.isPlaceholder ? null : FlexRender({ header })
const cellContent = FlexRender({ cell })
const footerContent = FlexRender({ footer: header })
```

For cells, it selects `aggregatedCell` for aggregated rows, falls back to `cell`, and returns `null` for grouping placeholders.

`flexRender` is the lower-level function for a renderable definition and its context:

```ts
const content = flexRender(cell.column.columnDef.cell, cell.getContext())
```

It invokes a function definition with the supplied props and passes any other value through unchanged. It does not select grouped-cell definitions or suppress placeholders.

Neither helper inserts content into the document. Handle the returned value according to your rendering system. For example, assign trusted text to `textContent`, append a returned node, or pass a framework-specific value to another renderer. Do not assign untrusted strings to `innerHTML` without sanitizing them.

Placeholder headers and footers remain the caller's layout decision. Skip `header.isPlaceholder` in ordinary layouts unless a spanning-header layout intentionally needs that content.
