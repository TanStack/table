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
import type {
  AggregationFnDef,
  FilterFn,
  RowData,
  SortFn,
  TableFeatures,
} from '@tanstack/table-core'

type Person = {
  firstName: string
  age: number
}

// v8-style declaration merging: the way custom fn names became valid string
// values before the registry slots existed. `useLegacyTable` still supports it.
declare module '@tanstack/table-core' {
  interface FilterFns {
    startsWithLetter: FilterFn<TableFeatures, RowData>
  }
  interface SortFns {
    byNameLength: SortFn<TableFeatures, RowData>
  }
  interface AggregationFns {
    range: AggregationFnDef<TableFeatures, RowData, unknown, number>
  }
}

const startsWithLetter: FilterFn<TableFeatures, RowData> = (
  row,
  columnId,
  filterValue,
) => String(row.getValue(columnId)).startsWith(String(filterValue))

const byNameLength: SortFn<TableFeatures, RowData> = (rowA, rowB, columnId) =>
  String(rowA.getValue(columnId)).length -
  String(rowB.getValue(columnId)).length

const range: AggregationFnDef<TableFeatures, RowData, unknown, number> = {
  aggregate: (context) => {
    const values = context.rows.map((row) => Number(context.getValue(row)))
    return Math.max(...values) - Math.min(...values)
  },
}

const columnHelper = legacyCreateColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { filterFn: 'includesString' }),
  columnHelper.accessor('age', { aggregationFn: 'mean', sortFn: 'basic' }),
])

const customFnColumns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    filterFn: 'startsWithLetter',
    sortFn: 'byNameLength',
  }),
  columnHelper.accessor('age', { aggregationFn: 'range' }),
])

const data: ReadonlyArray<Person> = [
  { firstName: 'Tanner', age: 20 },
  { firstName: 'Kevin', age: 40 },
]

// Name length runs opposite to alphabetical order, so a sorted result can only
// come from `byNameLength`.
const customFnData: ReadonlyArray<Person> = [
  { firstName: 'Alexander', age: 20 },
  { firstName: 'Bo', age: 50 },
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

  it('applies declaration-merged sort and aggregation fn names', () => {
    const { result } = renderHook(() =>
      useLegacyTable({
        columns: customFnColumns,
        data: customFnData,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        sortFns: { byNameLength },
        aggregationFns: { range },
        initialState: { sorting: [{ id: 'firstName', desc: false }] },
      }),
    )

    expect(
      result.current.getRowModel().rows.map((row) => row.getValue('firstName')),
    ).toEqual(['Bo', 'Alexander'])
    expect(result.current.getColumn('age')!.getAggregationValue()).toBe(30)
  })

  it('applies the declaration-merged filter fn name', () => {
    const { result } = renderHook(() =>
      useLegacyTable({
        columns: customFnColumns,
        data: customFnData,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: { startsWithLetter },
        initialState: { columnFilters: [{ id: 'firstName', value: 'A' }] },
      }),
    )

    expect(
      result.current.getRowModel().rows.map((row) => row.getValue('firstName')),
    ).toEqual(['Alexander'])
  })
})
