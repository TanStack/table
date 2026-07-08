'use client'

import { Button, Pagination as HeroPagination } from '@heroui/react'
import { useTableContext } from '@/hooks/table'
import { HeroSelect } from '@/components/data-table/shared'

function getPageItems(pageIndex: number, pageCount: number) {
  const currentPage = pageIndex + 1
  const pages = new Set<number>([
    1,
    pageCount,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b)
    .reduce<Array<number | 'ellipsis'>>((items, page) => {
      const previous = items[items.length - 1]
      if (typeof previous === 'number' && page - previous > 1) {
        items.push('ellipsis')
      }
      items.push(page)
      return items
    }, [])
}

export function DataTablePagination(): React.ReactNode {
  const table = useTableContext()
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize
  const pageItems = getPageItems(pageIndex, table.getPageCount())

  return (
    <div className="flex flex-col gap-3 border-t border-border p-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="text-sm text-muted">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </div>
      <div className="flex flex-wrap items-center gap-3 xl:justify-end">
        <span className="whitespace-nowrap text-sm">Rows per page:</span>
        <HeroSelect
          label="Rows per page"
          className="w-24"
          showLabel={false}
          value={String(pageSize)}
          options={['10', '20', '30', '40', '50'].map((value) => ({
            value,
            label: value,
          }))}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onPress={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          {'«'}
        </Button>
        <HeroPagination size="sm" className="w-auto">
          <HeroPagination.Content>
            <HeroPagination.Item>
              <HeroPagination.Previous
                isDisabled={!table.getCanPreviousPage()}
                onPress={() => table.previousPage()}
              >
                <HeroPagination.PreviousIcon />
                Prev
              </HeroPagination.Previous>
            </HeroPagination.Item>
            {pageItems.map((page, index) =>
              page === 'ellipsis' ? (
                <HeroPagination.Item key={`ellipsis-${index}`}>
                  <HeroPagination.Ellipsis />
                </HeroPagination.Item>
              ) : (
                <HeroPagination.Item key={page}>
                  <HeroPagination.Link
                    isActive={page === pageIndex + 1}
                    onPress={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </HeroPagination.Link>
                </HeroPagination.Item>
              ),
            )}
            <HeroPagination.Item>
              <HeroPagination.Next
                isDisabled={!table.getCanNextPage()}
                onPress={() => table.nextPage()}
              >
                Next
                <HeroPagination.NextIcon />
              </HeroPagination.Next>
            </HeroPagination.Item>
          </HeroPagination.Content>
        </HeroPagination>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
        >
          {'»'}
        </Button>
      </div>
    </div>
  )
}
