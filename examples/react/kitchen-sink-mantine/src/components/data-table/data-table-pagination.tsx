'use client'

import {
  ActionIcon,
  Group,
  Pagination as MantinePagination,
  Select,
  Text,
} from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { useTableContext } from '@/hooks/table'

export function DataTablePagination(): React.ReactNode {
  const table = useTableContext()
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize

  return (
    <Group justify="space-between" p="sm">
      <Text size="sm" c="dimmed">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Text>
      <Group gap="xs">
        <Text size="sm">Rows per page:</Text>
        <Select
          aria-label="Rows per page"
          data={[
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
          w={90}
        />
        <ActionIcon
          variant="subtle"
          aria-label="First page"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronsLeft size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <MantinePagination
          value={pageIndex + 1}
          total={table.getPageCount()}
          onChange={(page) => table.setPageIndex(page - 1)}
          withEdges={false}
          siblings={1}
          boundaries={1}
        />
        <ActionIcon
          variant="subtle"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          aria-label="Last page"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
        >
          <IconChevronsRight size={18} />
        </ActionIcon>
      </Group>
    </Group>
  )
}
