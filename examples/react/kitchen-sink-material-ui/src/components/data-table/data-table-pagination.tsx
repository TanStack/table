import Stack from '@mui/material/Stack'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { useTableContext } from '@/hooks/table'

export function DataTablePagination(): React.ReactNode {
  const table = useTableContext()

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ p: 1, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography variant="body2" color="text.secondary">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.state.pagination.pageIndex}
          rowsPerPage={
            table.state.pagination.pageSize === Infinity
              ? -1
              : table.state.pagination.pageSize
          }
          rowsPerPageOptions={[10, 20, 30, 40, 50, { label: 'All', value: -1 }]}
          showFirstButton
          showLastButton
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(event) => {
            const pageSize = Number(event.target.value)
            table.setPageSize(pageSize === -1 ? Infinity : pageSize)
            table.setPageIndex(0)
          }}
        />
      </Stack>
    </Stack>
  )
}
