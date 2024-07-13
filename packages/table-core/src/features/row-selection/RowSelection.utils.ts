import { table_getPreGroupedRowModel as RowSelectionUtils } from '../column-grouping/ColumnGrouping.utils'
import { table_getFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import { table_getPaginatedRowModel } from '../row-pagination/RowPagination.utils'
import { table_getRow } from '../../core/rows/Rows.utils'
import {
  table_getCoreRowModel,
  table_getRowModel,
} from '../../core/table/Tables.utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowSelectionState } from './RowSelection.types'

export function table_setRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<RowSelectionState>) {
  table.options.onRowSelectionChange?.(updater)
}

export function table_resetRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setRowSelection(
    table,
    defaultState ? {} : table.initialState.rowSelection ?? {},
  )
}

export function table_toggleAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    value =
      typeof value !== 'undefined' ? value : !table_getIsAllRowsSelected(table)

    const rowSelection = { ...old }

    const preGroupedFlatRows = RowSelectionUtils(table).flatRows

    // We don't use `mutateRowIsSelected` here for performance reasons.
    // All of the rows are flat already, so it wouldn't be worth it
    if (value) {
      preGroupedFlatRows.forEach((row) => {
        if (!row_getCanSelect(row, table)) {
          return
        }
        rowSelection[row.id] = true
      })
    } else {
      preGroupedFlatRows.forEach((row) => {
        delete rowSelection[row.id]
      })
    }

    return rowSelection
  })
}

export function table_toggleAllPageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    const resolvedValue =
      typeof value !== 'undefined'
        ? value
        : !table_getIsAllPageRowsSelected(table)

    const rowSelection: RowSelectionState = { ...old }

    table_getRowModel(table).rows.forEach((row) => {
      mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
    })

    return rowSelection
  })
}

export function table_getPreSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table_getCoreRowModel(table)
}

export function table_getSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TFeatures, TData>,
) {
  if (!Object.keys(rowSelection).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(table, rowModel)
}

export function table_getFilteredSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TFeatures, TData>,
) {
  if (!Object.keys(rowSelection).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(table, rowModel)
}

export function table_getGroupedSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TFeatures, TData>,
) {
  if (!Object.keys(rowSelection).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(table, rowModel)
}

export function table_getIsAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const preGroupedFlatRows = table_getFilteredRowModel(table).flatRows
  const { rowSelection } = table.getState()

  let isAllRowsSelected = Boolean(
    preGroupedFlatRows.length && Object.keys(rowSelection).length,
  )

  if (isAllRowsSelected) {
    if (
      preGroupedFlatRows.some(
        (row) => row_getCanSelect(row, table) && !rowSelection[row.id],
      )
    ) {
      isAllRowsSelected = false
    }
  }

  return isAllRowsSelected
}

export function table_getIsAllPageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const paginationFlatRows = table_getPaginatedRowModel(table).flatRows.filter(
    (row) => row_getCanSelect(row, table),
  )
  const { rowSelection } = table.getState()

  let isAllPageRowsSelected = !!paginationFlatRows.length

  if (
    isAllPageRowsSelected &&
    paginationFlatRows.some((row) => !rowSelection[row.id])
  ) {
    isAllPageRowsSelected = false
  }

  return isAllPageRowsSelected
}

export function table_getIsSomeRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const totalSelected = Object.keys(table.getState().rowSelection).length
  return (
    totalSelected > 0 &&
    totalSelected < table_getFilteredRowModel(table).flatRows.length
  )
}

export function table_getIsSomePageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const paginationFlatRows = table_getPaginatedRowModel(table).flatRows
  return table_getIsAllPageRowsSelected(table)
    ? false
    : paginationFlatRows
        .filter((row) => row_getCanSelect(row, table))
        .some(
          (row) =>
            row_getIsSelected(row, table) || row_getIsSomeSelected(row, table),
        )
}

