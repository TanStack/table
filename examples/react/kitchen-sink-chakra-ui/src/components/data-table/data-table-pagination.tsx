'use client'

import { HStack, IconButton, Text } from '@chakra-ui/react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { useTableContext } from '@/hooks/table'
import { SelectField } from '@/components/data-table/shared'

export function DataTablePagination(): React.ReactNode {
  const table = useTableContext()
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize

  return (
    <HStack justify="space-between" p="3">
      <Text fontSize="sm" color="fg.muted">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Text>
      <HStack gap="2">
        <Text fontSize="sm">Rows per page:</Text>
        <SelectField
          aria-label="Rows per page"
          options={[
            '10',
            '20',
            '30',
            '40',
            '50',
            { value: 'Infinity', label: 'All' },
          ]}
          value={String(pageSize)}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
          width="90px"
        />
        <IconButton
          variant="subtle"
          aria-label="First page"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronsLeft size={18} />
        </IconButton>
        <IconButton
          variant="subtle"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft size={18} />
        </IconButton>
        <Text fontSize="sm">
          {pageIndex + 1} / {table.getPageCount()}
        </Text>
        <IconButton
          variant="subtle"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight size={18} />
        </IconButton>
        <IconButton
          variant="subtle"
          aria-label="Last page"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
        >
          <IconChevronsRight size={18} />
        </IconButton>
      </HStack>
    </HStack>
  )
}
