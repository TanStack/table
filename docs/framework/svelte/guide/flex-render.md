---
title: FlexRender (Svelte) Guide
---

Svelte column definitions can contain strings or renderer functions that return primitive values, component configurations, or snippet configurations. The `FlexRender` component resolves those forms reactively with the correct cell or header context.

## `FlexRender` and the Lower-Level Form

Svelte exports the `FlexRender` component, not a separate lowercase `flexRender` function. For normal table markup, import the component and pass exactly one `cell`, `header`, or `footer` object:

```svelte
<script lang="ts">
  import { FlexRender } from '@tanstack/svelte-table'
</script>

{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
  <tr>
    {#each headerGroup.headers as header (header.id)}
      <th>
        {#if !header.isPlaceholder}
          <FlexRender {header} />
        {/if}
      </th>
    {/each}
  </tr>
{/each}

{#each table.getRowModel().rows as row (row.id)}
  <tr>
    {#each row.getVisibleCells() as cell (cell.id)}
      <td><FlexRender {cell} /></td>
    {/each}
  </tr>
{/each}
```

For cells, `FlexRender` selects `aggregatedCell` for aggregated rows, falls back to `cell`, and renders nothing for grouping placeholders. Use `<FlexRender footer={header} />` for a footer-group header object.

App tables created with `createTableHook` also expose `FlexRender` through the table and context-bound app components. The direct import shown above works for both ordinary and app tables.

The older lower-level component form accepts `content` and `context` explicitly:

```svelte
<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
```

Prefer the table-object shorthand because it makes the grouped-cell decisions for you.

## Components and Snippets in Column Definitions

Wrap Svelte components with `renderComponent()` and snippets with `renderSnippet()` before returning them from a column renderer:

```svelte
<script lang="ts">
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import StatusCell from './StatusCell.svelte'
  import { nameSnippet } from './snippets.svelte'

  const columns = columnHelper.columns([
    columnHelper.accessor('status', {
      cell: ({ getValue }) =>
        renderComponent(StatusCell, { status: getValue() }),
    }),
    columnHelper.accessor('name', {
      cell: ({ getValue }) => renderSnippet(nameSnippet, getValue()),
    }),
  ])
</script>
```

A snippet used with `renderSnippet` must accept one parameter. `FlexRender` mounts the resulting component or invokes the snippet with the supplied props or parameter.

Placeholder headers remain the template's layout decision. Check `header.isPlaceholder` unless a spanning-header layout intentionally renders the placeholder.
