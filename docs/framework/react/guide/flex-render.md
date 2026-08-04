---
title: FlexRender (React) Guide
---

Column definitions can contain plain React nodes or renderer components for `header`, `cell`, `footer`, and `aggregatedCell`. Use TanStack Table's rendering utilities so each value is interpreted correctly and receives its typed table context.

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
import { FlexRender } from '@tanstack/react-table'

const footerContent = <FlexRender footer={header} />
```

For cells, `FlexRender` renders `aggregatedCell` when the cell is aggregated, falls back to `cell` when no aggregated renderer exists, and renders nothing for grouping placeholder cells.

`flexRender` is the lower-level function. Use it when you already have a renderable value and its props:

```tsx
import { flexRender } from '@tanstack/react-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

It distinguishes React components, including class components, `memo`, and `forwardRef`, from already-created React nodes. It does not select `cell` versus `aggregatedCell` or suppress grouping placeholders. The `FlexRender` wrapper handles those table-specific decisions.

## Column Renderer Components

Renderer functions are treated as React components and receive the appropriate context as props:

```tsx
const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: ({ column }) => <button>{column.id}</button>,
    cell: ({ getValue }) => <strong>{getValue()}</strong>,
  }),
])
```

Use `cell.getValue()` or `cell.renderValue()` when you only need the accessor value. Use `FlexRender` when rendering the column definition, because it supports static nodes and component renderers and passes the full context.

Placeholder headers are a layout decision and are not automatically suppressed. Check `header.isPlaceholder` unless the placeholder intentionally supplies content for a spanning header. Footer groups contain `Header` objects too, so pass each footer header through the `footer` prop.
