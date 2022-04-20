import {
  flattenBy,
  functionalUpdate,
  propGetter,
  memo,
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
  PartialGenerics,
  CoreCell,
  Renderable,
  UseRenderer,
  RowModel,
  TableFeature,
  AnyGenerics,
} from './types'

import { ColumnSizing } from './features/ColumnSizing'
import { Expanding } from './features/Expanding'
import { Filters } from './features/Filters'
import { Grouping } from './features/Grouping'
import { Ordering } from './features/Ordering'
import { Pagination } from './features/Pagination'
import { Pinning } from './features/Pinning'
import { RowSelection } from './features/RowSelection'
import { Sorting } from './features/Sorting'
import { Visibility } from './features/Visibility'
import { Headers } from './features/Headers'
import { mean } from './aggregationTypes'

const features: TableFeature[] = [
  Headers,
  Visibility,
  Ordering,
  Pinning,
  Filters,
  Sorting,
  Grouping,
  Expanding,
  Pagination,
  RowSelection,
  ColumnSizing,
]

export type CoreTableState = {
  coreProgress: number
}

export type CoreOptions<TGenerics extends AnyGenerics> = {
  data: TGenerics['Row'][]
  columns: ColumnDef<TGenerics>[]
  state: Partial<TableState>
  onStateChange: (updater: Updater<TableState>) => void
  render: TGenerics['Render']
  getCoreRowModel: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
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
  mergeOptions?: (
    defaultOptions: TableFeature,
    options: Partial<Options<TGenerics>>
  ) => Options<TGenerics>
  meta?: TGenerics['TableMeta']
}

export type TableCore<TGenerics extends AnyGenerics> = {
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
  _getCoreRowModel?: () => RowModel<TGenerics>
  getRowModel: () => RowModel<TGenerics>
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
  render: <TProps>(
    template: Renderable<TGenerics, TProps>,
    props: TProps
  ) => string | null | ReturnType<UseRenderer<TGenerics>>
  getOverallProgress: () => number
}

export type CoreRow<TGenerics extends AnyGenerics> = {
  id: string
  index: number
  original?: TGenerics['Row']
  depth: number
  values: RowValues
  subRows: Row<TGenerics>[]
  getLeafRows: () => Row<TGenerics>[]
  getRowProps: PropGetter<RowProps>
  originalSubRows?: TGenerics['Row'][]
  getAllCells: () => Cell<TGenerics>[]
  getAllCellsByColumnId: () => Record<string, Cell<TGenerics>>
}

export type CoreColumnDef<TGenerics extends AnyGenerics> = {
  id: string
  accessorKey?: string & keyof TGenerics['Row']
  accessorFn?: AccessorFn<TGenerics['Row']>
  columns?: ColumnDef<TGenerics>[]
  header?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }
  >
  footer?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }
  >
  cell?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      row: Row<TGenerics>
      column: Column<TGenerics>
      cell: Cell<TGenerics>
      value: TGenerics['Value']
    }
  >
  meta?: TGenerics['ColumnMeta']
}
// & GeneratedProperties<true>

export type CoreColumnDefType = 'data' | 'display' | 'group'

export type CoreColumn<TGenerics extends AnyGenerics> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TGenerics['Row']>
  columnDef: ColumnDef<TGenerics>
  columnDefType: CoreColumnDefType
  getWidth: () => number
  columns: Column<TGenerics>[]
  parent?: Column<TGenerics>
  getFlatColumns: () => Column<TGenerics>[]
  getLeafColumns: () => Column<TGenerics>[]
}

