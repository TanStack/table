import {
  Cell,
  TableGenerics,
  TableInstance,
  Row,
  Column,
  CoreCell,
  Getter,
  CellProps,
  PropGetterValue,
  RowProps,
  RowModel,
  RowValues,
  PropGetter,
} from '../types'
import { flattenBy, memo, propGetter } from '../utils'

export type CoreRow<TGenerics extends TableGenerics> = {
  id: string
  index: number
  original?: TGenerics['Row']
  depth: number
  values: RowValues
  subRows: Row<TGenerics>[]
  getLeafRows: () => Row<TGenerics>[]
  getRowProps: PropGetter<RowProps>
  originalSubRows?: TGenerics['Row'][]
}

export type RowsOptions<TGenerics extends TableGenerics> = {
  getCoreRowModel: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
  getSubRows?: (
    originalRow: TGenerics['Row'],
    index: number
  ) => TGenerics['Row'][]
  getRowId?: (
    originalRow: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
}

export type RowsInstance<TGenerics extends TableGenerics> = {
  getRowId: (
    _: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
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
  getRowProps: <TGetter extends Getter<RowProps>>(
    rowId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<RowProps, TGetter>
}

//

export const Rows = {
  // createRow: <TGenerics extends TableGenerics>(
  //   row: Row<TGenerics>,
  //   instance: TableInstance<TGenerics>
  // ): CellsRow<TGenerics> => {
  //   return {}
  // },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): RowsInstance<TGenerics> => {
    return {
      getRowId: (
        row: TGenerics['Row'],
        index: number,
        parent?: Row<TGenerics>
      ) =>
        instance.options.getRowId?.(row, index, parent) ??
        `${parent ? [parent.id, index].join('.') : index}`,
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
        }

        for (let i = 0; i < instance._features.length; i++) {
          const feature = instance._features[i]
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
    }
  },
}
