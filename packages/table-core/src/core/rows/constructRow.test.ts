import { describe, expect, it } from 'vitest'
import { Rows } from './Rows'
import { constructRow } from './constructRow'
import type { Row } from '../../types/Row'
import type { Table } from '../../types/Table'

interface Person {
  firstName: string
}

describe('constructRow', () => {
  it('should create a row with all core row APIs and properties', () => {
    const table = { _features: { Rows }, options: {} } as Table<
      any,
      Person
    >
    const id = 'test-row'
    const original = { firstName: 'Tanner' } as Person
    const rowIndex = 0
    const depth = 0
    const subRows = [] as Array<Row<any, Person>>
    const parentId = 'parent-id'

    const row = constructRow(
      table,
      id,
      original,
      rowIndex,
      depth,
      subRows,
      parentId,
    )

    expect(row).toBeDefined()
    expect(row).toHaveProperty('_uniqueValuesCache')
    expect(row).toHaveProperty('_valuesCache')
    expect(row).toHaveProperty('depth')
    expect(row).toHaveProperty('id')
    expect(row).toHaveProperty('index')
    expect(row).toHaveProperty('original')
    expect(row).toHaveProperty('parentId')
    expect(row).toHaveProperty('subRows')
    expect(row).toHaveProperty('getAllCellsByColumnId')
    expect(row).toHaveProperty('getAllCells')
    expect(row).toHaveProperty('getLeafRows')
    expect(row).toHaveProperty('getParentRow')
    expect(row).toHaveProperty('getParentRows')
    expect(row).toHaveProperty('getUniqueValues')
    expect(row).toHaveProperty('getValue')
    expect(row).toHaveProperty('renderValue')

    expect(row.id).toBe(id)
    expect(row.original).toBe(original)
    expect(row.index).toBe(rowIndex)
    expect(row.depth).toBe(depth)
    expect(row.subRows).toBe(subRows)
    expect(row.parentId).toBe(parentId)
  })
})
