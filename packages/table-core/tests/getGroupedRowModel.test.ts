import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnGroupingFeature,
  constructTable,
  coreFeatures,
  createGroupedRowModel,
} from '../src'
import { createColumnHelper } from '../src/helpers/columnHelper'
import { makeData } from './makeTestData'
import type { Person } from './makeTestData'
import type { ColumnDef } from '../src'

type personKeys = keyof Person
type PersonColumn = ColumnDef<any, Person, any>

function generateColumns(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<any, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

describe('#getGroupedRowModel', () => {
  it('groups 50k rows and 3 grouped columns with clustered data in less than 5 seconds', () => {
    const data = makeData(50000)
    const columns = generateColumns(data)
    const grouping = ['firstName', 'lastName', 'age']
    const start = new Date()

    data.forEach((p) => (p.firstName = 'Fixed'))
    data.forEach((p) => (p.lastName = 'Name'))
    data.forEach((p) => (p.age = 123))

    const table = constructTable<any, Person>({
      _features: { columnGroupingFeature, ...coreFeatures },
      _rowModels: {
        groupedRowModel: createGroupedRowModel(aggregationFns),
      },
      onStateChange() {},
      renderFallbackValue: '',
      data,
      state: { grouping },
      columns,
    })
    const groupedById = table.getGroupedRowModel().rowsById
    const end = new Date()

    expect(groupedById['firstName:Fixed']?.getLeafRows().length).toEqual(50002)
    expect(
      groupedById['firstName:Fixed>lastName:Name']?.getLeafRows().length,
    ).toEqual(50001)
    expect(
      groupedById['firstName:Fixed>lastName:Name>age:123']?.getLeafRows()
        .length,
    ).toEqual(50000)
    expect(end.valueOf() - start.valueOf()).toBeLessThan(5000)
  })
})
