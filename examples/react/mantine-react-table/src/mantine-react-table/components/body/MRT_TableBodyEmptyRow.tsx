import clsx from 'clsx'

import { useMemo } from 'react'

import { constructRow as createRow } from '@tanstack/react-table'

import { Text } from '@mantine/core'

import { MRT_EMPTY_ROW_ID, MRT_TableBodyRow } from './MRT_TableBodyRow'
import classes from './MRT_TableBody.module.css'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'
import type { TableProps, TableTrProps } from '@mantine/core'

interface Props<TData extends MRT_RowData> extends TableTrProps {
  table: MRT_TableInstance<TData>
  tableProps: Partial<TableProps>
}

export const MRT_TableBodyEmptyRow = <TData extends MRT_RowData>({
  table,
  tableProps,
  ...commonRowProps
}: Props<TData>) => {
  const {
    state,
    options: { layoutMode, localization, renderEmptyRowsFallback },
    refs: { tablePaperRef },
  } = table
  const { columnFilters, globalFilter } = state

  const emptyRow = useMemo(
    () =>
      createRow(
        table as any,
        MRT_EMPTY_ROW_ID,
        {} as TData,
        0,
        0,
      ) as MRT_Row<TData>,
    [],
  )

  const emptyRowProps = {
    ...commonRowProps,
    renderedRowIndex: 0,
    row: emptyRow,
    virtualRow: undefined,
  }

  return (
    <MRT_TableBodyRow
      className={clsx(
        'mrt-table-body-row',
        layoutMode?.startsWith('grid') && classes['empty-row-tr-grid'],
      )}
      table={table}
      tableProps={tableProps}
      {...emptyRowProps}
    >
      <td
        className={clsx(
          'mrt-table-body-cell',
          layoutMode?.startsWith('grid') && classes['empty-row-td-grid'],
        )}
        colSpan={table.getVisibleLeafColumns().length}
      >
        {renderEmptyRowsFallback?.({ table }) ?? (
          <Text
            __vars={{
              '--mrt-paper-width': `${tablePaperRef.current?.clientWidth}`,
            }}
            className={clsx(classes['empty-row-td-content'])}
          >
            {globalFilter || columnFilters.length
              ? localization.noResultsFound
              : localization.noRecordsToDisplay}
          </Text>
        )}
      </td>
    </MRT_TableBodyRow>
  )
}
