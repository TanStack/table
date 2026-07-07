import { describe, expect, it } from 'vitest'
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
})
