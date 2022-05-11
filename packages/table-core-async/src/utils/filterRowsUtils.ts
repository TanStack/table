import { TableGenerics, Row, RowModel, TableInstance } from 'react-table'
import { batchReduce } from '../utils'

export function filterRowsAsync<TGenerics extends TableGenerics>(
  prevRowModel: RowModel<TGenerics>,
  count: number,
  scheduleTask: (task: () => void) => void,
  filterRow: (row: Row<TGenerics>) => any,
  instance: TableInstance<TGenerics>
) {
  if (instance.options.filterFromLeafRows) {
    return filterRowModelFromLeafsAsync(
      prevRowModel,
      count,
      scheduleTask,
      filterRow,
      instance
    )
  }

  return filterRowModelFromRootAsync(
    prevRowModel,
    count,
    scheduleTask,
    filterRow,
    instance
  )
}

export async function filterRowModelFromLeafsAsync<
  TGenerics extends TableGenerics
>(
  prevRowModel: RowModel<TGenerics>,
  count: number,
  scheduleTask: (task: () => void) => void,
  filterRow: (row: Row<TGenerics>) => any,
  instance: TableInstance<TGenerics>
): Promise<RowModel<TGenerics>> {
  const rowModel: RowModel<TGenerics> = {
    rows: prevRowModel.rows,
    flatRows: [],
    rowsById: {},
  }

  let subRows
  let pass

  // Filters top level and nested rows
  const recurseRows = async (
    rows: Row<TGenerics>[]
  ): Promise<Row<TGenerics>[]> => {
    return batchReduce(
      rows,
      count,
      scheduleTask,
      [] as Row<TGenerics>[],
      async (ref, row) => {
        if (row.subRows?.length) {
          subRows = await recurseRows(row.subRows)

          if (!subRows.length) {
            return
          }

          row = instance.createRow(row.id, row.original, row.index, row.depth)
          row.subRows = subRows
        }

        pass = filterRow(row)

        if (pass) {
          rowModel.rowsById[row.id] = row
          rowModel.flatRows.push(row)
          ref.current.push(row)
        }
      }
    )
  }

  rowModel.rows = await recurseRows(rowModel.rows)

  return rowModel
}

export async function filterRowModelFromRootAsync<
  TGenerics extends TableGenerics
>(
  prevRowModel: RowModel<TGenerics>,
  count: number,
  scheduleTask: (task: () => void) => void,
  filterRow: (row: Row<TGenerics>) => any,
  instance: TableInstance<TGenerics>
) {
  const rowModel: RowModel<TGenerics> = {
    rows: prevRowModel.rows,
    flatRows: [],
    rowsById: {},
  }

  let pass
  let rowClone

  // Filters top level and nested rows
  const recurseRows = async (
    rows: Row<TGenerics>[]
  ): Promise<Row<TGenerics>[]> => {
    return batchReduce(
      rows,
      count,
      scheduleTask,
      [] as Row<TGenerics>[],
      async (ref, row) => {
        pass = filterRow(row)

        if (pass) {
          rowModel.rowsById[row.id] = row
          rowModel.flatRows.push(row)

          if (row.subRows?.length) {
            rowClone = instance.createRow(
              row.id,
              row.original,
              row.index,
              row.depth
            )

            rowClone.subRows = await recurseRows(row.subRows)

            ref.current.push(rowClone)
          }
          ref.current.push(row)
        }
      }
    )
  }

  rowModel.rows = await recurseRows(rowModel.rows)

  return rowModel
}