export function table_getToggleAllRowsSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllRowsSelected(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function table_getToggleAllPageRowsSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllPageRowsSelected(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function row_toggleSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
  value?: boolean,
  opts?: {
    selectChildren?: boolean
  },
) {
  const isSelected = row_getIsSelected(row, table)

  table_setRowSelection(table, (old) => {
    value = typeof value !== 'undefined' ? value : !isSelected

    if (row_getCanSelect(row, table) && isSelected === value) {
      return old
    }

    const selectedRowIds = { ...old }

    mutateRowIsSelected(
      selectedRowIds,
      row.id,
      value,
      opts?.selectChildren ?? true,
      table,
    )

    return selectedRowIds
  })
}

export function row_getIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const { rowSelection } = table.getState()
  return isRowSelected(row, rowSelection)
}

export function row_getIsSomeSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const { rowSelection } = table.getState()
  return isSubRowSelected(row, rowSelection, table) === 'some'
}

export function row_getIsAllSubRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const { rowSelection } = table.getState()
  return isSubRowSelected(row, rowSelection, table) === 'all'
}

export function row_getCanSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  if (typeof table.options.enableRowSelection === 'function') {
    return table.options.enableRowSelection(row)
  }

  return table.options.enableRowSelection ?? true
}

export function row_getCanSelectSubRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  if (typeof table.options.enableSubRowSelection === 'function') {
    return table.options.enableSubRowSelection(row)
  }

  return table.options.enableSubRowSelection ?? true
}

export function row_getCanMultiSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  if (typeof table.options.enableMultiRowSelection === 'function') {
    return table.options.enableMultiRowSelection(row)
  }

  return table.options.enableMultiRowSelection ?? true
}

export function row_getToggleSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const canSelect = row_getCanSelect(row, table)

  return (e: unknown) => {
    if (!canSelect) return
    row_toggleSelected(
      row,
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

const mutateRowIsSelected = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  selectedRowIds: Record<string, boolean>,
  rowId: string,
  value: boolean,
  includeChildren: boolean,
  table: Table<TFeatures, TData>,
) => {
  const row = table_getRow(table, rowId, true)

  // const isGrouped = row.getIsGrouped()

  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && table.options.enableGroupingRowSelection)
  // ) {
  if (value) {
    if (!row_getCanMultiSelect(row, table)) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
    }
    if (row_getCanSelect(row, table)) {
      selectedRowIds[rowId] = true
    }
  } else {
    delete selectedRowIds[rowId]
  }
  // }

  if (
    includeChildren &&
    row.subRows.length &&
    row_getCanSelectSubRows(row, table)
  ) {
    row.subRows.forEach((r) =>
      mutateRowIsSelected(selectedRowIds, r.id, value, includeChildren, table),
    )
  }
}

export function selectRowsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  rowModel: RowModel<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const rowSelection = table.getState().rowSelection

  const newSelectedFlatRows: Array<Row<TFeatures, TData>> = []
  const newSelectedRowsById: Record<string, Row<TFeatures, TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (
    rows: Array<Row<TFeatures, TData>>,
    depth = 0,
  ): Array<Row<TFeatures, TData>> => {
    return rows
      .map((row) => {
        const isSelected = isRowSelected(row, rowSelection)

        if (isSelected) {
          newSelectedFlatRows.push(row)
          newSelectedRowsById[row.id] = row
        }

        if (row.subRows.length) {
          row = {
            ...row,
            subRows: recurseRows(row.subRows, depth + 1),
          }
        }

        if (isSelected) {
          return row
        }
      })
      .filter(Boolean) as Array<Row<TFeatures, TData>>
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, selection: Record<string, boolean>): boolean {
  return selection[row.id] ?? false
}

export function isSubRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  selection: Record<string, boolean>,
  table: Table<TFeatures, TData>,
): boolean | 'some' | 'all' {
  if (!row.subRows.length) return false

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach((subRow) => {
    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      return
    }

    if (row_getCanSelect(subRow, table)) {
      if (isRowSelected(subRow, selection)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    }

    // Check row selection of nested subrows
    if (subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow, selection, table)
      if (subRowChildrenSelected === 'all') {
        someSelected = true
      } else if (subRowChildrenSelected === 'some') {
        someSelected = true
        allChildrenSelected = false
      } else {
        allChildrenSelected = false
      }
    }
  })

  // eslint-disable-next-line ts/no-unnecessary-condition
  return allChildrenSelected ? 'all' : someSelected ? 'some' : false
}
