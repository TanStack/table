import { describe, expect, it } from 'vitest'
import {
  constructTable,
  coreFeatures,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFns,
  tableFeatures,
} from '../../../../src'
import { column_getAutoSortFn } from '../../../../src/static-functions'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef } from '../../../../src'

type Sample = {
  plainText: string
  alphaNum: string
  createdAt: Date
  amount: number
}

const features = tableFeatures({ ...coreFeatures, rowSortingFeature })

const sampleKeys: Array<keyof Sample> = [
  'plainText',
  'alphaNum',
  'createdAt',
  'amount',
]

function generateAutoSortTestTable(data: Array<Sample>) {
  const columns: Array<ColumnDef<typeof features, Sample, any>> =
    sampleKeys.map((key) => ({ accessorKey: key, id: key }))

  const table = constructTable<typeof features, Sample>({
    data,
    columns,
    features: {
      ...features,
      coreReactivityFeature: storeReactivityBindings(),
    },
  })

  // Normally assigned by createSortedRowModel when the sorted row model is wired up
  table._rowModelFns.sortFns = sortFns

  return table
}

describe('column_getAutoSortFn', () => {
  const data: Array<Sample> = [
    {
      plainText: 'apple',
      alphaNum: 'item1',
      createdAt: new Date('2024-01-01'),
      amount: 1,
    },
    {
      plainText: 'banana',
      alphaNum: 'item10',
      createdAt: new Date('2024-02-01'),
      amount: 2,
    },
  ]

  it('selects datetime for Date values', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('createdAt')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_datetime)
  })

  it('selects alphanumeric for strings mixing text and numbers', () => {
    // Regression: the text fallback used to clobber the alphanumeric match
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('alphaNum')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_alphanumeric)
  })

  it('selects text for plain strings', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('plainText')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_text)
  })

  it('falls back to basic for non-string, non-date values', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('amount')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_basic)
  })

  it('falls back to basic when no rows exist', () => {
    const table = generateAutoSortTestTable([])
    const column = table.getColumn('plainText')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_basic)
  })

  it('falls back to text when alphanumeric is not registered', () => {
    const table = generateAutoSortTestTable(data)
    table._rowModelFns.sortFns = { text: sortFn_text }
    const column = table.getColumn('alphaNum')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_text)
  })
})
