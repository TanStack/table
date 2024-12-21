import { describe, expect, it } from 'vitest'
import { constructCell } from '../../../../src/core/cells/constructCell'
import { coreCellsFeature } from '../../../../src/core/cells/coreCellsFeature'
import type { Row } from '../../../../src/types/Row'
import type { Column } from '../../../../src/types/Column'
import type { Table } from '../../../../src/types/Table'

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
