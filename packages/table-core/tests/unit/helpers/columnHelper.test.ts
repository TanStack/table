import { describe, expect, expectTypeOf, it } from 'vitest'
import { constructTable, createColumnHelper } from '../../../src'
import { testFeatures } from '../../fixtures/features'

type Person = {
  firstName: string
  lastName: string
}

const features = testFeatures({})

const helper = createColumnHelper<typeof features, Person>()

describe('createColumnHelper', () => {
  it('accessor should create an accessorKey column def from a key', () => {
    const columnDef = helper.accessor('firstName', { header: 'First Name' })

    expect(columnDef).toEqual({
      accessorKey: 'firstName',
      header: 'First Name',
    })
  })

  it('accessor should create an accessorFn column def from a function', () => {
    const accessorFn = (row: Person) => row.lastName.toUpperCase()
    const columnDef = helper.accessor(accessorFn, { id: 'lastName' })

    expect(columnDef).toEqual({
      accessorFn,
      id: 'lastName',
    })
  })

  it('display and group should return the column def unchanged', () => {
    const displayDef = { id: 'actions', header: 'Actions' }
    const groupDef = {
      id: 'name',
      header: 'Name',
      columns: helper.columns([helper.accessor('firstName', {})]),
    }

    expect(helper.display(displayDef)).toBe(displayDef)
    expect(helper.group(groupDef)).toBe(groupDef)
  })

  it('columns should return the array unchanged', () => {
    const columns = [
      helper.accessor('firstName', {}),
      helper.accessor('lastName', { id: 'lastName' }),
    ]

    expect(helper.columns(columns)).toBe(columns)
  })

  it('helper-built column defs should resolve values on a real table', () => {
    const columns = helper.columns([
      helper.accessor('firstName', {}),
      helper.accessor((row) => row.lastName.toUpperCase(), { id: 'shouty' }),
      helper.display({ id: 'actions', header: 'Actions' }),
    ])
    const table = constructTable<typeof features, Person>({
      features,
      columns,
      data: [{ firstName: 'Tanner', lastName: 'Linsley' }],
    })
    const row = table.getRowModel().rows[0]!

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      'firstName',
      'shouty',
      'actions',
    ])
    expect(row.getValue('firstName')).toBe('Tanner')
    expect(row.getValue('shouty')).toBe('LINSLEY')
    expect(row.getValue('actions')).toBeUndefined()
  })

  it('should resolve numeric accessor keys for tuple rows', () => {
    type TupleRow = [string, number]
    const tupleHelper = createColumnHelper<typeof features, TupleRow>()
    const firstColumn = tupleHelper.accessor(0, {
      cell: (info) => {
        expectTypeOf(info.getValue()).toEqualTypeOf<string>()
        return info.getValue()
      },
    })
    const secondColumn = tupleHelper.accessor(1, {})
    const table = constructTable<typeof features, TupleRow>({
      features,
      columns: tupleHelper.columns([firstColumn, secondColumn]),
      data: [['Alice', 42]],
    })
    const row = table.getRowModel().rows[0]!

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      '0',
      '1',
    ])
    expect(row.getValue('0')).toBe('Alice')
    expect(row.getValue('1')).toBe(42)
  })

  it('should preserve undefined for optional deep accessor keys', () => {
    type DeepPerson = {
      user: {
        salary?: {
          amount: number
        }
      }
    }
    const deepHelper = createColumnHelper<typeof features, DeepPerson>()
    const column = deepHelper.accessor('user.salary.amount', {
      cell: (info) => {
        // `salary` is optional, so the resolved deep value can be `undefined`
        expectTypeOf(info.getValue()).toEqualTypeOf<number | undefined>()
        return info.getValue()
      },
    })
    const table = constructTable<typeof features, DeepPerson>({
      features,
      columns: deepHelper.columns([column]),
      data: [{ user: { salary: { amount: 42 } } }],
    })
    const row = table.getRowModel().rows[0]!

    expect(table.getAllLeafColumns().map((c) => c.id)).toEqual([
      'user_salary_amount',
    ])
    expect(row.getValue('user_salary_amount')).toBe(42)
  })
})
