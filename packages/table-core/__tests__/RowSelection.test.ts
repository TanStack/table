import {
  ColumnDef,
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '../src'
import * as RowSelection from '../src/features/RowSelection'
import { makeData, Person } from './makeTestData'

type personKeys = keyof Person
type PersonColumn = ColumnDef<Person, string | number | Person[] | undefined>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<Person>()
  const person = people[0]
  return Object.keys(person).map(key => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

describe('RowSelection', () => {
  describe('isSubRowSelected', () => {
    it('should return false if there are no sub-rows', () => {
      const data = makeData(3)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {},
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual(false)
    })

    it('should return false if no sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {},
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual(false)
    })

    it('should return some if some sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('some')
    })

    it('should return all if all sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
            '0.1': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('all')
    })
    it('should return all if all selectable sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: row => row.index === 0, // only first row is selectable (of 2 sub-rows)
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true, // first sub-row
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('all')
    })
    it('should return some when some nested sub-rows are selected', () => {
      const data = makeData(3, 2, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0.0': true, // first nested sub-row
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('some')
    })
  })
})
