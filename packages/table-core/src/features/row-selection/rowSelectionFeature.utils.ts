import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowSelectionState } from './rowSelectionFeature.types'

// State APIs

export function getDefaultRowSelectionState(): RowSelectionState {
  return structuredClone({})
}

export function table_setRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<RowSelectionState>,
) {
  table.options.onRowSelectionChange?.(updater)
}

export function table_resetRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setRowSelection(
    table,
    defaultState ? {} : (table.initialState.rowSelection ?? {}),
  )
}

// Table APIs

export function table_toggleAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    value =
      typeof value !== 'undefined' ? value : !table_getIsAllRowsSelected(table)

    const rowSelection = { ...old }

    const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

    // We don't use `mutateRowIsSelected` here for performance reasons.
    // All of the rows are flat already, so it wouldn't be worth it
    if (value) {
      preGroupedFlatRows.forEach((row) => {
        if (!row_getCanSelect(row)) {
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
>(table: Table_Internal<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    const resolvedValue =
      typeof value !== 'undefined'
        ? value
        : !table_getIsAllPageRowsSelected(table)

    const rowSelection: RowSelectionState = { ...old }

    table.getRowModel().rows.forEach((row) => {
      mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
    })

    return rowSelection
  })
}

export function table_getPreSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getCoreRowModel()
}

export function table_getSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.options.state?.rowSelection ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

export function table_getFilteredSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.options.state?.rowSelection ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

export function table_getGroupedSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.options.state?.rowSelection ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

export function table_getIsAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const preGroupedFlatRows = table.getFilteredRowModel().flatRows
  const rowSelection =
    table.options.state?.rowSelection ?? ({} as RowSelectionState)

  let isAllRowsSelected = Boolean(
    preGroupedFlatRows.length && Object.keys(rowSelection).length,
  )

  if (isAllRowsSelected) {
    if (
      preGroupedFlatRows.some(
        (row) => row_getCanSelect(row) && !rowSelection[row.id],
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
>(table: Table_Internal<TFeatures, TData>) {
  const paginationFlatRows = table
    .getPaginatedRowModel()
    .flatRows.filter((row) => row_getCanSelect(row))
  const rowSelection =
    table.options.state?.rowSelection ?? ({} as RowSelectionState)

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
>(table: Table_Internal<TFeatures, TData>) {
  const totalSelected = Object.keys(
    table.options.state?.rowSelection ?? {},
  ).length
  return (
    totalSelected > 0 &&
    totalSelected < table.getFilteredRowModel().flatRows.length
  )
}

export function table_getIsSomePageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const paginationFlatRows = table.getPaginatedRowModel().flatRows
  return table_getIsAllPageRowsSelected(table)
    ? false
    : paginationFlatRows
        .filter((row) => row_getCanSelect(row))
        .some((row) => row_getIsSelected(row) || row_getIsSomeSelected(row))
}

export function table_getToggleAllRowsSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
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
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllPageRowsSelected(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

// Row APIs

export function row_toggleSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  value?: boolean,
  opts?: {
    selectChildren?: boolean
  },
) {
  const isSelected = row_getIsSelected(row)

  table_setRowSelection(row._table, (old) => {
    value = typeof value !== 'undefined' ? value : !isSelected

    if (row_getCanSelect(row) && isSelected === value) {
      return old
    }

    const selectedRowIds = { ...old }

    mutateRowIsSelected(
      selectedRowIds,
      row.id,
      value,
      opts?.selectChildren ?? true,
      row._table,
    )

    return selectedRowIds
  })
}

export function row_getIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isRowSelected(row)
}

export function row_getIsSomeSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'some'
}

export function row_getIsAllSubRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'all'
}

export function row_getCanSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row._table.options
  if (typeof options.enableRowSelection === 'function') {
    return options.enableRowSelection(row)
  }

  return options.enableRowSelection ?? true
}

export function row_getCanSelectSubRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row._table.options
  if (typeof options.enableSubRowSelection === 'function') {
    return options.enableSubRowSelection(row)
  }

  return options.enableSubRowSelection ?? true
}

export function row_getCanMultiSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row._table.options
  if (typeof options.enableMultiRowSelection === 'function') {
    return options.enableMultiRowSelection(row)
  }

  return options.enableMultiRowSelection ?? true
}

export function row_getToggleSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const canSelect = row_getCanSelect(row)

  return (e: unknown) => {
    if (!canSelect) return
    row_toggleSelected(
      row,
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
  table: Table_Internal<TFeatures, TData>,
) => {
  const row = table.getRow(rowId, true)

  if (value) {
    if (!row_getCanMultiSelect(row)) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
    }
    if (row_getCanSelect(row)) {
      selectedRowIds[rowId] = true
    }
  } else {
    delete selectedRowIds[rowId]
  }

  if (includeChildren && row.subRows.length && row_getCanSelectSubRows(row)) {
    row.subRows.forEach((r) =>
      mutateRowIsSelected(selectedRowIds, r.id, value, includeChildren, table),
    )
  }
}

export function selectRowsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(rowModel: RowModel<TFeatures, TData>): RowModel<TFeatures, TData> {
  const newSelectedFlatRows: Array<Row<TFeatures, TData>> = []
  const newSelectedRowsById: Record<string, Row<TFeatures, TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (
    rows: Array<Row<TFeatures, TData>>,
    depth = 0,
  ): Array<Row<TFeatures, TData>> => {
    return rows
      .map((row) => {
        const isSelected = isRowSelected(row)

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
      .filter((x) => !!x)
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
>(row: Row<TFeatures, TData>): boolean {
  return (
    (row._table.options.state?.rowSelection ?? ({} as RowSelectionState))[
      row.id
    ] ?? false
  )
}

export function isSubRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean | 'some' | 'all' {
  if (!row.subRows.length) return false

  const rowSelection =
    row._table.options.state?.rowSelection ?? ({} as RowSelectionState)

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach((subRow) => {
    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      return
    }

    if (row_getCanSelect(subRow)) {
      if (isRowSelected(subRow)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    }

    // Check row selection of nested subrows
    if (subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow)
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return allChildrenSelected ? 'all' : someSelected ? 'some' : false
}
