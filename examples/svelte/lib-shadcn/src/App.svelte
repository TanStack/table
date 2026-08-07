<script lang="ts">
  import { createRawSnippet } from 'svelte'
  import {
    FlexRender,
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFn_includesString,
    globalFilteringFeature,
    renderSnippet,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { debounce } from '@tanstack/pacer'
  import ArrowDown from '@lucide/svelte/icons/arrow-down'
  import ArrowUp from '@lucide/svelte/icons/arrow-up'
  import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down'
  import ChevronLeft from '@lucide/svelte/icons/chevron-left'
  import ChevronRight from '@lucide/svelte/icons/chevron-right'
  import ChevronsLeft from '@lucide/svelte/icons/chevrons-left'
  import ChevronsRight from '@lucide/svelte/icons/chevrons-right'
  import Search from '@lucide/svelte/icons/search'
  import { Button } from '@/lib/components/ui/button'
  import { Input } from '@/lib/components/ui/input'
  import * as Select from '@/lib/components/ui/select'
  import * as Table from '@/lib/components/ui/table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  // 3. New in V9! Tell the table which features and row models we want to use.
  // Adding sorting, pagination, and global filtering opts the table into those
  // feature sets.
  const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      text: sortFn_text,
    },
    filterFns: {
      includesString: filterFn_includesString,
    },
  })

  const italicCell = createRawSnippet<[{ value: string | undefined }]>(
    (getProps) => ({
      render: () => `<i>${getProps().value ?? ''}</i>`,
    }),
  )

  const columnHelper = createColumnHelper<typeof features, Person>()
  // 4. Define the columns for your table.
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: 'Last Name',
      cell: (info) => renderSnippet(italicCell, { value: info.getValue<string>() }),
    }),
    columnHelper.accessor((row) => Number(row.age), {
      id: 'age',
      header: 'Age',
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
    }),
  ])

  // 5. Store data in `$state` so regenerating it stays reactive
  let data = $state(makeData(200))
  const refreshData = () => (data = makeData(200))
  const stressTest = () => (data = makeData(1_000_000))

  // 6. Create the table instance with required features, columns, and data.
  // No `state` / `onSortingChange` / `onPaginationChange` options needed.
  // V9 manages sorting, pagination, and globalFilter state internally.
  const table = createTable({
    debugTable: true,
    features,
    columns,
    get data() {
      return data
    },
    globalFilterFn: 'includesString',
  })

  const globalFilter = $derived(table.atoms.globalFilter.get())
  const pagination = $derived(table.atoms.pagination.get())

  // Debounced global filter setter — mirrors the react example's DebouncedInput.
  const setGlobalFilterDebounced = debounce(
    (value: string | number) => table.setGlobalFilter(String(value)),
    { wait: 300 },
  )
</script>

<!-- 7. Render your table markup from the table instance APIs. -->
<div class="p-4">
  <div class="flex items-center justify-between gap-2 mb-4">
    <div class="relative w-full max-w-sm">
      <Search
        class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={globalFilter ?? ''}
        placeholder="Search all columns..."
        class="pl-8"
        oninput={(e) => setGlobalFilterDebounced(e.currentTarget.value)}
      />
    </div>
    <div class="flex gap-2">
      <Button variant="outline" onclick={refreshData}>Regenerate Data</Button>
      <Button variant="outline" onclick={stressTest}>
        Stress Test (1M rows)
      </Button>
    </div>
  </div>

  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              {@const sorted = header.column.getIsSorted()}
              {@const Icon =
                sorted === 'asc'
                  ? ArrowUp
                  : sorted === 'desc'
                    ? ArrowDown
                    : ArrowUpDown}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  {#if header.column.getCanSort()}
                    <Button
                      variant="ghost"
                      size="sm"
                      class="-ml-3 h-8 data-[state=open]:bg-accent"
                      onclick={header.column.getToggleSortingHandler()}
                    >
                      <FlexRender {header} />
                      <Icon class="ml-2" />
                    </Button>
                  {:else}
                    <span class="text-sm font-medium">
                      <FlexRender {header} />
                    </span>
                  {/if}
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row>
            {#each row.getAllCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender {cell} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              No results.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <!-- Pagination controls -->
  <div class="flex items-center justify-between gap-4 px-2 py-4">
    <div class="text-sm text-muted-foreground">
      {table.getPrePaginatedRowModel().rows.length.toLocaleString()} of{' '}
      {data.length.toLocaleString()} rows
    </div>
    <div class="flex items-center gap-6 lg:gap-8">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium">Rows per page</p>
        <!-- bits-ui's Select has no SelectValue part — the trigger renders the
             selected value directly as its children. -->
        <Select.Root
          type="single"
          value={`${pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <Select.Trigger size="sm" class="w-[70px]">
            {pagination.pageSize === Infinity ? 'All' : pagination.pageSize}
          </Select.Trigger>
          <Select.Content side="top">
            {#each [10, 20, 30, 40, 50, Infinity] as pageSize (pageSize)}
              <Select.Item
                value={`${pageSize}`}
                label={pageSize === Infinity ? 'All' : `${pageSize}`}
              />
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {pagination.pageIndex + 1} of{' '}
        {Math.max(1, table.getPageCount())}
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          disabled={!table.getCanPreviousPage()}
          onclick={() => table.firstPage()}
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          disabled={!table.getCanPreviousPage()}
          onclick={() => table.previousPage()}
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          disabled={!table.getCanNextPage()}
          onclick={() => table.nextPage()}
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          disabled={!table.getCanLastPage()}
          onclick={() => table.lastPage()}
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  </div>
</div>
