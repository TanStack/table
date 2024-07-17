import { describe, expect, it } from 'vitest'
import {
  _createTable,
  ColumnDef,
  createCoreRowModel,
  createGroupedRowModel,
  ColumnGrouping,
} from '../src'
import { createColumnHelper } from '../src/helpers/columnHelper'
import { makeData, Person } from './makeTestData'

type personKeys = keyof Person
type PersonColumn = ColumnDef<
  any,
  Person,
  string | number | Person[] | undefined
>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<any, Person>()
  const person = people[0]
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

    const table = _createTable<any, Person>({
      _features: { ColumnGrouping },
      _rowModels: {
        Core: createCoreRowModel(),
        Grouped: createGroupedRowModel(),
      },
      onStateChange() {},
      renderFallbackValue: '',
      data,
      state: { grouping },
      columns,
    })
    const groupedById = table.getGroupedRowModel().rowsById
    const end = new Date()

    expect(groupedById['firstName:Fixed'].leafRows.length).toEqual(50000)
    expect(
      groupedById['firstName:Fixed>lastName:Name'].leafRows.length,
    ).toEqual(50000)
    expect(
      groupedById['firstName:Fixed>lastName:Name>age:123'].leafRows.length,
    ).toEqual(50000)
    expect(end.valueOf() - start.valueOf()).toBeLessThan(5000)
  })
})