export function createTableInstance<TGenerics extends AnyGenerics>(
  options: Options<TGenerics>
): TableInstance<TGenerics> {
  if (options.debugAll || options.debugTable) {
    console.info('Creating Table Instance...')
  }

  let instance = {} as TableInstance<TGenerics>

  const defaultOptions = features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(instance))
  }, {})

  const buildOptions = (options: Options<TGenerics>) => ({
    ...defaultOptions,
    ...options,
  })

  instance.options = buildOptions(options)

  const coreInitialState: CoreTableState = {
    coreProgress: 1,
  }

  const initialState = {
    ...coreInitialState,
    ...features.reduce((obj, feature) => {
      return Object.assign(obj, feature.getInitialState?.())
    }, {}),
    ...(options.initialState ?? {}),
  } as TableState

  const finalInstance: TableInstance<TGenerics> = {
    ...instance,
    ...features.reduce((obj, feature) => {
      return Object.assign(obj, feature.getInstance?.(instance))
    }, {}),
    initialState,
    reset: () => {
      instance.setState(instance.initialState)
    },
    setOptions: updater => {
      const newOptions = functionalUpdate(updater, instance.options)
      if (instance.options.mergeOptions) {
        instance.options = instance.options.mergeOptions(
          defaultOptions,
          newOptions
        )
      } else {
        instance.options = buildOptions(newOptions)
      }
    },
    render: (template, props) => {
      if (typeof instance.options.render === 'function') {
        return instance.options.render(template, props)
      }

      if (typeof template === 'function') {
        return (template as Function)(props)
      }

      return template
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
            return Object.assign(obj, feature.getDefaultColumn?.())
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

    createColumn: (
      columnDef: ColumnDef<TGenerics> & { columnDefType?: CoreColumnDefType },
      depth: number,
      parent
    ) => {
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
        ...defaultColumn,
        ...columnDef,
        id: `${id}`,
        accessorFn,
        parent: parent as any,
        depth,
        columnDef,
        columnDefType: columnDef.columnDefType as CoreColumnDefType,
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
        return Object.assign(obj, feature.createColumn?.(column, instance))
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
          console.warn(`[Table] Column with id ${columnId} does not exist.`)
        }
        throw new Error()
      }

      return column
    },

    createCell: (row, column, value) => {
      const cell: CoreCell<TGenerics> = {
        id: `${row.id}_${column.id}`,
        rowId: row.id,
        columnId: column.id,
        row,
        column,
        value,
        getCellProps: userProps =>
          instance.getCellProps(row.id, column.id, userProps)!,
        renderCell: () =>
          column.cell
            ? instance.render(column.cell, {
                instance,
                column,
                row,
                cell: cell as Cell<TGenerics>,
                value,
              })
            : null,
      }

      features.forEach(feature => {
        Object.assign(
          cell,
          feature.createCell?.(
            cell as Cell<TGenerics>,
            column,
            row as Row<TGenerics>,
            instance
          )
        )
      }, {})

      return cell as Cell<TGenerics>
    },

    createRow: (id, original, rowIndex, depth, values) => {
      let row: CoreRow<TGenerics> = {
        id,
        index: rowIndex,
        original,
        depth,
        values,
        subRows: [],
        getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
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
        Object.assign(row, feature.createRow?.(row, instance))
      }

      return row as Row<TGenerics>
    },

    getCoreRowModel: () => {
      if (!instance._getCoreRowModel) {
        instance._getCoreRowModel = instance.options.getCoreRowModel(instance)
      }

      return instance._getCoreRowModel()
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up

    getRowModel: () => {
      return instance.getPaginationRowModel()
    },

    getRow: (id: string) => {
      const row = instance.getRowModel().rowsById[id]

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
          throw new Error(`[Table] could not find row with id ${rowId}`)
        }
        throw new Error()
      }

      const cell = row.getAllCellsByColumnId()[columnId]

      if (!cell) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            `[Table] could not find cell ${columnId} in row ${rowId}`
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

    getOverallProgress: () => {
      const { coreProgress, columnFiltersProgress, globalFilterProgress } =
        instance.getState()

      return mean(() =>
        [coreProgress, columnFiltersProgress, globalFilterProgress].filter(
          d => d < 1
        )
      ) as number
    },
  }

  instance = Object.assign(instance, finalInstance)

  return instance
}
