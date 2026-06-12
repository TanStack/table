import { describe, expect, it } from 'vitest'
import { coreColumnsFeature } from '../../../../src/core/columns/coreColumnsFeature'
import { constructColumn } from '../../../../src/core/columns/constructColumn'
import { constructTable } from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef } from '../../../../src/types/ColumnDef'
import type { Table_Internal } from '../../../../src/types/Table'

const features = {
  coreColumnsFeature,
  coreReactivityFeature: storeReactivityBindings(),
}

interface TestRow {
  'test-accessor-key'?: string
}

describe('constructColumn', () => {
  it('should create a column with all core column APIs and properties', () => {
    const table = constructTable<typeof features, TestRow>({
      features,
      columns: [],
      data: [],
    }) as unknown as Table_Internal<typeof features, TestRow>

    const columnDef = {
      id: 'test-column',
      accessorKey: 'test-accessor-key',
    } as ColumnDef<typeof features, TestRow>
    const depth = 0
    const parent = undefined

    const column = constructColumn(table, columnDef, depth, parent)

    expect(column).toBeDefined()
    expect(column).toHaveProperty('accessorFn')
    expect(column).toHaveProperty('columnDef')
    expect(column).toHaveProperty('columns')
    expect(column).toHaveProperty('depth')
    expect(column).toHaveProperty('id')
    expect(column).toHaveProperty('parent')
    expect(column).toHaveProperty('getFlatColumns')
    expect(column).toHaveProperty('getLeafColumns')

    expect(column.id).toBe(columnDef.id)
    expect(column.depth).toBe(depth)
    expect(column.parent).toBe(parent)
  })
})
