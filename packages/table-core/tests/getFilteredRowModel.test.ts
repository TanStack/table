import { describe, expect, it } from 'vitest'
import {
  createColumnHelper,
  createTable,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
} from '../src'

type TestRow = {
  a: string
  b: string
}

describe('#getFilteredRowModel', () => {
  it('clears columnFiltersMeta between filter runs so removed filter meta does not persist', () => {
    const data: TestRow[] = [
      { a: 'x', b: 'y' },
      { a: 'x', b: 'z' },
    ]

    const columnHelper = createColumnHelper<TestRow>()
    const columns = [
      columnHelper.accessor('a', {
        id: 'a',
        filterFn: (row, columnId, filterValue, addMeta) => {
          addMeta?.({ from: 'a' })
          return row.getValue<string>(columnId) === filterValue
        },
      }),
      columnHelper.accessor('b', {
        id: 'b',
        filterFn: (row, columnId, filterValue) => {
          return row.getValue<string>(columnId) === filterValue
        },
      }),
    ]

    let state: any = {
      columnFilters: [],
      globalFilter: undefined,
    }

    // Create a tiny state container so `table.setColumnFilters` updates `table.options.state`
    let table: ReturnType<typeof createTable<TestRow>>
    table = createTable<TestRow>({
      data,
      columns,
      renderFallbackValue: '',
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state,
      onStateChange: (updater) => {
        state = functionalUpdate(updater, state)
        table.setOptions((prev) => ({ ...prev, state }))
      },
    })

    table.setColumnFilters([{ id: 'a', value: 'x' }])
    const first = table.getFilteredRowModel().flatRows[0]!
    expect(first.columnFiltersMeta.a).toEqual({ from: 'a' })

    // Switch to a different filter that does not write meta
    table.setColumnFilters([{ id: 'b', value: 'y' }])
    const second = table.getFilteredRowModel().flatRows[0]!
    expect(second.columnFiltersMeta.a).toBeUndefined()
  })
})

