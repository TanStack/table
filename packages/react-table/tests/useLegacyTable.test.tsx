// @vitest-environment jsdom

import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  legacyCreateColumnHelper,
  useLegacyTable,
} from '../src/useLegacyTable'

type Person = {
  firstName: string
  age: number
}

const columnHelper = legacyCreateColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { filterFn: 'includesString' }),
  columnHelper.accessor('age', { aggregationFn: 'mean', sortFn: 'basic' }),
])

const data: ReadonlyArray<Person> = [
  { firstName: 'Tanner', age: 20 },
  { firstName: 'Kevin', age: 40 },
]

afterEach(() => {
  cleanup()
})

describe('useLegacyTable', () => {
  it('accepts built-in fn names on helper-built column defs', () => {
    const { result } = renderHook(() =>
      useLegacyTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
      }),
    )

    expect(result.current.getColumn('age')!.getAggregationValue()).toBe(30)
  })

  it('applies the named filter fn to the filtered row model', () => {
    const { result } = renderHook(() =>
      useLegacyTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { columnFilters: [{ id: 'firstName', value: 'ann' }] },
      }),
    )

    expect(
      result.current.getRowModel().rows.map((row) => row.getValue('firstName')),
    ).toEqual(['Tanner'])
  })

  it('applies the named sort fn to the sorted row model', () => {
    const { result } = renderHook(() =>
      useLegacyTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { sorting: [{ id: 'age', desc: true }] },
      }),
    )

    expect(
      result.current.getRowModel().rows.map((row) => row.getValue('age')),
    ).toEqual([40, 20])
  })
})
