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
  ReactTable,
  RowValues,
  Renderable,
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
import { RowModel } from '.'

// import './features/withColumnResizing';
// import './features/withPagination';
// import './features/withRowSelection';

export type CoreOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  data: TData[]
  columns: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  debug?: boolean
  defaultColumn?: Partial<
    ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  initialState?: Partial<TableState>
  state?: Partial<TableState>
  getSubRows?: (originalRow: TData, index: number) => TData[]
  getRowId?: (
    originalRow: TData,
    index: number,
    parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => string
  onStateChange?: (newState: TableState) => void
}

export type TableCore<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> =
  {
    rerender: () => void
    initialState: TableState
    internalState: TableState
    reset: () => void
    options: RequiredKeys<
      Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      'state'
    >
    updateOptions: (
      newOptions: Options<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >
    ) => void
    getRowId: (
      _: TData,
      index: number,
      parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    ) => string
    getState: () => TableState
    setState: (updater: Updater<TableState>) => void
    getDefaultColumn: () => Partial<
      ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    >
    getColumnDefs: () => ColumnDef<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    createColumn: (
      columnDef: ColumnDef<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >,
      depth: number,
      parent?: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    ) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    getAllColumns: () => Column<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getAllFlatColumns: () => Column<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getAllFlatColumnsById: () => Record<
      string,
      Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    >
    getAllLeafColumns: () => Column<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getColumn: (
      columnId: string
    ) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    getColumnWidth: (columnId: string) => number
    getTotalWidth: () => number
    createCell: (
      row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      value: any
    ) => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    createRow: (
      id: string,
      original: TData | undefined,
      rowIndex: number,
      depth: number,
      values: Record<string, any>
    ) => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    getCoreRowModel: () => RowModel<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >
    getCoreRows: () => Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getCoreFlatRows: () => Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getCoreRowsById: () => Record<
      string,
      Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    >
    getRowModel: () => RowModel<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >
    getRows: () => Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getFlatRows: () => Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
    getRowsById: () => Record<
      string,
      Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    >
    getRow: (
      id: string
    ) => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    getCell: (
      rowId: string,
      columnId: string
    ) => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
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

export type CoreRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
  id: string
  index: number
  original?: TData
  depth: number
  values: RowValues
  leafRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  subRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  getRowProps: PropGetter<RowProps>
  originalSubRows?: TData[]
  getAllCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getAllCellsByColumnId: () => Record<
    string,
    Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
}

export type CoreColumnDef<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = (
  | {
      accessorFn: AccessorFn<TData>
      id: string
      accessorKey?: never
      header?:
        | string
        | Renderable<{
            header: Header<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
            column: Column<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
          }>
    }
  | {
      accessorKey: string & keyof TData
      id?: string
      accessorFn?: never
      header?:
        | string
        | Renderable<{
            header: Header<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
            column: Column<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
          }>
    }
  | {
      id: string
      accessorKey?: never
      accessorFn?: never
      header?:
        | string
        | Renderable<{
            header: Header<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
            column: Column<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >
          }>
    }
  | {
      header: string
      id?: string
      accessorKey?: never
      accessorFn?: never
    }
) & {
  __generated: true
  width?: number
  minWidth?: number
  maxWidth?: number
  columns?: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  footer?: Renderable<{
    header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  }>
  cell?: Renderable<{
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    cell: Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    value: TValue
  }>
  defaultIsVisible?: boolean
}

export type CoreColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TData>
  columnDef: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  getWidth: () => number
  columns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  parent?: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  getFlatColumns: () => Column<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getLeafColumns: () => Column<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
}

