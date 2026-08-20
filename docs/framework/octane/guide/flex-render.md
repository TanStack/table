---
title: FlexRender (Octane) Guide
---

Column definitions can contain Octane nodes or renderer components for `header`, `cell`, `footer`, and `aggregatedCell`. Use TanStack Table's rendering utilities so function components become Octane element descriptors with the correct typed context.

## `FlexRender` vs `flexRender`

`FlexRender` is the recommended TSRX component. Give it exactly one table object: `cell`, `header`, or `footer`.

```tsx
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={header} />
```

The table instance exposes `FlexRender`, and the component can also be imported directly from `@tanstack/octane-table`. Rendering it as a component gives Octane the correct component scope while preserving strings, numbers (including `0`), and pre-created descriptors.

For cells, `FlexRender` selects `aggregatedCell` when appropriate, falls back to `cell`, and suppresses grouping placeholder cells.

`flexRender` is the lower-level function for a renderable value and context:

```tsx
import { flexRender } from '@tanstack/octane-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

Octane function components are converted with `createElement`; non-function nodes pass through unchanged. Unlike React, Octane has no class-component, `forwardRef`, or exotic-component branch. The lower-level function also does not select grouped-cell renderers or suppress grouping placeholders.

Use `FlexRender` in normal TSRX table markup. Check `header.isPlaceholder` before rendering a header unless a spanning layout intentionally uses the placeholder, and pass footer-group `Header` objects through the `footer` prop.
