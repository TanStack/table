import { describe, expect, it } from 'vitest'
import { constructTable, stockFeatures } from '../../../../src'

describe('constructTable with stockFeatures', () => {
  it('should include all feature states in initial state', () => {
    const table = constructTable({
      _features: stockFeatures,
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

    expect(table.store.state).toHaveProperty('columnFilters')
    expect(table.store.state).toHaveProperty('columnOrder')
    expect(table.store.state).toHaveProperty('grouping')
    expect(table.store.state).toHaveProperty('columnPinning')

    // Defaults
    expect(table.store.state.columnFilters).toEqual([])
    expect(table.store.state.columnOrder).toEqual([])
    expect(table.store.state.grouping).toEqual([])
  })
})
