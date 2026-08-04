---
title: FlexRender (Solid) Guide
---

Column definitions can contain Solid JSX values or renderer components for `header`, `cell`, `footer`, and `aggregatedCell`. Use TanStack Table's rendering utilities so each value is created in the correct reactive owner and receives its typed context.

## `FlexRender` vs `flexRender`

`FlexRender` is the recommended JSX component. Give it exactly one table object: `cell`, `header`, or `footer`.

```tsx
<For each={table.getHeaderGroups()}>
  {(headerGroup) => (
    <tr>
      <For each={headerGroup.headers}>
        {(header) => (
          <th>
            <Show when={!header.isPlaceholder}>
              <table.FlexRender header={header} />
            </Show>
          </th>
        )}
      </For>
    </tr>
  )}
</For>

<For each={table.getRowModel().rows}>
  {(row) => (
    <tr>
      <For each={row.getVisibleCells()}>
        {(cell) => <td><table.FlexRender cell={cell} /></td>}
      </For>
    </tr>
  )}
</For>
```

The table instance exposes `FlexRender`, or you can import the component directly from `@tanstack/solid-table`. Its keyed control flow recreates content when a persistent view starts representing a different cell or header. This behavior is important for virtualization and other reused views.

For cells, it chooses `aggregatedCell` for aggregated rows, falls back to `cell`, and suppresses grouping placeholders.

`flexRender` is the lower-level function for a renderable value and context:

```tsx
import { flexRender } from '@tanstack/solid-table'

flexRender(cell.column.columnDef.cell, cell.getContext())
```

Function renderers are created with Solid's component machinery. The lower-level function does not choose the correct grouped-cell renderer or key the result to a changing table object, so prefer `FlexRender` for normal table markup.

Placeholder headers remain the caller's layout decision. Check `header.isPlaceholder` unless a spanning-header layout intentionally renders that placeholder. Pass footer-group `Header` objects with `<table.FlexRender footer={header} />`.
