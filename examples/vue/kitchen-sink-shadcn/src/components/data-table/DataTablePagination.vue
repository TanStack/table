<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '@lucide/vue'
import { useTableContext } from '@/hooks/table'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = withDefaults(defineProps<{ pageSizeOptions?: Array<number> }>(), {
  pageSizeOptions: () => [10, 20, 30, 40, 50, Infinity],
})

const table = useTableContext()
</script>

<template>
  <div
    class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8"
  >
    <div class="flex-1 whitespace-nowrap text-muted-foreground text-sm">
      {{ table.getFilteredSelectedRowModel().rows.length.toLocaleString() }} of
      {{ table.getFilteredRowModel().rows.length.toLocaleString() }} row(s)
      selected.
    </div>
    <div
      class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8"
    >
      <div class="flex items-center space-x-2">
        <p class="whitespace-nowrap font-medium text-sm">Rows per page</p>
        <Select
          :model-value="`${table.atoms.pagination.get().pageSize}`"
          @update:model-value="(value) => table.setPageSize(Number(value))"
        >
          <SelectTrigger class="h-8 w-[4.5rem]">
            <SelectValue
              :placeholder="`${table.atoms.pagination.get().pageSize}`"
            />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in props.pageSizeOptions"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize === Infinity ? 'All' : pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-center font-medium text-sm">
        Page
        {{ (table.atoms.pagination.get().pageIndex + 1).toLocaleString() }} of
        {{ table.getPageCount().toLocaleString() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          aria-label="Go to first page"
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <ChevronsLeft class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <ChevronLeft class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <ChevronRight class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          :disabled="!table.getCanLastPage()"
          @click="table.lastPage()"
        >
          <ChevronsRight class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </div>
</template>
