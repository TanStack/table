<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left'
  import ChevronRight from '@lucide/svelte/icons/chevron-right'
  import ChevronsLeft from '@lucide/svelte/icons/chevrons-left'
  import ChevronsRight from '@lucide/svelte/icons/chevrons-right'
  import { useTableContext } from '@/hooks/table.svelte'
  import { Button } from '@/lib/components/ui/button'
  import * as Select from '@/lib/components/ui/select'

  let { pageSizeOptions = [10, 20, 30, 40, 50, Infinity] }: {
    pageSizeOptions?: Array<number>
  } = $props()

  const table = useTableContext()
  const pagination = $derived(table.atoms.pagination.get())
</script>

<div
  class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8"
>
  <div class="flex-1 whitespace-nowrap text-muted-foreground text-sm">
    {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
    {table.getFilteredRowModel().rows.length.toLocaleString()} row(s) selected.
  </div>
  <div class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
    <div class="flex items-center space-x-2">
      <p class="whitespace-nowrap font-medium text-sm">Rows per page</p>
      <!-- bits-ui's Select has no SelectValue part — the trigger renders the
           selected value directly as its children. -->
      <Select.Root
        type="single"
        value={`${pagination.pageSize}`}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <Select.Trigger class="h-8 w-[4.5rem]">
          {pagination.pageSize === Infinity ? 'All' : pagination.pageSize}
        </Select.Trigger>
        <Select.Content side="top">
          {#each pageSizeOptions as pageSize (pageSize)}
            <Select.Item
              value={`${pageSize}`}
              label={pageSize === Infinity ? 'All' : `${pageSize}`}
            />
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex items-center justify-center font-medium text-sm">
      Page {(pagination.pageIndex + 1).toLocaleString()} of{' '}
      {table.getPageCount().toLocaleString()}
    </div>
    <div class="flex items-center space-x-2">
      <Button
        aria-label="Go to first page"
        variant="outline"
        class="hidden size-8 p-0 lg:flex"
        onclick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft class="size-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to previous page"
        variant="outline"
        size="icon"
        class="size-8"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft class="size-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to next page"
        variant="outline"
        size="icon"
        class="size-8"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight class="size-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to last page"
        variant="outline"
        size="icon"
        class="hidden size-8 lg:flex"
        onclick={() => table.lastPage()}
        disabled={!table.getCanLastPage()}
      >
        <ChevronsRight class="size-4" aria-hidden="true" />
      </Button>
    </div>
  </div>
</div>
