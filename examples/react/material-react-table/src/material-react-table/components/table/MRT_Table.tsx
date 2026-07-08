import { useMemo } from 'react'
import Table from '@mui/material/Table'
import { useMRT_ColumnVirtualizer } from '../../hooks/useMRT_ColumnVirtualizer'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableBody, Memo_MRT_TableBody } from '../body/MRT_TableBody'
import { MRT_TableFooter } from '../footer/MRT_TableFooter'
import { MRT_TableHead } from '../head/MRT_TableHead'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { TableProps } from '@mui/material/Table'

export interface MRT_TableProps extends TableProps {}

export const MRT_Table = ({ ...rest }: MRT_TableProps) => {
  const table = useMRTContext()
  const {
    getFlatHeaders,
    state,
    options: {
      columns,
      enableStickyHeader,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      muiTableProps,
      renderCaption,
    },
  } = table
  const { columnSizing, columnResizing, columnVisibility, isFullScreen } = state

  const tableProps = {
    ...parseFromValuesOrFunc(muiTableProps, { table }),
    ...rest,
  }

  const Caption = parseFromValuesOrFunc(renderCaption, { table })

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      const colSize = header.getSize()
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize
    }
    return colSizes
  }, [columns, columnSizing, columnResizing, columnVisibility])

  const columnVirtualizer = useMRT_ColumnVirtualizer(table)

  const commonTableGroupProps = {
    columnVirtualizer,
  }

  return (
    <Table
      stickyHeader={enableStickyHeader || isFullScreen}
      {...tableProps}
      style={{ ...columnSizeVars, ...tableProps?.style }}
      sx={(theme) => ({
        borderCollapse: 'separate',
        display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
        position: 'relative',
        ...(parseFromValuesOrFunc(tableProps?.sx, theme) as any),
      })}
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <MRT_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnResizing.isResizingColumn ? (
        <Memo_MRT_TableBody {...commonTableGroupProps} />
      ) : (
        <MRT_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <MRT_TableFooter {...commonTableGroupProps} />}
    </Table>
  )
}
