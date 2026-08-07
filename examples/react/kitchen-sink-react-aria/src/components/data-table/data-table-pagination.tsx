import { Button } from 'react-aria-components'
import { useTableContext } from '@/hooks/table'
import { AriaSelect, cx } from '@/components/data-table/shared'

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
    <div className="table-pagination">
      <div className="table-pagination-summary">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </div>
      <div className="table-pagination-controls">
        <span className="whitespace-nowrap text-sm">Rows per page:</span>
        <AriaSelect
          label="Rows per page"
          className="w-24"
          showLabel={false}
          value={String(pageSize)}
          options={[
            ...['10', '20', '30', '40', '50'].map((value) => ({
              value,
              label: value,
            })),
            { value: 'Infinity', label: 'All' },
          ]}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
        />
        <Button
          onPress={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          {'«'}
        </Button>
        <nav aria-label="Pagination" className="pagination">
          <Button
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            {'‹'} Prev
          </Button>
          {pageItems.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                {'…'}
              </span>
            ) : (
              <Button
                key={page}
                className={cx(
                  'react-aria-Button',
                  page === pageIndex + 1 && 'is-active',
                )}
                onPress={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            ),
          )}
          <Button
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            Next {'›'}
          </Button>
        </nav>
        <Button
          onPress={() => table.lastPage()}
          isDisabled={!table.getCanLastPage()}
        >
          {'»'}
        </Button>
      </div>
    </div>
  )
}
