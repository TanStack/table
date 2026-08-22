import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import { constructCell } from '../../../../src/core/cells/constructCell'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src/types/ColumnDef'
import type { TableFeature } from '../../../../src/types/TableFeatures'

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

  it('should initialize instance-specific cell data once per cell', () => {
    let initCount = 0
    const annotationFeature: TableFeature = {
      initCellInstanceData: (cell) => {
        Object.defineProperty(cell, 'instanceAnnotation', {
          value: `${cell.row.id}_${cell.column.id}`,
          enumerable: true,
          configurable: true,
        })
        initCount++
      },
    }
    const featuresWithAnnotations = {
      ...features,
      annotationFeature,
    }

    const table = constructTable<typeof featuresWithAnnotations, Person>({
      features: featuresWithAnnotations,
      columns: columns as any,
      data: [{ firstName: 'Tanner' }, { firstName: 'Kevin' }],
    })

    const rows = table.getRowModel().rows
    const firstCells = rows.flatMap((row) => row.getAllCells())

    expect(firstCells.length).toBe(2)
    for (const cell of firstCells) {
      expect(
        Object.prototype.hasOwnProperty.call(cell, 'instanceAnnotation'),
      ).toBe(true)
      expect((cell as any).instanceAnnotation).toBe(
        `${cell.row.id}_${cell.column.id}`,
      )
    }
    // 2 real cells + the discarded shape-warmup cell constructed alongside
    // the shared cell prototype.
    expect(initCount).toBe(3)

    // Cells are cached per row/column pair, so re-access constructs no new cells
    const secondCells = rows.flatMap((row) => row.getAllCells())
    expect(secondCells[0]).toBe(firstCells[0])
    expect(initCount).toBe(3)
  })
})
