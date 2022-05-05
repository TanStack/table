import { TableInstance, RowModel, TableGenerics, Row } from '../types'
import { incrementalMemo } from '../utils'

export function getFilteredRowModelAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [
        instance.getState().columnFilters,
        instance.getPreFilteredRowModel(),
      ],
      (_sorting, rowModel): RowModel<TGenerics> => {
        return {
          rows: rowModel.rows.slice(),
          flatRows: [],
          rowsById: rowModel.rowsById,
        }
      },
      (columnFilters, rowModel) => rowModelRef => scheduleTask => {
        // TODO: Figure out how to do scheduled filtering
        // The trick will be batching those tasks in a way
        // that makes them fast. JS work loops don't tend to do well with
        // a high number of tasks that do one thing. Instead, shoot for each
        // task to have a few thousand opts (or whatever amount is generally
        // fast for most devices).
        throw new Error('')
      },
      {
        key:
          process.env.NODE_ENV === 'production' && 'getFilteredRowModelAsync',
        initialSync: opts?.initialSync,
        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            columnFiltersProgress: progress,
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance.queue(() => {
            instance._autoResetPageIndex()
          })
        },
      }
    )
}
