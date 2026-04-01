import { describe, expect, it, vi } from 'vitest'
import {
  ColumnDef,
  createColumnHelper,
  createTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '../src'
import { makeData, Person } from './makeTestData'

type personKeys = keyof Person
type PersonColumn = ColumnDef<Person, string | number | Person[] | undefined>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<Person>()
  const person = people[0]
  return Object.keys(person!).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

describe('RowPagination', () => {
  describe('setPagination', () => {
    it('should not call onPaginationChange when state has not changed', () => {
      const data = makeData(10)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPagination({ pageIndex: 0, pageSize: 10 })

      expect(onPaginationChange).not.toHaveBeenCalled()
    })

    it('should call onPaginationChange when pageIndex changes', () => {
      const data = makeData(20)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPagination({ pageIndex: 1, pageSize: 10 })

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })

    it('should call onPaginationChange when pageSize changes', () => {
      const data = makeData(20)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPagination({ pageIndex: 0, pageSize: 20 })

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })

    it('should not call onPaginationChange when functional updater returns same state', () => {
      const data = makeData(10)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPagination((old) => ({ ...old }))

      expect(onPaginationChange).not.toHaveBeenCalled()
    })
  })

  describe('setPageIndex', () => {
    it('should not call onPaginationChange when pageIndex is unchanged', () => {
      const data = makeData(10)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPageIndex(0)

      expect(onPaginationChange).not.toHaveBeenCalled()
    })

    it('should call onPaginationChange when pageIndex changes', () => {
      const data = makeData(20)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.setPageIndex(1)

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('resetPageIndex', () => {
    it('should not call onPaginationChange when page index is already at initial value', () => {
      const data = makeData(10)
      const columns = generateColumns(data)
      const onPaginationChange = vi.fn()

      const table = createTable<Person>({
        onPaginationChange,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })

      table.resetPageIndex()

      expect(onPaginationChange).not.toHaveBeenCalled()
    })
  })
})
