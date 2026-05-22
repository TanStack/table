import { describe, expect, it } from 'vitest'
import { ColumnDef, getCoreRowModel } from '../src'
import { createColumnHelper } from '../src/columnHelper'
import { createTable } from '../src/core/table'
import { getGroupedRowModel } from '../src/utils/getGroupedRowModel'
import { makeData, Person } from './makeTestData'

function createPerson(firstName: string, age: number): Person {
  return {
    firstName,
    lastName: 'Doe',
    age,
    visits: 0,
    progress: 0,
    status: 'single',
  }
}

type personKeys = keyof Person
type PersonColumn = ColumnDef<Person, string | number | Person[] | undefined>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<Person>()
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

    const table = createTable<Person>({
      onStateChange() {},
      renderFallbackValue: '',
      data,
      state: { grouping },
      columns,
      getCoreRowModel: getCoreRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
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

  it('aggregates a secondary grouped column at parent group levels', () => {
    const data: Person[] = [
      // first Engineering row is intentionally not the min, so the bug
      // (returning the first row's raw value) differs from the aggregate
      createPerson('Engineering', 30),
      createPerson('Engineering', 24),
      createPerson('Sales', 40),
    ]

    const columnHelper = createColumnHelper<Person>()
    const columns = [
      columnHelper.accessor('firstName', { id: 'firstName' }),
      columnHelper.accessor('age', { id: 'age', aggregationFn: 'min' }),
    ]

    const table = createTable<Person>({
      onStateChange() {},
      renderFallbackValue: '',
      data,
      state: { grouping: ['firstName', 'age'] },
      columns,
      getCoreRowModel: getCoreRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
    })

    const rowsById = table.getGroupedRowModel().rowsById
    const engineering = rowsById['firstName:Engineering']

    // `age` is grouped at a deeper level, so the Engineering group row should
    // still expose the aggregated (min) age across its leaf rows.
    expect(engineering?.getValue('age')).toBe(24)
    expect(rowsById['firstName:Sales']?.getValue('age')).toBe(40)

    // at the `age` group level the column is the grouping key, so it keeps the
    // grouping value rather than aggregating
    expect(rowsById['firstName:Engineering>age:24']?.getValue('age')).toBe(24)
    expect(rowsById['firstName:Engineering>age:30']?.getValue('age')).toBe(30)
  })
})
