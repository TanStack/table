import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import { constructHeader } from '../../../../src/core/headers/constructHeader'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src/types/ColumnDef'

interface Person {
  firstName: string
}

const features = testFeatures({})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { id: 'test-column', accessorKey: 'firstName' },
]

describe('constructHeader', () => {
  it('should create a column with all core column APIs and properties', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns,
      data: [],
    })
    const column = table.getAllLeafColumns()[0]!
    const index = 0
    const depth = 0

    const header = constructHeader(table, column, {
      index,
      depth,
    })

    expect(header).toBeDefined()
    expect(header).toHaveProperty('colSpan')
    expect(header).toHaveProperty('column')
    expect(header).toHaveProperty('depth')
    expect(header).toHaveProperty('headerGroup')
    expect(header).toHaveProperty('id')
    expect(header).toHaveProperty('index')
    expect(header).toHaveProperty('isPlaceholder')
    expect(header).toHaveProperty('placeholderId')
    expect(header).toHaveProperty('rowSpan')
    expect(header).toHaveProperty('subHeaders')
    expect(header).toHaveProperty('getContext')
    expect(header).toHaveProperty('getLeafHeaders')

    expect(header.id).toBe(column.id)
  })
})
