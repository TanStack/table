<script lang="ts">
  import { createTableState } from '@tanstack/svelte-table'
  import { debounce } from '@tanstack/pacer'
  import Search from '@lucide/svelte/icons/search'
  import type { Column, Updater } from '@tanstack/svelte-table'
  import type { ExtendedColumnFilter } from '@/types'
  import type { Person } from '@/lib/make-data'
  import type { features } from '@/hooks/features'
  import { Button } from '@/lib/components/ui/button'
  import { Input } from '@/lib/components/ui/input'
  import * as Table from '@/lib/components/ui/table'
  import { makeData } from '@/lib/make-data'
  import { cn } from '@/lib/utils'
  import { createAppTable } from '@/hooks/table.svelte'
  import { columns } from '@/columns'
  import ModeToggle from '@/components/ModeToggle.svelte'

  function getCommonPinningStyles(
    column: Column<typeof features, Person>,
    isSelected = false,
  ): string {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'start' && column.getIsLastColumn('start')
    const isFirstRightPinnedColumn =
      isPinned === 'end' && column.getIsFirstColumn('end')

    const styles: Array<string> = []
    if (isLastLeftPinnedColumn) {
      styles.push('box-shadow: -4px 0 4px -4px var(--border) inset')
    } else if (isFirstRightPinnedColumn) {
      styles.push('box-shadow: 4px 0 4px -4px var(--border) inset')
    }
    if (isPinned === 'start') {
      styles.push(`inset-inline-start: ${column.getStart('start')}px`)
    }
    if (isPinned === 'end') {
      styles.push(`inset-inline-end: ${column.getAfter('end')}px`)
    }
    styles.push(`position: ${isPinned ? 'sticky' : 'relative'}`)
    if (isSelected) {
      styles.push('background: var(--muted)')
    } else if (isPinned) {
      styles.push('background: var(--background)')
    }
    styles.push(`z-index: ${isPinned ? 1 : 0}`)
    return styles.join('; ')
  }

  // Both controlled state slices live outside the table via createTableState.
  const [columnFilters, setColumnFilters] = createTableState<
    Array<ExtendedColumnFilter>
  >([])
  const [globalFilter, setGlobalFilter] = createTableState('')
  let data = $state(makeData(1_000))

  const refreshData = () => (data = makeData(1_000))
  const stressTest = () => (data = makeData(1_000_000))

  const table = createAppTable({
    key: 'kitchen-sink-shadcn',
    columns,
    get data() {
      return data
    },
    debugTable: true,
    state: {
      get columnFilters() {
        return columnFilters()
      },
      get globalFilter() {
        return globalFilter()
      },
    },
    onColumnFiltersChange: setColumnFilters as (
      updater: Updater<Array<ExtendedColumnFilter>>,
    ) => void,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      columnPinning: { start: ['select'], end: ['actions'] },
      columnOrder: columns.map((c) => c.id ?? ''),
    },
  })

  // The react example also wires @tanstack/react-table-devtools here; no
  // svelte table devtools package is published yet, so it is skipped.

  // Debounced global filter setter — mirrors the react example's DebouncedInput.
  const setGlobalFilterDebounced = debounce(
    (value: string) => setGlobalFilter(value),
    { wait: 300 },
  )
</script>

<table.AppTable>
  <div class="container mx-auto p-4 flex flex-col gap-4">
    <div class="flex items-center justify-end gap-2">
      <ModeToggle />
      <Button variant="outline" size="sm" onclick={() => refreshData()}>
        Regenerate Data
      </Button>
      <Button variant="outline" size="sm" onclick={() => stressTest()}>
        Stress Test (1M rows)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() =>
          console.info(
            'table.getSelectedRowModel().flatRows',
            table.getSelectedRowModel().flatRows,
          )}
      >
        Log Selected Rows
      </Button>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div class="relative w-full max-w-sm">
          <Search
            class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={globalFilter()}
            placeholder="Search all columns..."
            class="pl-8"
            oninput={(e) => setGlobalFilterDebounced(e.currentTarget.value)}
          />
        </div>
        <table.FilterList />
        <table.SortList />
        <table.ViewOptions />
      </div>
      <div class="rounded-md border">
        <Table.Root>
          <Table.Header>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
              <Table.Row>
                {#each headerGroup.headers.filter((header) => header.column.getIsVisible()) as header (header.id)}
                  <table.AppHeader {header}>
                    {#snippet children(h)}
                      <Table.Head
                        colspan={h.colSpan}
                        class={cn('relative', {
                          'border-r': h.id !== 'actions',
                          'text-center [&>[role=checkbox]]:mx-auto':
                            h.column.id === 'select',
                        })}
                        style={`flex-grow: ${h.getSize()}; width: ${h.getSize()}px; ${getCommonPinningStyles(h.column)}`}
                      >
                        {#if !h.isPlaceholder}
                          <h.FlexRender header={h} />
                        {/if}
                        <h.ResizeHandle />
                      </Table.Head>
                    {/snippet}
                  </table.AppHeader>
                {/each}
              </Table.Row>
            {/each}
          </Table.Header>
          <Table.Body>
            {#each table.getRowModel().rows as row (row.id)}
              <Table.Row
                data-state={row.getIsSelected() ? 'selected' : undefined}
                aria-selected={row.getIsSelected()}
              >
                {#each row.getVisibleCells() as cell (cell.id)}
                  <table.AppCell {cell}>
                    {#snippet children(c)}
                      <Table.Cell
                        class={cn(
                          c.column.id === 'actions' ? '' : 'border-r',
                          c.column.id === 'select' &&
                            'text-center [&>[role=checkbox]]:mx-auto',
                        )}
                        style={`flex-grow: ${c.column.getSize()}; width: ${c.column.getSize()}px; ${getCommonPinningStyles(c.column, row.getIsSelected())}`}
                      >
                        {#if c.getIsGrouped()}
                          <c.GroupedCell />
                        {:else}
                          <c.FlexRender cell={c} />
                        {/if}
                      </Table.Cell>
                    {/snippet}
                  </table.AppCell>
                {/each}
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
      <table.Pagination />
    </div>
  </div>
</table.AppTable>
