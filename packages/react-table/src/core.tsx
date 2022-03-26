import {
  flattenBy,
  functionalUpdate,
  propGetter,
  memo,
  flexRender,
  RequiredKeys,
} from './utils'

import {
  Updater,
  PropGetterValue,
  Options,
  TableState,
  ColumnDef,
  Row,
  Column,
  Cell,
  Header,
  AccessorFn,
  HeaderRenderProps,
  TableProps,
  TableBodyProps,
  PropGetter,
  Getter,
  RowProps,
  CellProps,
  TableInstance,
  RowValues,
  Renderable,
  Please_use_the_create_table_column_utilities_to_define_columns,
  PartialGenerics,
} from './types'

import * as Visibility from './features/Visibility'
import * as Ordering from './features/Ordering'
import * as Pinning from './features/Pinning'
import * as Headers from './features/Headers'
import * as Filters from './features/Filters'
import * as Sorting from './features/Sorting'
import * as Grouping from './features/Grouping'
import * as Expanding from './features/Expanding'
import * as ColumnSizing from './features/ColumnSizing'
import * as Pagination from './features/Pagination'
import * as RowSelection from './features/RowSelection'
import { RowModel } from '.'

const features = [
  Visibility,
  Ordering,
  Pinning,
  Headers,
  Filters,
  Sorting,
  Grouping,
  Expanding,
  ColumnSizing,
  Pagination,
  RowSelection,
]

