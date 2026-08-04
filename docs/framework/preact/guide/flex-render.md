---
title: FlexRender (Preact) Guide
---

Column definitions can contain plain Preact children or renderer components for `header`, `cell`, `footer`, and `aggregatedCell`. Use TanStack Table's rendering utilities so each value is interpreted correctly and receives its typed table context.

## `FlexRender` vs `flexRender`

`FlexRender` is the recommended component wrapper. Give it exactly one table object: `cell`, `header`, or `footer`. It then selects the correct column definition and context:

```tsx
{
  table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th key={header.id}>
          {header.isPlaceholder ? null : <table.FlexRender header={header} />}
        </th>
      ))}
    </tr>
  ))
}

{
  table.getRowModel().rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))
}
```

The adapter attaches `FlexRender` to the table instance, and you can also import it directly:

```tsx
import { FlexRender } from '@tanstack/preact-table'

const footerContent = <FlexRender footer={header} />
```

For cells, `FlexRender` renders `aggregatedCell` when the cell is aggregated, falls back to `cell` when needed, and renders nothing for grouping placeholder cells.

`flexRender` is the lower-level function for a renderable value and its props:

```tsx
import { flexRender } from '@tanstack/preact-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

It distinguishes Preact components and supported memo/forward-ref component objects from already-created children. It does not select grouped-cell renderers or suppress grouping placeholders; `FlexRender` handles those table-specific decisions.

Use `cell.getValue()` or `cell.renderValue()` when you only need the accessor value. Use `FlexRender` to render column definitions and pass their complete contexts.

Placeholder headers are a layout decision and are not automatically suppressed. Check `header.isPlaceholder` unless the placeholder intentionally supplies content for a spanning header. Pass footer-group `Header` objects through the `footer` prop.
