import { describe, expect, it } from 'vitest'
import { constructTable, coreFeatures } from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'

function getterOnlyMerge(...sources: Array<any>) {
  const target = {}

  for (const source of sources) {
    if (!source) {
      continue
    }

    for (const key of Reflect.ownKeys(source)) {
      if (key in target) {
        continue
      }

      Object.defineProperty(target, key, {
        enumerable: true,
        get() {
          for (let i = sources.length - 1; i >= 0; i--) {
            const value = sources[i]?.[key]
            if (value !== undefined) {
              return value
            }
          }
        },
      })
    }
  }

  return target
}

describe('constructTable', () => {
  it('should create a table with all core table APIs and properties', () => {
    const table = constructTable({
      features: {
        ...coreFeatures,
        coreReactivityFeature: storeReactivityBindings(),
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

  it('preserves static options without mutating mergeOptions results', () => {
    const features = {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
    }
    const atoms = {}
    const initialState = {}
    const data: Array<{ id: number }> = []
    const nextData = [{ id: 1 }]
    const nextFeatures = {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
    }
    const nextAtoms = {}
    const nextInitialState = {}

    const table = constructTable<typeof features, { id: number }>({
      features,
      atoms,
      initialState,
      columns: [],
      data,
      mergeOptions: (defaultOptions, options) =>
        getterOnlyMerge(defaultOptions, options) as any,
    })

    expect(() => {
      table.setOptions((prev) => ({
        ...prev,
        data: nextData,
        features: nextFeatures,
        atoms: nextAtoms,
        initialState: nextInitialState,
      }))
    }).not.toThrow()

    expect(table.options.data).toBe(nextData)
    expect(table.options.features).toBe(features)
    expect(table.options.atoms).toBe(atoms)
    expect(table.options.initialState).toBe(initialState)
  })
})
