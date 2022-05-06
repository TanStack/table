import {
  Cell,
  Column,
  Header,
  TableGenerics,
  TableInstance,
  Row,
  AccessorFn,
  ColumnDef,
  Renderable,
  HeaderRenderProps,
} from '../types'
import { memo } from '../utils'

export type CoreColumnDefType = 'data' | 'display' | 'group'

export type CoreColumnDef<TGenerics extends TableGenerics> = {
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

export type CoreColumn<TGenerics extends TableGenerics> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TGenerics['Row']>
  columnDef: ColumnDef<TGenerics>
  columnDefType: CoreColumnDefType
  columns: Column<TGenerics>[]
  parent?: Column<TGenerics>
  getFlatColumns: () => Column<TGenerics>[]
  getLeafColumns: () => Column<TGenerics>[]
}

export type ColumnsOptions<TGenerics extends TableGenerics> = {
  columns: ColumnDef<TGenerics>[]
  defaultColumn?: Partial<ColumnDef<TGenerics>>
}

export type ColumnsInstance<TGenerics extends TableGenerics> = {
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
}

//

export const Columns = {
  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnsInstance<TGenerics> => {
    return {
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
            ...instance._features.reduce((obj, feature) => {
              return Object.assign(obj, feature.getDefaultColumn?.())
            }, {}),
            ...defaultColumn,
          } as Partial<ColumnDef<TGenerics>>
        },
        {
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
          key: process.env.NODE_ENV === 'development' && 'getDefaultColumn',
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
          getFlatColumns: memo(
            () => [true],
            () => {
              return [
                column as Column<TGenerics>,
                ...column.columns?.flatMap(d => d.getFlatColumns()),
              ]
            },
            {
              key:
                process.env.NODE_ENV === 'production' &&
                'column.getFlatColumns',
              debug: () =>
                instance.options.debugAll ?? instance.options.debugColumns,
            }
          ),
          getLeafColumns: memo(
            () => [instance._getOrderColumnsFn()],
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
              key:
                process.env.NODE_ENV === 'production' &&
                'column.getLeafColumns',
              debug: () =>
                instance.options.debugAll ?? instance.options.debugColumns,
            }
          ),
        }

        column = instance._features.reduce((obj, feature) => {
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
          key: process.env.NODE_ENV === 'development' && 'getAllColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
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
          key: process.env.NODE_ENV === 'development' && 'getAllFlatColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
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
          key:
            process.env.NODE_ENV === 'development' && 'getAllFlatColumnsById',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),

      getAllLeafColumns: memo(
        () => [instance.getAllColumns(), instance._getOrderColumnsFn()],
        (allColumns, orderColumns) => {
          let leafColumns = allColumns.flatMap(column =>
            column.getLeafColumns()
          )
          return orderColumns(leafColumns)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getAllLeafColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
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
    }
  },
}