export type CoreOptions<TGenerics extends PartialGenerics> = {
  data: TGenerics['Row'][]
  columns: ColumnDef<TGenerics>[]
  state: Partial<TableState>
  onStateChange: (updater: Updater<TableState>) => void
  debugAll?: boolean
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  debugRows?: boolean
  defaultColumn?: Partial<ColumnDef<TGenerics>>
  initialState?: Partial<TableState>
  getSubRows?: (
    originalRow: TGenerics['Row'],
    index: number
  ) => TGenerics['Row'][]
  getRowId?: (
    originalRow: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
  autoResetAll?: boolean
}

export type TableCore<TGenerics extends PartialGenerics> = {
  initialState: TableState
  reset: () => void
  options: RequiredKeys<Options<TGenerics>, 'state'>
  setOptions: (newOptions: Updater<Options<TGenerics>>) => void
  getRowId: (
    _: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
  getState: () => TableState
  setState: (updater: Updater<TableState>) => void
  getDefaultColumn: () => Partial<ColumnDef<TGenerics>>
  getColumnDefs: () => ColumnDef<TGenerics>[]
  createColumn: (
    columnDef: ColumnDef<TGenerics>,
    depth: number,
    parent?: Column<TGenerics>
  ) => Column<TGenerics>
  getAllColumns: () => Column<TGenerics>[]
  getAllFlatColumns: () => Column<TGenerics>[]
  getAllFlatColumnsById: () => Record<string, Column<TGenerics>>
  getAllLeafColumns: () => Column<TGenerics>[]
  getColumn: (columnId: string) => Column<TGenerics>
  getColumnWidth: (columnId: string) => number
  getTotalWidth: () => number
  createCell: (
    row: Row<TGenerics>,
    column: Column<TGenerics>,
    value: any
  ) => Cell<TGenerics>
  createRow: (
    id: string,
    original: TGenerics['Row'] | undefined,
    rowIndex: number,
    depth: number,
    values: Record<string, any>
  ) => Row<TGenerics>
  getCoreRowModel: () => RowModel<TGenerics>
  getCoreRows: () => Row<TGenerics>[]
  getCoreFlatRows: () => Row<TGenerics>[]
  getCoreRowsById: () => Record<string, Row<TGenerics>>
  getRowModel: () => RowModel<TGenerics>
  getRows: () => Row<TGenerics>[]
  getFlatRows: () => Row<TGenerics>[]
  getRowsById: () => Record<string, Row<TGenerics>>
  getRow: (id: string) => Row<TGenerics>
  getCell: (rowId: string, columnId: string) => Cell<TGenerics>
  getTableProps: PropGetter<TableProps>
  getTableBodyProps: PropGetter<TableBodyProps>
  getRowProps: <TGetter extends Getter<RowProps>>(
    rowId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<RowProps, TGetter>
  getCellProps: <TGetter extends Getter<CellProps>>(
    rowId: string,
    columnId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<CellProps, TGetter>
  getTableWidth: () => number
  getLeftTableWidth: () => number
  getCenterTableWidth: () => number
  getRightTableWidth: () => number
}

export type CoreRow<TGenerics extends PartialGenerics> = {
  id: string
  index: number
  original?: TGenerics['Row']
  depth: number
  values: RowValues
  leafRows: Row<TGenerics>[]
  subRows: Row<TGenerics>[]
  getRowProps: PropGetter<RowProps>
  originalSubRows?: TGenerics['Row'][]
  getAllCells: () => Cell<TGenerics>[]
  getAllCellsByColumnId: () => Record<string, Cell<TGenerics>>
}

export type CoreColumnDef<TGenerics extends PartialGenerics> = {
  id: string
  accessorKey?: string & keyof TGenerics['Row']
  accessorFn?: AccessorFn<TGenerics['Row']>
  header?:
    | string
    | Renderable<{
        instance: TableInstance<TGenerics>
        header: Header<TGenerics>
        column: Column<TGenerics>
      }>
  width?: number
  minWidth?: number
  maxWidth?: number
  columns?: ColumnDef<TGenerics>[]
  footer?: Renderable<{
    instance: TableInstance<TGenerics>
    header: Header<TGenerics>
    column: Column<TGenerics>
  }>
  cell?: Renderable<{
    instance: TableInstance<TGenerics>
    row: Row<TGenerics>
    column: Column<TGenerics>
    cell: Cell<TGenerics>
    value: TGenerics['Value']
  }>
  defaultIsVisible?: boolean
  [Please_use_the_create_table_column_utilities_to_define_columns]: true
}

export type CoreColumn<TGenerics extends PartialGenerics> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TGenerics['Row']>
  columnDef: ColumnDef<TGenerics>
  getWidth: () => number
  columns: Column<TGenerics>[]
  parent?: Column<TGenerics>
  getFlatColumns: () => Column<TGenerics>[]
  getLeafColumns: () => Column<TGenerics>[]
}

export function createTableInstance<TGenerics extends PartialGenerics>(
  options: Options<TGenerics>
): TableInstance<TGenerics> {
  if (options.debugAll || options.debugTable) {
    console.info('Creating React Table Instance...')
  }

  let instance = {} as TableInstance<TGenerics>

  let listeners: (() => void)[] = []

  const defaultOptions = features.reduce((obj, feature) => {
    return Object.assign(obj, (feature as any).getDefaultOptions?.(instance))
  }, {})

  const buildOptions = (options: Options<TGenerics>) => ({
    ...defaultOptions,
    ...options,
  })

  instance.options = buildOptions(options)

  const initialState = {
    ...features.reduce((obj, feature) => {
      return Object.assign(obj, (feature as any).getInitialState?.())
    }, {}),
    ...(options.initialState ?? {}),
  } as TableState

  const finalInstance: TableInstance<TGenerics> = {
    ...instance,
    ...features.reduce((obj, feature) => {
      return Object.assign(obj, (feature as any).getInstance?.(instance))
    }, {}),
    initialState,
    reset: () => {
      instance.setState(instance.initialState)
    },
    setOptions: updater => {
      instance.options = buildOptions(
        functionalUpdate(updater, instance.options)
      )
    },

    getRowId: (_: TGenerics['Row'], index: number, parent?: Row<TGenerics>) =>
      `${parent ? [parent.id, index].join('.') : index}`,

    getState: () => {
      return instance.options.state as TableState
    },

    setState: (updater: Updater<TableState>) => {
      instance.options.onStateChange?.(updater)
    },

    getDefaultColumn: memo(
      () => [instance.options.defaultColumn],
      defaultColumn => {
        defaultColumn = (defaultColumn ?? {}) as Partial<ColumnDef<TGenerics>>

        return {
          header: (props: HeaderRenderProps<Header<TGenerics>>) =>
            props.header.column.id,
          footer: (props: HeaderRenderProps<Header<TGenerics>>) =>
            props.header.column.id,
          cell: ({ value = '' }: { value: any }): JSX.Element =>
            typeof value === 'boolean' ? value.toString() : value,
          ...features.reduce((obj, feature) => {
            return Object.assign(obj, (feature as any).getDefaultColumn?.())
          }, {}),
          ...defaultColumn,
        } as Partial<ColumnDef<TGenerics>>
      },
      {
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
        key: 'getDefaultColumn',
      }
    ),

    getColumnDefs: () => instance.options.columns,

    createColumn: (columnDef, depth: number, parent) => {
      const defaultColumn = instance.getDefaultColumn()

      let id =
        columnDef.id ??
        columnDef.accessorKey ??
        (typeof columnDef.header === 'string' ? columnDef.header : undefined)

      let accessorFn: AccessorFn<TGenerics['Row']> | undefined

      if (columnDef.accessorFn) {
        accessorFn = columnDef.accessorFn
      } else if (columnDef.accessorKey) {
        accessorFn = (originalRow?: TGenerics['Row']) =>
          (originalRow as any)[columnDef.accessorKey]
      }

      if (!id) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            columnDef.accessorFn
              ? `Columns require an id when using an accessorFn`
              : `Columns require an id when using a non-string header`
          )
        }
        throw new Error()
      }

      let column: CoreColumn<TGenerics> = {
        ...ColumnSizing.defaultColumnSizing,
        ...defaultColumn,
        ...columnDef,
        id: `${id}`,
        accessorFn,
        parent: parent as any,
        depth,
        columnDef,
        columns: [],
        getWidth: () => instance.getColumnWidth(column.id),
        getFlatColumns: memo(
          () => [true],
          () => {
            return [
              column as Column<TGenerics>,
              ...column.columns?.flatMap(d => d.getFlatColumns()),
            ]
          },
          {
            key: 'column.getFlatColumns',
            debug: () =>
              instance.options.debugAll ?? instance.options.debugColumns,
          }
        ),
        getLeafColumns: memo(
          () => [instance.getOrderColumnsFn()],
          orderColumns => {
            if (column.columns?.length) {
              let leafColumns = column.columns.flatMap(column =>
                column.getLeafColumns()
              )

              return orderColumns(leafColumns)
            }

            return [column as Column<TGenerics>]
          },
          {
            key: 'column.getLeafColumns',
            debug: () =>
              instance.options.debugAll ?? instance.options.debugColumns,
          }
        ),
      }

      column = features.reduce((obj, feature) => {
        return Object.assign(
          obj,
          (feature as any).createColumn?.(column, instance)
        )
      }, column)

      // Yes, we have to convert instance to uknown, because we know more than the compiler here.
      return column as Column<TGenerics>
    },

    getAllColumns: memo(
      () => [instance.getColumnDefs()],
      columnDefs => {
        const recurseColumns = (
          columnDefs: ColumnDef<TGenerics>[],
          parent?: Column<TGenerics>,
          depth = 0
        ): Column<TGenerics>[] => {
          return columnDefs.map(columnDef => {
            const column = instance.createColumn(columnDef, depth, parent)

            column.columns = columnDef.columns
              ? recurseColumns(columnDef.columns, column, depth + 1)
              : []

            return column
          })
        }

        return recurseColumns(columnDefs)
      },
      {
        key: 'getAllColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getAllFlatColumns: memo(
      () => [instance.getAllColumns()],
      allColumns => {
        return allColumns.flatMap(column => {
          return column.getFlatColumns()
        })
      },
      {
        key: 'getAllFlatColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getAllFlatColumnsById: memo(
      () => [instance.getAllFlatColumns()],
      flatColumns => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column
          return acc
        }, {} as Record<string, Column<TGenerics>>)
      },
      {
        key: 'getAllFlatColumnsById',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getAllLeafColumns: memo(
      () => [instance.getAllColumns(), instance.getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap(column => column.getLeafColumns())
        return orderColumns(leafColumns)
      },
      {
        key: 'getAllLeafColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getColumn: columnId => {
      const column = instance.getAllFlatColumnsById()[columnId]

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[React Table] Column with id ${columnId} does not exist.`
          )
        }
        throw new Error()
      }

      return column
    },

    getColumnWidth: (columnId: string) => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      const columnSize = instance.getState().columnSizing[column.id]

      return Math.min(
        Math.max(
          column.minWidth ?? ColumnSizing.defaultColumnSizing.minWidth,
          columnSize ?? column.width ?? ColumnSizing.defaultColumnSizing.width
        ),
        column.maxWidth ?? ColumnSizing.defaultColumnSizing.maxWidth
      )
    },

    createCell: (row, column, value) => {
      const cell: Cell<TGenerics> = {
        id: `${row.id}_${column.id}`,
        rowId: row.id,
        columnId: column.id,
        row,
        column,
        value,
        getCellProps: userProps =>
          instance.getCellProps(row.id, column.id, userProps)!,
        renderCell: () =>
          flexRender(column.cell, { instance, column, row, cell, value }),
      }

      features.forEach(feature => {
        Object.assign(
          cell,
          (feature as any).createCell?.(
            cell as Cell<TGenerics> & Grouping.GroupingCell,
            column,
            row as Row<TGenerics>,
            instance
          )
        )
      }, {})

      return cell
    },

    createRow: (id, original, rowIndex, depth, values) => {
      let row: CoreRow<TGenerics> = {
        id,
        index: rowIndex,
        original,
        depth,
        values,
        subRows: [],
        leafRows: [],
        getRowProps: userProps => instance.getRowProps(row.id, userProps)!,
        getAllCells: undefined!,
        getAllCellsByColumnId: undefined!,
      }

      row.getAllCells = memo(
        () => [instance.getAllLeafColumns()],
        leafColumns => {
          return leafColumns.map(column => {
            return instance.createCell(
              row as Row<TGenerics>,
              column,
              row.values[column.id]
            )
          })
        },
        {
          key: process.env.NODE_ENV !== 'production' ? 'row.getAllCells' : '',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      )

      row.getAllCellsByColumnId = memo(
        () => [row.getAllCells()],
        allCells => {
          return allCells.reduce((acc, cell) => {
            acc[cell.columnId] = cell
            return acc
          }, {} as Record<string, Cell<TGenerics>>)
        },
        {
          key: 'row.getAllCellsByColumnId',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      )

      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        Object.assign(row, (feature as any).createRow?.(row, instance))
      }

      return row as Row<TGenerics>
    },

    getCoreRowModel: memo(
      () => [instance.options.data],
      (
        data
      ): {
        rows: Row<TGenerics>[]
        flatRows: Row<TGenerics>[]
        rowsById: Record<string, Row<TGenerics>>
      } => {
        // Access the row model using initial columns
        const rows: Row<TGenerics>[] = []
        const flatRows: Row<TGenerics>[] = []
        const rowsById: Record<string, Row<TGenerics>> = {}

        const leafColumns = instance.getAllLeafColumns()

        const accessRow = (
          originalRow: TGenerics['Row'],
          rowIndex: number,
          depth = 0,
          parentRows: Row<TGenerics>[],
          parent?: Row<TGenerics>
        ) => {
          const id = instance.getRowId(originalRow, rowIndex, parent)

          if (!id) {
            if (process.env.NODE_ENV !== 'production') {
              throw new Error(`getRowId expected an ID, but got ${id}`)
            }
          }

          const values: Record<string, any> = {}

          for (let i = 0; i < leafColumns.length; i++) {
            const column = leafColumns[i]
            if (column && column.accessorFn) {
              values[column.id] = column.accessorFn(originalRow, rowIndex)
            }
          }

          // Make the row
          const row = instance.createRow(
            id,
            originalRow,
            rowIndex,
            depth,
            values
          )

          // Push instance row into the parentRows array
          parentRows.push(row)
          // Keep track of every row in a flat array
          flatRows.push(row)
          // Also keep track of every row by its ID
          rowsById[id] = row

          // Get the original subrows
          if (instance.options.getSubRows) {
            const originalSubRows = instance.options.getSubRows(
              originalRow,
              rowIndex
            )

            // Then recursively access them
            if (originalSubRows?.length) {
              row.originalSubRows = originalSubRows
              const subRows: Row<TGenerics>[] = []

              for (let i = 0; i < row.originalSubRows.length; i++) {
                accessRow(
                  row.originalSubRows[i] as TGenerics['Row'],
                  i,
                  depth + 1,
                  subRows,
                  row
                )
              }
              // Keep the new subRows array on the row
              row.subRows = subRows
              row.leafRows = flattenBy(subRows, d => d.leafRows)
            }
          }
        }

        for (let i = 0; i < data.length; i++) {
          accessRow(data[i] as TGenerics['Row'], i, 0, rows)
        }

        return { rows, flatRows, rowsById }
      },
      {
        key: 'getRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._notifyRowSelectionReset()
          instance._notifyFiltersReset()
        },
      }
    ),

    // The standard

    getCoreRows: () => {
      return instance.getCoreRowModel().rows
    },

    getCoreFlatRows: () => {
      return instance.getCoreRowModel().flatRows
    },

    getCoreRowsById: () => {
      return instance.getCoreRowModel().rowsById
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up

    getRowModel: () => {
      return instance.getPaginationRowModel()
    },

    getRows: () => {
      return instance.getRowModel().rows
    },

    getFlatRows: () => {
      return instance.getRowModel().flatRows
    },

    getRowsById: () => {
      return instance.getRowModel().rowsById
    },

    getRow: (id: string) => {
      const row = instance.getRowsById()[id]

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`getRow expected an ID, but got ${id}`)
        }
        throw new Error()
      }

      return row
    },

    getCell: (rowId: string, columnId: string) => {
      const row = instance.getRow(rowId)

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`[React Table] could not find row with id ${rowId}`)
        }
        throw new Error()
      }

      const cell = row.getAllCellsByColumnId()[columnId]

      if (!cell) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            `[React Table] could not find cell ${columnId} in row ${rowId}`
          )
        }
        throw new Error()
      }

      return cell
    },

    getTableProps: userProps => {
      return propGetter(
        {
          role: 'table',
        },
        userProps
      )
    },

    getTableBodyProps: userProps => {
      return propGetter(
        {
          role: 'rowgroup',
        },
        userProps
      )
    },

    getRowProps: (rowId, userProps) => {
      const row = instance.getRow(rowId)
      if (!row) {
        return
      }

      return propGetter(
        {
          key: row.id,
          role: 'row',
        },
        userProps
      )
    },

    getCellProps: (rowId, columnId, userProps) => {
      const cell = instance.getCell(rowId, columnId)

      if (!cell) {
        return
      }

      return propGetter(
        {
          key: cell.id,
          role: 'gridcell',
        },
        userProps
      )
    },

    getTableWidth: () =>
      instance.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getWidth()
      }, 0) ?? 0,
    getLeftTableWidth: () =>
      instance.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getWidth()
      }, 0) ?? 0,
    getCenterTableWidth: () =>
      instance.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getWidth()
      }, 0) ?? 0,
    getRightTableWidth: () =>
      instance.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getWidth()
      }, 0) ?? 0,
  }

  instance = Object.assign(instance, finalInstance)

  return instance
}
