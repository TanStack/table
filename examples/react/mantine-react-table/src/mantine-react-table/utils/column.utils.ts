import type { Row, StockFeatures } from '@tanstack/react-table'

import type {
  MRT_Column,
  MRT_ColumnDef,
  MRT_ColumnOrderState,
  MRT_DefinedColumnDef,
  MRT_DefinedTableOptions,
  MRT_FilterOption,
  MRT_RowData,
} from '../types'

export const getColumnId = <TData extends MRT_RowData>(
  columnDef: MRT_ColumnDef<TData>,
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header

export const getAllLeafColumnDefs = <TData extends MRT_RowData>(
  columns: Array<MRT_ColumnDef<TData>>,
): Array<MRT_ColumnDef<TData>> => {
  const allLeafColumnDefs: Array<MRT_ColumnDef<TData>> = []
  const getLeafColumns = (cols: Array<MRT_ColumnDef<TData>>) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns)
      } else {
        allLeafColumnDefs.push(col)
      }
    })
  }
  getLeafColumns(columns)
  return allLeafColumnDefs
}

export const prepareColumns = <TData extends MRT_RowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: Array<MRT_ColumnDef<TData>>
  tableOptions: MRT_DefinedTableOptions<TData>
}): Array<MRT_DefinedColumnDef<TData>> => {
  const {
    aggregationFns = {},
    defaultDisplayColumn,
    filterFns = {},
    sortFns = {},
    state: { columnFilterFns = {} } = {},
  } = tableOptions
  return columnDefs.map((columnDef) => {
    // assign columnId
    if (!columnDef.id) columnDef.id = getColumnId(columnDef)
    // assign columnDefType
    if (!columnDef.columnDefType) columnDef.columnDefType = 'data'
    if (columnDef.columns?.length) {
      columnDef.columnDefType = 'group'
      // recursively prepare columns if this is a group column
      columnDef.columns = prepareColumns({
        columnDefs: columnDef.columns,
        tableOptions,
      })
    } else if (columnDef.columnDefType === 'data') {
      // assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as Array<string>
        columnDef.aggregationFn = (
          columnId: string,
          leafRows: Array<Row<StockFeatures, TData>>,
          childRows: Array<Row<StockFeatures, TData>>,
        ) =>
          aggFns.map((fn) =>
            aggregationFns[fn]?.(columnId, leafRows, childRows),
          )
      }

      // assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn =
          filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy
        ;(columnDef as MRT_DefinedColumnDef<TData>)._filterFn =
          columnFilterFns[columnDef.id]
      }

      // assign sortFns
      if (Object.keys(sortFns).includes(columnDef.sortFn as string)) {
        columnDef.sortFn = sortFns[columnDef.sortFn as string]
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as MRT_ColumnDef<TData>),
        ...columnDef,
      }
    }
    return columnDef
  }) as Array<MRT_DefinedColumnDef<TData>>
}

export const reorderColumn = <TData extends MRT_RowData>(
  draggedColumn: MRT_Column<TData>,
  targetColumn: MRT_Column<TData>,
  columnOrder: MRT_ColumnOrderState,
): MRT_ColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned())
  }
  const newColumnOrder = [...columnOrder]
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumn.id),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
  )
  return newColumnOrder
}

export const getDefaultColumnFilterFn = <TData extends MRT_RowData>(
  columnDef: MRT_ColumnDef<TData>,
): MRT_FilterOption => {
  const { filterVariant } = columnDef
  if (filterVariant === 'multi-select') return 'arrIncludesSome'
  if (filterVariant?.includes('range')) return 'betweenInclusive'
  if (['checkbox', 'date', 'select'].includes(filterVariant || ''))
    return 'equals'
  return 'fuzzy'
}
