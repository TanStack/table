import { useMemo } from 'react'

import { getMRT_Rows } from '../utils/row.utils'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../types'

export const useMRT_Rows = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
): Array<MRT_Row<TData>> => {
  const {
    getRowModel,
    state,
    options: { data, enableGlobalFilterRankedResults, positionCreatingRow },
  } = table
  const {
    creatingRow,
    expanded,
    globalFilter,
    pagination,
    rowPinning,
    sorting,
  } = state

  const rows = useMemo(
    () => getMRT_Rows(table),
    [
      creatingRow,
      data,
      enableGlobalFilterRankedResults,
      expanded,
      getRowModel().rows,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      positionCreatingRow,
      rowPinning,
      sorting,
    ],
  )

  return rows
}
