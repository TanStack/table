import { describe, expect, it } from 'vitest'
import { columnOrderingFeature, constructTable } from '../../../../src'
import { row_getAllCells } from '../../../../src/core/rows/coreRowsFeature.utils'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Table } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnOrderingFeature,
})

function makeTable(rowCount: number): Table<typeof features, Person> {
  const data = generateTestData(rowCount)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
  })
}

describe('row_getAllCells', () => {
  it('should build one cell per leaf column in leaf column order', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const cells = row_getAllCells(row)

    expect(cells.map((cell) => cell.column.id)).toEqual(
      table.getAllLeafColumns().map((col) => col.id),
    )
    expect(cells.every((cell) => cell.row === row)).toBe(true)
  })

  it('should reuse cell instances across calls', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const firstCells = row_getAllCells(row)
    const secondCells = row_getAllCells(row)

    expect(secondCells).not.toBe(firstCells)
    for (let i = 0; i < firstCells.length; i++) {
      expect(secondCells[i]).toBe(firstCells[i])
    }
  })

  it('should preserve cell identity across column order changes', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const cellsBefore = row.getAllCells()
    const cellsByColumnIdBefore = new Map(
      cellsBefore.map((cell) => [cell.column.id, cell]),
    )

    table.setColumnOrder(['lastName', 'firstName'])

    const cellsAfter = row.getAllCells()

    expect(cellsAfter).not.toBe(cellsBefore)
    expect(cellsAfter[0]?.column.id).toBe('lastName')
    expect(cellsAfter[1]?.column.id).toBe('firstName')
    for (const cell of cellsAfter) {
      expect(cell).toBe(cellsByColumnIdBefore.get(cell.column.id))
    }
  })
})
