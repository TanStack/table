import { describe, expect, it } from 'vitest'
import { constructTable, stockFeatures } from '../../../../src'
import { defaultReactivityBindings } from '../../../../src/core/reactivity/defaultReactivityBindings'

describe('constructTable with stockFeatures', () => {
  it('should include all feature states in initial state', () => {
    const table = constructTable({
      _features: stockFeatures,
      reactivity: defaultReactivityBindings(),
      columns: [],
      data: [],
    })

    // These were missing before the columnPinningFeature getInitialState fix
    expect(table.initialState).toHaveProperty('columnFilters')
    expect(table.initialState).toHaveProperty('columnOrder')
    expect(table.initialState).toHaveProperty('grouping')
    // Regression checks for adjacent features
    expect(table.initialState).toHaveProperty('columnPinning')
    expect(table.initialState).toHaveProperty('sorting')
    expect(table.initialState).toHaveProperty('pagination')
    expect(table.initialState).toHaveProperty('columnVisibility')
    expect(table.initialState).toHaveProperty('columnSizing')
    expect(table.initialState).toHaveProperty('columnResizing')
    expect(table.initialState).toHaveProperty('rowPinning')
    expect(table.initialState).toHaveProperty('rowSelection')
    expect(table.initialState).toHaveProperty('expanded')
    expect(table.initialState).toHaveProperty('globalFilter')

    expect(table.atoms.columnFilters).toBeDefined()
    expect(table.atoms.columnOrder).toBeDefined()
    expect(table.atoms.grouping).toBeDefined()
    expect(table.atoms.columnPinning).toBeDefined()

    // Defaults
    expect(table.atoms.columnFilters.get()).toEqual([])
    expect(table.atoms.columnOrder.get()).toEqual([])
    expect(table.atoms.grouping.get()).toEqual([])
  })
})
