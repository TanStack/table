<script lang="ts">
  import { FlexRender } from '@tanstack/svelte-table'
  import { features } from './table'
  import type { SvelteTable } from '@tanstack/svelte-table'
  import type { Person } from './fetchData'

  let { table }: { table: SvelteTable<typeof features, Person> } = $props()
</script>

<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th colSpan={header.colSpan}>
            {#if !header.isPlaceholder}
              <div
                class={header.column.getCanSort() ? 'sortable-header' : ''}
                role="button"
                tabindex="0"
                onclick={header.column.getToggleSortingHandler()}
                onkeydown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    header.column.getToggleSortingHandler()?.(event)
                  }
                }}
              >
                <FlexRender {header} />
                {#if header.column.getIsSorted() === 'asc'}
                  {' '}🔼
                {:else if header.column.getIsSorted() === 'desc'}
                  {' '}🔽
                {/if}
              </div>
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each table.getRowModel().rows as row (row.id)}
      <tr>
        {#each row.getAllCells() as cell (cell.id)}
          <td><FlexRender {cell} /></td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
