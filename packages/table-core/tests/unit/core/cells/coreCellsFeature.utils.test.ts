import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  nickname: string | null
}

const features = testFeatures({})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  { accessorKey: 'nickname', id: 'nickname' },
]

function makeTable() {
  return constructTable<typeof features, Person>({
    features,
    columns,
    data: [{ firstName: 'Tanner', nickname: null }],
    renderFallbackValue: 'N/A',
  })
}

function getCell(columnId: string) {
  const table = makeTable()
  const row = table.getRowModel().rows[0]!
  return row.getAllCellsByColumnId()[columnId]!
}

describe('cell_getValue', () => {
  it('should read the accessor value for the cell', () => {
    expect(cell_getValue(getCell('firstName'))).toBe('Tanner')
  })
})

describe('cell_renderValue', () => {
  it('should return the accessor value when present', () => {
    expect(cell_renderValue(getCell('firstName'))).toBe('Tanner')
  })

  it('should fall back to renderFallbackValue for nullish values', () => {
    expect(cell_renderValue(getCell('nickname'))).toBe('N/A')
  })
})

describe('cell_getContext', () => {
  it('should expose the table, column, row, and cell with bound value helpers', () => {
    const table = makeTable()
    const row = table.getRowModel().rows[0]!
    const cell = row.getAllCellsByColumnId()['firstName']!

    const context = cell_getContext(cell)

    expect(context.table).toBe(cell.table)
    expect(context.column).toBe(cell.column)
    expect(context.row).toBe(row)
    expect(context.cell).toBe(cell)
    expect(context.getValue()).toBe('Tanner')
    expect(context.renderValue()).toBe('Tanner')
  })
})
