import clsx from 'clsx'

import { Collapse, TableTd, TableTr } from '@mantine/core'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput'
import classes from './MRT_TableDetailPanel.module.css'
import type {
  MRT_Row,
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { TableTdProps } from '@mantine/core'
import type { RefObject } from 'react'

interface Props<TData extends MRT_RowData> extends TableTdProps {
  parentRowRef: RefObject<HTMLTableRowElement | null>
  renderedRowIndex?: number
  row: MRT_Row<TData>
  rowVirtualizer?: MRT_RowVirtualizer
  striped?: false | string
  table: MRT_TableInstance<TData>
  virtualRow?: MRT_VirtualItem
}

export const MRT_TableDetailPanel = <TData extends MRT_RowData>({
  parentRowRef,
  renderedRowIndex = 0,
  row,
  rowVirtualizer,
  striped,
  table,
  virtualRow,
  ...rest
}: Props<TData>) => {
  const {
    state,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      mantineDetailPanelProps,
      mantineTableBodyRowProps,
      renderDetailPanel,
    },
  } = table
  const { isLoading } = state

  const tableRowProps = parseFromValuesOrFunc(mantineTableBodyRowProps, {
    isDetailPanel: true,
    row,
    table,
  })

  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  }

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextInput cell={cell} key={cell.id} table={table} />
    ))

  const DetailPanel =
    !isLoading &&
    row.getIsExpanded() &&
    renderDetailPanel?.({ internalEditComponents, row, table })

  return (
    <TableTr
      data-index={
        renderDetailPanel ? renderedRowIndex * 2 + 1 : renderedRowIndex
      }
      data-striped={striped}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node)
        }
      }}
      {...tableRowProps}
      __vars={{
        '--mrt-parent-row-height': virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        '--mrt-virtual-row-start': virtualRow
          ? `${virtualRow.start}px`
          : undefined,
        ...tableRowProps?.__vars,
      }}
      className={clsx(
        'mantine-Table-tr-detail-panel',
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        virtualRow && classes['root-virtual-row'],
        tableRowProps?.className,
      )}
    >
      <TableTd
        colSpan={getVisibleLeafColumns().length}
        component="td"
        {...tableCellProps}
        __vars={{
          '--mrt-inner-width': `${table.getTotalSize()}px`,
        }}
        className={clsx(
          'mantine-Table-td-detail-panel',
          classes.inner,
          layoutMode?.startsWith('grid') && classes['inner-grid'],
          row.getIsExpanded() && classes['inner-expanded'],
          virtualRow && classes['inner-virtual'],
        )}
        p={row.getIsExpanded() && DetailPanel ? 'md' : 0}
      >
        {rowVirtualizer ? (
          row.getIsExpanded() && DetailPanel
        ) : (
          <Collapse expanded={row.getIsExpanded()}>{DetailPanel}</Collapse>
        )}
      </TableTd>
    </TableTr>
  )
}
