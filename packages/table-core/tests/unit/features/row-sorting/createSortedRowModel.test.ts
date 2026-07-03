import { describe, expect, it } from 'vitest'
import {
  constructTable,
  coreFeatures,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  age: number
}

const features = tableFeatures({
  ...coreFeatures,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  { accessorKey: 'age', id: 'age' },
]

const data: Array<Person> = [
  { firstName: 'amy', age: 20 },
  { firstName: 'bob', age: 40 },
  { firstName: 'alice', age: 30 },
]

function makeTable(sorting: Array<{ id: string; desc: boolean }>) {
  return constructTable<typeof features, Person>({
    data,
    columns,
    features: {
      ...features,
      coreReactivityFeature: storeReactivityBindings(),
    },
    initialState: { sorting },
  })
}

describe('createSortedRowModel', () => {
  it('does not crash when the sorting state references a column that no longer exists', () => {
    const table = makeTable([{ id: 'thisColumnDoesNotExist', desc: false }])

    expect(() => table.getSortedRowModel()).not.toThrow()
  })

  it('falls back to the pre-sorted row order when only unknown columns are sorted', () => {
    const table = makeTable([{ id: 'thisColumnDoesNotExist', desc: false }])

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['amy', 'bob', 'alice'])
  })

  it('still sorts by the remaining known columns when one sort entry is unknown', () => {
    const table = makeTable([
      { id: 'thisColumnDoesNotExist', desc: false },
      { id: 'age', desc: false },
    ])

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['amy', 'alice', 'bob'])
  })
})
