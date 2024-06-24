---
title: Svelte Table
---

> **IMPORTANT:** This version of `@tanstack/svelte-table` only supports **Svelte 5 or  newer**. For Svelte 3/4 support, use version 8 of `@tanstack/svelte-table`.
> Alternatively, you can still use `@tanstack/table-core` v9 with Svelte 3/4 by copying the source code from the [v8 `@tanstack/svelte-table`](https://github.com/TanStack/table/tree/v8/packages/svelte-table/src) as a custom adapter.

The `@tanstack/svelte-table` adapter is a wrapper around the core table logic. Most of its job is related to managing state the "Svelte" way, providing types and the rendering implementation of cell/header/footer templates.

## Exports

`@tanstack/svelte-table` re-exports all of `@tanstack/table-core`'s APIs and the following:

### `createTable`

Takes an `options` object and returns a table.

```svelte
<script>
  import { createTable } from '@tanstack/svelte-table'

  const table = createTable({
      /* ...table options... */
  })
</script>

<!-- ...render your table in markup -->
```

### FlexRender

A Svelte component for rendering cell/header/footer templates with dynamic values.

FlexRender supports any type of renderable content supported by Svelte:
- Scalar data types such as numbers, strings, etc.
- Svelte components (when wrapped with `renderComponent`)

Example:

```svelte
<script lang="ts">
  import { 
    type ColumnDef,
    FlexRender,
    createTable,
    getCoreRowModel,
    renderComponent
  } from '@tanstack/svelte-table'
  import { StatusTag } from '$lib/components/status-tag.svelte'
  import type { Person } from './types'
  import { peopleData, type Person } from './people'

  const columns: ColumnDef<Person>[] = [
    {
      /* Renders a string */
      accessorKey: 'name',
      cell: info => info.getValue(),
    },
    {
      /* Renders a Svelte component */
      accessorKey: 'status',
      cell: (info) => renderComponent(StatusTag, { value: info.getValue() })
    }
  ]

  const table = createTable({
    data: peopleData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
</script>

<table>
  <tbody>
    {#each table.getRowModel().rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <FlexRender
              content={cell.column.columnDef.cell}
              context={cell.getContext()}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
```
