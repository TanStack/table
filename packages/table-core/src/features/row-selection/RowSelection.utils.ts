import type { Row, RowData, RowModel, Table, Updater } from '../../types'
import type { RowSelectionState } from './RowSelection.types'

export function table_setRowSelection<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<RowSelectionState>,
) {
  table.options.onRowSelectionChange?.(updater)
}

export function table_resetRowSelection<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setRowSelection(defaultState ? {} : table.initialState.rowSelection)
}

export function table_toggleAllRowsSelected<TData extends RowData>(
  table: Table<TData>,
  value?: boolean,
) {
  table_setRowSelection(table, (old) => {
    value =
      typeof value !== 'undefined' ? value : !table_getIsAllRowsSelected(table)

    const rowSelection = { ...old }

    const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

    // We don't use `mutateRowIsSelected` here for performance reasons.
    // All of the rows are flat already, so it wouldn't be worth it
    if (value) {
      preGroupedFlatRows.forEach((row) => {
        if (!row.getCanSelect()) {
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

export function table_toggleAllPageRowsSelected<TData extends RowData>(
  table: Table<TData>,
  value?: boolean,
) {
  table.setRowSelection((old) => {
    const resolvedValue =
      typeof value !== 'undefined' ? value : !table.getIsAllPageRowsSelected()

    const rowSelection: RowSelectionState = { ...old }

    table.getRowModel().rows.forEach((row) => {
      mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
    })

    return rowSelection
  })
}

export function table_getPreSelectedRowModel<TData extends RowData>(
  table: Table<TData>,
) {
  return table.getCoreRowModel()
}

export function table_getSelectedRowModel<TData extends RowData>(
  table: Table<TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TData>,
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

export function table_getFilteredSelectedRowModel<TData extends RowData>(
  table: Table<TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TData>,
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

export function table_getGroupedSelectedRowModel<TData extends RowData>(
  table: Table<TData>,
  rowSelection: RowSelectionState,
  rowModel: RowModel<TData>,
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

export function table_getIsAllRowsSelected<TData extends RowData>(
  table: Table<TData>,
) {
  const preGroupedFlatRows = table.getFilteredRowModel().flatRows
  const { rowSelection } = table.getState()

  let isAllRowsSelected = Boolean(
    preGroupedFlatRows.length && Object.keys(rowSelection).length,
  )

  if (isAllRowsSelected) {
    if (
      preGroupedFlatRows.some(
        (row) => row.getCanSelect() && !rowSelection[row.id],
      )
    ) {
      isAllRowsSelected = false
    }
  }

  return isAllRowsSelected
}

export function table_getIsAllPageRowsSelected<TData extends RowData>(
  table: Table<TData>,
) {
  const paginationFlatRows = table
    .getPaginationRowModel()
    .flatRows.filter((row) => row.getCanSelect())
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

export function table_getIsSomeRowsSelected<TData extends RowData>(
  table: Table<TData>,
) {
  const totalSelected = Object.keys(table.getState().rowSelection).length
  return (
    totalSelected > 0 &&
    totalSelected < table.getFilteredRowModel().flatRows.length
  )
}

export function table_getIsSomePageRowsSelected<TData extends RowData>(
  table: Table<TData>,
) {
  const paginationFlatRows = table.getPaginationRowModel().flatRows
  return table.getIsAllPageRowsSelected()
    ? false
    : paginationFlatRows
        .filter((row) => row.getCanSelect())
        .some((d) => d.getIsSelected() || d.getIsSomeSelected())
}

export function table_getToggleAllRowsSelectedHandler<TData extends RowData>(
  table: Table<TData>,
) {
  return (e: unknown) => {
    table.toggleAllRowsSelected(
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function table_getToggleAllPageRowsSelectedHandler<
  TData extends RowData,
>(table: Table<TData>) {
  return (e: unknown) => {
    table.toggleAllPageRowsSelected(
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function row_toggleSelected<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  value?: boolean,
  opts?: {
    selectChildren?: boolean
  },
) {
  const isSelected = row.getIsSelected()

  table_setRowSelection(table, (old) => {
    value = typeof value !== 'undefined' ? value : !isSelected

    if (row.getCanSelect() && isSelected === value) {
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

export function row_getIsSelected<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const { rowSelection } = table.getState()
  return isRowSelected(row, rowSelection)
}

export function row_getIsSomeSelected<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const { rowSelection } = table.getState()
  return isSubRowSelected(row, rowSelection, table) === 'some'
}

export function row_getIsAllSubRowsSelected<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const { rowSelection } = table.getState()
  return isSubRowSelected(row, rowSelection, table) === 'all'
}

export function row_getCanSelect<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  if (typeof table.options.enableRowSelection === 'function') {
    return table.options.enableRowSelection(row)
  }

  return table.options.enableRowSelection ?? true
}

export function row_getCanSelectSubRows<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  if (typeof table.options.enableSubRowSelection === 'function') {
    return table.options.enableSubRowSelection(row)
  }

  return table.options.enableSubRowSelection ?? true
}

export function row_getCanMultiSelect<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  if (typeof table.options.enableMultiRowSelection === 'function') {
    return table.options.enableMultiRowSelection(row)
  }

  return table.options.enableMultiRowSelection ?? true
}

export function row_getToggleSelectedHandler<TData extends RowData>(
  row: Row<TData>,
) {
  const canSelect = row.getCanSelect()

  return (e: unknown) => {
    if (!canSelect) return
    row.toggleSelected(((e as MouseEvent).target as HTMLInputElement).checked)
  }
}

const mutateRowIsSelected = <TData extends RowData>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  includeChildren: boolean,
  table: Table<TData>,
) => {
  const row = table.getRow(id, true)

  // const isGrouped = row.getIsGrouped()

  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && table.options.enableGroupingRowSelection)
  // ) {
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true
    }
  } else {
    delete selectedRowIds[id]
  }
  // }

  if (includeChildren && row.subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach((r) =>
      mutateRowIsSelected(selectedRowIds, r.id, value, includeChildren, table),
    )
  }
}

export function selectRowsFn<TData extends RowData>(
  table: Table<TData>,
  rowModel: RowModel<TData>,
): RowModel<TData> {
  const rowSelection = table.getState().rowSelection

  const newSelectedFlatRows: Array<Row<TData>> = []
  const newSelectedRowsById: Record<string, Row<TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (
    rows: Array<Row<TData>>,
    depth = 0,
  ): Array<Row<TData>> => {
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
      .filter(Boolean) as Array<Row<TData>>
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>,
): boolean {
  return selection[row.id] ?? false
}

export function isSubRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>,
  table: Table<TData>,
): boolean | 'some' | 'all' {
  if (!row.subRows.length) return false

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach((subRow) => {
    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      return
    }

    if (subRow.getCanSelect()) {
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
