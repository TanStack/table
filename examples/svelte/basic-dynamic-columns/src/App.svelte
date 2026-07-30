<script lang="ts">
  import { FlexRender, createTable } from '@tanstack/svelte-table'
  import ColumnFilter from './ColumnFilter.svelte'
  import './index.css'
  import {
    detectDataType,
    features,
    formatHeader,
    getFilterFn,
    getSortFn,
    renderValue,
    type DynamicRow,
  } from './features'
  import { makeData } from './makeData'
  import type { ColumnDef } from '@tanstack/svelte-table'

  let data = $state<Array<DynamicRow>>(makeData(1_000))
  const refreshData = () => {
    data = makeData(1_000)
  }
  const stressTest = () => {
    data = makeData(1_000_000)
  }

  // Derive the columns from the keys of the data instead of hard-coding them.
  const columns = $derived.by<Array<ColumnDef<typeof features, DynamicRow>>>(
    () => {
      if (data.length === 0) return []
      return Object.keys(data[0]).map(
        (key): ColumnDef<typeof features, DynamicRow> => {
          const dataType = detectDataType(data, key)
          return {
            accessorKey: key,
            header: formatHeader(key),
            meta: { dataType },
            sortFn: getSortFn(dataType),
            filterFn: getFilterFn(dataType),
            cell: (info) => renderValue(info.getValue(), dataType),
          }
        },
      )
    },
  )

  const table = createTable(
    {
      features,
      get data() {
        return data
      },
      get columns() {
        return columns
      },
      debugTable: true,
    },
  )
</script>

<div class="demo-root">
  <p class="demo-note">
    Columns, sort fns, filter fns, and filter components are all derived from the
    data type of each field, not from a hard-coded column definition.
  </p>
  <div class="button-row">
    <button class="demo-button demo-button-sm" onclick={() => refreshData()}>
      Regenerate Data
    </button>
    <button class="demo-button demo-button-sm" onclick={() => stressTest()}>
      Stress Test (1M rows)
    </button>
  </div>
  <div class="spacer-sm"></div>
  <div class="scroll-container">
    <table>
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <div
                    class={header.column.getCanSort() ? 'sortable-header' : ''}
                    onclick={header.column.getToggleSortingHandler()}
                    title={header.column.getCanSort()
                      ? 'Toggle sorting'
                      : undefined}
                  >
                    <FlexRender header={header} />
                    {#if header.column.getIsSorted() === 'asc'}
                      {' 🔼'}
                    {:else if header.column.getIsSorted() === 'desc'}
                      {' 🔽'}
                    {/if}
                  </div>
                  {#if header.column.getCanFilter()}
                    <ColumnFilter column={header.column} />
                  {/if}
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows.slice(0, 15) as row (row.id)}
          <tr>
            {#each row.getAllCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="spacer-sm"></div>
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
</div>
