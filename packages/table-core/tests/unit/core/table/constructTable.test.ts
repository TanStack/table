import { describe, expect, it } from 'vitest'
import { constructTable, coreFeatures } from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'

describe('constructTable', () => {
  it('should create a table with all core table APIs and properties', () => {
    const table = constructTable({
      _features: {
        ...coreFeatures,
        coreReativityFeature: storeReactivityBindings(),
      },
      columns: [],
      data: [],
    })

    expect(table).toBeDefined()
    // core table properties
    expect(table).toHaveProperty('_features')
    expect(table).toHaveProperty('_rowModelFns')
    expect(table).toHaveProperty('_rowModels')
    expect(table).toHaveProperty('initialState')
    expect(table).toHaveProperty('options')

    // column related table APIs
    expect(table).toHaveProperty('getAllFlatColumnsById')
    expect(table).toHaveProperty('getDefaultColumnDef')
    expect(table).toHaveProperty('getAllColumns')
    expect(table).toHaveProperty('getAllFlatColumns')
    expect(table).toHaveProperty('getAllLeafColumns')
    expect(table).toHaveProperty('getColumn')

    // header related table APIs
    expect(table).toHaveProperty('getHeaderGroups')
    expect(table).toHaveProperty('getFooterGroups')
    expect(table).toHaveProperty('getFlatHeaders')
    expect(table).toHaveProperty('getLeafHeaders')

    // row related table APIs
    expect(table).toHaveProperty('getRowId')
    expect(table).toHaveProperty('getRow')

    // table APIs
    expect(table).toHaveProperty('getCoreRowModel')
    expect(table).toHaveProperty('getRowModel')
    expect(table).toHaveProperty('reset')
    expect(table).toHaveProperty('setOptions')
    expect(table).toHaveProperty('store') // state is managed via store in v9
  })
})