export function createTableInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rerender: () => void
): ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  if (process.env.NODE_ENV !== 'production' && options.debug) {
    console.info('Creating React Table Instance...')
  }

  let instance = {} as ReactTable<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >

  const defaultOptions = {
    ...Visibility.getDefaultOptions(instance),
    ...Ordering.getDefaultOptions(instance),
    ...Pinning.getDefaultOptions(instance),
    ...Filters.getDefaultOptions(instance),
    ...Sorting.getDefaultOptions(instance),
    ...Grouping.getDefaultOptions(instance),
    ...Expanding.getDefaultOptions(instance),
    ...ColumnSizing.getDefaultOptions(instance),
  }

  const defaultState = {}

  const buildOptions = (
    options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => ({
    state: defaultState,
    ...defaultOptions,
    ...options,
  })

  instance.options = buildOptions(options)

  const initialState = {
    ...Visibility.getInitialState(),
    ...Ordering.getInitialState(),
    ...Pinning.getInitialState(),
    ...Filters.getInitialState(),
    ...Sorting.getInitialState(),
    ...Grouping.getInitialState(),
    ...Expanding.getInitialState(),
    ...ColumnSizing.getInitialState(),
    ...(options.initialState ?? {}),
  }

  const finalInstance: ReactTable<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  > = {
    ...instance,
    ...Visibility.getInstance(instance),
    ...Ordering.getInstance(instance),
    ...Pinning.getInstance(instance),
    ...Headers.getInstance(instance),
    ...Filters.getInstance(instance),
    ...Sorting.getInstance(instance),
    ...Grouping.getInstance(instance),
    ...Expanding.getInstance(instance),
    ...ColumnSizing.getInstance(instance),
    rerender,
    initialState,
    internalState: initialState,
    reset: () => {
      instance.setState(instance.initialState)
    },
    updateOptions: newOptions => {
      instance.options = buildOptions(newOptions)
    },

    getRowId: (
      _: TData,
      index: number,
      parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    ) => `${parent ? [parent.id, index].join('.') : index}`,

    getState: () => {
      return {
        ...instance.internalState,
        ...instance.options.state,
      }
    },

    setState: (
      updater: Updater<TableState>,
      shouldRerender: boolean = true
    ) => {
      const newState = functionalUpdate(updater, instance.internalState)
      const onStateChange = instance.options.onStateChange

      instance.internalState = newState

      if (onStateChange) {
        onStateChange(newState)
        return
      }

      if (shouldRerender) {
        instance.rerender()
      }
    },

    getDefaultColumn: memo(
      () => [instance.options.defaultColumn],
      defaultColumn => {
        defaultColumn = (defaultColumn ?? {}) as Partial<
          ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
        >

        return {
          header: (
            props: HeaderRenderProps<
              Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
            >
          ) => props.header.column.id,
          footer: (
            props: HeaderRenderProps<
              Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
            >
          ) => props.header.column.id,
          cell: ({ value = '' }: { value: any }): JSX.Element =>
            typeof value === 'boolean' ? value.toString() : value,
          ...Visibility.getDefaultColumn(),
          ...Filters.getDefaultColumn(),
          ...Sorting.getDefaultColumn(),
          ...Grouping.getDefaultColumn(),
          ...defaultColumn,
        } as Partial<
          ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
        >
      },
      'getDefaultColumn',
      instance.options.debug
    ),

    getColumnDefs: () => instance.options.columns,

    createColumn: (columnDef, depth: number, parent) => {
      const defaultColumn = instance.getDefaultColumn()

      let id =
        columnDef.id ??
        columnDef.accessorKey ??
        (typeof columnDef.header === 'string' ? columnDef.header : undefined)

      let accessorFn: AccessorFn<TData> | undefined

      if (columnDef.accessorFn) {
        accessorFn = columnDef.accessorFn
      } else if (columnDef.accessorKey) {
        accessorFn = (originalRow?: TData) =>
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

      let column: CoreColumn<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      > = {
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
              column as Column<
                TData,
                TValue,
                TFilterFns,
                TSortingFns,
                TAggregationFns
              >,
              ...column.columns?.flatMap(d => d.getFlatColumns()),
            ]
          },
          'column.getFlatColumns',
          instance.options.debug
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

            return [
              column as Column<
                TData,
                TValue,
                TFilterFns,
                TSortingFns,
                TAggregationFns
              >,
            ]
          },
          'column.getLeafColumns',
          instance.options.debug
        ),
      }

      column = Object.assign(
        column,
        Visibility.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        ),
        Pinning.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        ),
        Filters.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        ),
        Sorting.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        ),
        Grouping.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        ),
        ColumnSizing.createColumn(
          column as Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          instance
        )
      )

      // Yes, we have to convert instance to uknown, because we know more than the compiler here.
      return column as Column<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >
    },

    getAllColumns: memo(
      () => [instance.getColumnDefs()],
      columnDefs => {
        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Building Columns...')

        const recurseColumns = (
          columnDefs: ColumnDef<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >[],
          parent?: Column<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          depth = 0
        ): Column<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >[] => {
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
      'getAllColumns',
      instance.options.debug
    ),

    getAllFlatColumns: memo(
      () => [instance.getAllColumns()],
      allColumns => {
        return allColumns.flatMap(column => {
          return column.getFlatColumns()
        })
      },
      'getAllFlatColumns',
      instance.options.debug
    ),

    getAllFlatColumnsById: memo(
      () => [instance.getAllFlatColumns()],
      flatColumns => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column
          return acc
        }, {} as Record<string, Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>)
      },
      'getAllFlatColumnsById',
      instance.options.debug
    ),

    getAllLeafColumns: memo(
      () => [instance.getAllColumns(), instance.getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap(column => column.getLeafColumns())
        return orderColumns(leafColumns)
      },
      'getAllLeafColumns',
      instance.options.debug
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
      const cell: Cell<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      > = {
        id: `${row.id}_${column.id}`,
        rowId: row.id,
        columnId: column.id,
        row,
        column,
        value,
        getCellProps: userProps =>
          instance.getCellProps(row.id, column.id, userProps)!,
        renderCell: () => flexRender(column.cell, { column, cell, value }),
      }

      Object.assign(cell, {
        ...Grouping.createCell(
          cell as Cell<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          > &
            Grouping.GroupingCell,
          column,
          row as Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
          instance
        ),
      })

      return cell
    },

    createRow: (id, original, rowIndex, depth, values) => {
      let row: CoreRow<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      > = {
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
              row as Row<
                TData,
                TValue,
                TFilterFns,
                TSortingFns,
                TAggregationFns
              >,
              column,
              row.values[column.id]
            )
          })
        },
        process.env.NODE_ENV !== 'production' ? 'row.getAllCells' : '',
        instance.options.debug
      )

      row.getAllCellsByColumnId = memo(
        () => [row.getAllCells()],
        allCells => {
          return allCells.reduce((acc, cell) => {
            acc[cell.columnId] = cell
            return acc
          }, {} as Record<string, Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>)
        },
        'row.getAllCellsByColumnId',
        instance.options.debug
      )

      row = Object.assign(
        row,
        Headers.createRow(
          row as Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
          instance
        ),
        Grouping.createRow(
          row as Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
          instance
        ),
        Expanding.createRow(
          row as Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
          instance
        )
      )

      return row as Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    },

    getCoreRowModel: memo(
      () => [instance.options.data],
      (
        data
      ): {
        rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
        flatRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
        rowsById: Record<
          string,
          Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
        >
      } => {
        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Accessing...')

        // Auto-reset data-dependent states if configured
        if (
          instance.options.autoResetColumnFilters &&
          // @ts-ignore
          instance.getRowModelNonFirst
        ) {
          instance.resetColumnFilters()
        }

        if (
          instance.options.autoResetGlobalFilter &&
          // @ts-ignore
          instance.getRowModelNonFirst
        ) {
          instance.resetGlobalFilter()
        }

        if (
          instance.options.autoResetSorting &&
          // @ts-ignore
          instance.getRowModelNonFirst
        ) {
          instance.resetSorting()
        }

        if (
          instance.options.autoResetGrouping &&
          // @ts-ignore
          instance.getRowModelNonFirst
        ) {
          instance.resetGrouping()
        }

        if (
          instance.options.autoResetExpanded &&
          // @ts-ignore
          instance.getRowModelNonFirst
        ) {
          instance.resetExpanded()
        }

        // @ts-ignore
        instance.getRowModelNonFirst = true

        // Access the row model using initial columns
        const rows: Row<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >[] = []
        const flatRows: Row<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >[] = []
        const rowsById: Record<
          string,
          Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
        > = {}

        const leafColumns = instance.getAllLeafColumns()

        const accessRow = (
          originalRow: TData,
          rowIndex: number,
          depth = 0,
          parentRows: Row<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >[],
          parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
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
              const subRows: Row<
                TData,
                TValue,
                TFilterFns,
                TSortingFns,
                TAggregationFns
              >[] = []

              for (let i = 0; i < row.originalSubRows.length; i++) {
                accessRow(
                  row.originalSubRows[i] as TData,
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
          accessRow(data[i] as TData, i, 0, rows)
        }

        return { rows, flatRows, rowsById }
      },
      'getRowModel',
      instance.options.debug
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
      return instance.getExpandedRowModel()
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

  return Object.assign(instance, finalInstance)
}
