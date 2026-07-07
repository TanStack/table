import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import { constructCell } from '../../../../src/core/cells/constructCell'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src/types/ColumnDef'

interface Person {
  firstName: string
}

const features = testFeatures({})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { id: 'test-column', accessorKey: 'firstName' },
]

describe('constructCell', () => {
  it('should populate the cell with all core cell APIs and properties', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns,
      data: [{ firstName: 'Tanner' }],
    })
    const column = table.getAllLeafColumns()[0]!
    const row = table.getRowModel().rows[0]!

    const coreCell = constructCell(column, row, table)

    expect(coreCell).toBeDefined()
    expect(coreCell).toHaveProperty('column')
    expect(coreCell).toHaveProperty('id')
    expect(coreCell).toHaveProperty('row')
    expect(coreCell).toHaveProperty('getContext')
    expect(coreCell).toHaveProperty('getValue')
    expect(coreCell).toHaveProperty('renderValue')

    expect(coreCell.id).toBe(`${row.id}_${column.id}`)
    expect(coreCell.column).toBe(column)
    expect(coreCell.row).toBe(row)
  })
})
