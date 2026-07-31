import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import { constructRow } from '../../../../src/core/rows/constructRow'
import { row_getLeafRows } from '../../../../src/core/rows/coreRowsFeature.utils'
import { testFeatures } from '../../../fixtures/features'
import type { Row } from '../../../../src/types/Row'

interface Person {
  firstName: string
}

const features = testFeatures({})

describe('constructRow', () => {
  it('should create a row with all core row APIs and properties', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns: [],
      data: [],
    })
    const id = 'test-row'
    const original = { firstName: 'Tanner' }
    const rowIndex = 0
    const depth = 0
    const subRows = [] as Array<Row<typeof features, Person>>
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
    expect(row).toHaveProperty('getDisplayIndex')
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
    expect(row.getDisplayIndex()).toBe(-1)
    expect(row.depth).toBe(depth)
    expect(row.subRows).toBe(subRows)
    expect(row.parentId).toBe(parentId)
  })

  it('memoizes getLeafRows until subRows changes', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns: [],
      data: [],
    })

    const leafA = constructRow(table, 'leaf-a', { firstName: 'A' }, 0, 1, [])
    const leafB = constructRow(table, 'leaf-b', { firstName: 'B' }, 1, 1, [])
    const parent = constructRow(
      table,
      'parent',
      { firstName: 'Parent' },
      0,
      0,
      [leafA, leafB],
    )

    const firstLeafRows = parent.getLeafRows()
    expect(parent.getLeafRows()).toBe(firstLeafRows)
    expect(firstLeafRows).toEqual([leafA, leafB])

    parent.subRows = [leafB, leafA]

    const nextLeafRows = parent.getLeafRows()
    expect(nextLeafRows).not.toBe(firstLeafRows)
    expect(nextLeafRows).toEqual([leafB, leafA])
  })

  it('tracks nested subRows replacements in a readonly atom', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns: [],
      data: [],
    })

    const leafA = constructRow(table, 'leaf-a', { firstName: 'A' }, 0, 2, [])
    const leafB = constructRow(table, 'leaf-b', { firstName: 'B' }, 0, 2, [])
    const branch = constructRow(
      table,
      'branch',
      { firstName: 'Branch' },
      0,
      1,
      [leafA],
    )
    const parent = constructRow(
      table,
      'parent',
      { firstName: 'Parent' },
      0,
      0,
      [branch],
    )
    let evaluations = 0
    const leafRowsAtom = table._reactivity.createReadonlyAtom(
      () => {
        evaluations++
        return row_getLeafRows(parent)
      },
      { debugName: 'test/nestedSubRows' },
    )

    const firstLeafRows = leafRowsAtom.get()
    expect(firstLeafRows).toEqual([branch, leafA])
    expect(leafRowsAtom.get()).toBe(firstLeafRows)
    expect(evaluations).toBe(1)

    const sameSubRows = branch.subRows
    branch.subRows = sameSubRows
    expect(leafRowsAtom.get()).toBe(firstLeafRows)
    expect(evaluations).toBe(1)

    branch.subRows = [leafB]

    const nextLeafRows = leafRowsAtom.get()
    expect(nextLeafRows).not.toBe(firstLeafRows)
    expect(nextLeafRows).toEqual([branch, leafB])
    expect(evaluations).toBe(2)
  })
})
