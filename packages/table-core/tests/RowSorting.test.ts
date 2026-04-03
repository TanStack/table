import { describe, expect, it } from 'vitest'
import { createTable, getCoreRowModel, getSortedRowModel } from '../src'
import type { Person } from './makeTestData'
import { makeData } from './makeTestData'

const defaultData = makeData(3)

const defaultColumns = [
  {
    accessorKey: 'firstName' as keyof Person,
    id: 'firstName',
  },
  {
    accessorKey: 'lastName' as keyof Person,
    id: 'lastName',
  },
  {
    accessorKey: 'age' as keyof Person,
    id: 'age',
  },
  {
    accessorKey: 'visits' as keyof Person,
    id: 'visits',
  },
]

describe('RowSorting', () => {
  it('should clear multi-sort when clicking column without shift key', () => {
    let sorting = [
      { id: 'firstName', desc: false },
      { id: 'lastName', desc: true },
    ]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    expect(sorting).toHaveLength(2)
    expect(sorting[0]).toEqual({ id: 'firstName', desc: false })
    expect(sorting[1]).toEqual({ id: 'lastName', desc: true })

    const ageColumn = table.getColumn('age')
    ageColumn?.toggleSorting(false, false)

    expect(sorting).toHaveLength(1)
    expect(sorting[0]).toEqual({ id: 'age', desc: false })
  })

  it('should maintain multi-sort when clicking column with shift key', () => {
    let sorting = [
      { id: 'firstName', desc: false },
      { id: 'lastName', desc: true },
    ]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    const ageColumn = table.getColumn('age')
    ageColumn?.toggleSorting(false, true)

    expect(sorting).toHaveLength(3)
    expect(sorting[0]).toEqual({ id: 'firstName', desc: false })
    expect(sorting[1]).toEqual({ id: 'lastName', desc: true })
    expect(sorting[2]).toEqual({ id: 'age', desc: false })
  })

  it('should toggle sort direction when clicking same column without shift key in single sort mode', () => {
    let sorting = [{ id: 'firstName', desc: false }]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    const firstNameColumn = table.getColumn('firstName')
    firstNameColumn?.toggleSorting(undefined, false)

    expect(sorting).toHaveLength(1)
    expect(sorting[0]).toEqual({ id: 'firstName', desc: true })
  })

  it('should replace multi-sort when clicking different column without shift key', () => {
    let sorting = [
      { id: 'firstName', desc: false },
      { id: 'lastName', desc: true },
      { id: 'age', desc: false },
    ]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    const visitsColumn = table.getColumn('visits')
    visitsColumn?.toggleSorting(false, false)

    expect(sorting).toHaveLength(1)
    expect(sorting[0]).toEqual({ id: 'visits', desc: false })
  })

  it('should work with getToggleSortingHandler', () => {
    let sorting = [
      { id: 'firstName', desc: false },
      { id: 'lastName', desc: true },
    ]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    const ageColumn = table.getColumn('age')
    const handler = ageColumn?.getToggleSortingHandler()

    const mockEvent = { shiftKey: false }
    handler?.(mockEvent)

    expect(sorting).toHaveLength(1)
    expect(sorting[0]).toEqual({ id: 'age', desc: true })
  })

  it('should work with getToggleSortingHandler with shift key', () => {
    let sorting = [
      { id: 'firstName', desc: false },
      { id: 'lastName', desc: true },
    ]

    const table = createTable<Person>({
      data: defaultData,
      columns: defaultColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onStateChange() {},
      renderFallbackValue: '',
      state: {
        sorting,
      },
      onSortingChange: updater => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater
      },
    })

    const ageColumn = table.getColumn('age')
    const handler = ageColumn?.getToggleSortingHandler()

    const mockEvent = { shiftKey: true }
    handler?.(mockEvent)

    expect(sorting).toHaveLength(3)
    expect(sorting[0]).toEqual({ id: 'firstName', desc: false })
    expect(sorting[1]).toEqual({ id: 'lastName', desc: true })
    expect(sorting[2]).toEqual({ id: 'age', desc: true })
  })
})
