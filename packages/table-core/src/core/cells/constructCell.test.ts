import { describe, expect, it } from 'vitest'
import { constructCell } from './constructCell'
import { coreCellsFeature } from './coreCellsFeature'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type { Table } from '../../types/Table'

describe('constructCell', () => {
  it('should populate the cell with all core cell APIs and properties', () => {
    const column = { id: 'test-column' } as Column<any, any>
    const row = { id: 'test-row' } as Row<any, any>
    const table = { _features: { coreCellsFeature }, options: {} } as Table<
      any,
      any
    >
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
