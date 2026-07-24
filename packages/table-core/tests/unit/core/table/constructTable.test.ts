import { describe, expect, it, vi } from 'vitest'
import { constructTable } from '../../../../src'
import { table_mergeOptions } from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { TableFeature } from '../../../../src'

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
  it('initializes feature-owned table data before constructing any table APIs', () => {
    const calls: Array<string> = []
    const initA = vi.fn((table: any) => {
      calls.push('init-a')
      expect(table.options.lifecycleMarker).toBe('available')
      expect(table.baseAtoms.lifecycle.get()).toBe('initial')
      expect(table.atoms.lifecycle.get()).toBe('initial')
      expect(table.store.state.lifecycle).toBe('initial')
      expect(table.reset).toBeUndefined()
      table.firstInitialized = true
    })
    const initB = vi.fn((table: any) => {
      calls.push('init-b')
      expect(table.firstInitialized).toBe(true)
      table.secondInitialized = true
    })
    const apiA = vi.fn((table: any) => {
      calls.push('api-a')
      expect(table.firstInitialized).toBe(true)
      expect(table.secondInitialized).toBe(true)
    })
    const apiB = vi.fn((table: any) => {
      calls.push('api-b')
      expect(table.firstInitialized).toBe(true)
      expect(table.secondInitialized).toBe(true)
    })
    const apiWithoutInit = vi.fn((table: any) => {
      calls.push('api-without-init')
      table.apiWithoutInit = true
    })
    const featureA: TableFeature = {
      getInitialState: (initialState) =>
        ({ lifecycle: 'initial', ...initialState }) as any,
      initTableInstanceData: initA,
      constructTableAPIs: apiA,
    }
    const featureB: TableFeature = {
      initTableInstanceData: initB,
      constructTableAPIs: apiB,
    }
    const featureWithoutInit: TableFeature = {
      constructTableAPIs: apiWithoutInit,
    }
    const features = {
      ...testFeatures({}),
      featureA,
      featureB,
      featureWithoutInit,
    } as any

    const table = constructTable({
      features,
      columns: [],
      data: [],
      lifecycleMarker: 'available',
    } as any) as any

    expect(calls).toEqual([
      'init-a',
      'init-b',
      'api-a',
      'api-b',
      'api-without-init',
    ])
    expect(initA).toHaveBeenCalledOnce()
    expect(initB).toHaveBeenCalledOnce()
    expect(apiWithoutInit).toHaveBeenCalledOnce()
    expect(table.apiWithoutInit).toBe(true)
  })

  it('pre-computes per-instance init functions bound to their feature', () => {
    const initialized = new Set<string>()
    // Method shorthand so each hook reads `this` from the feature object,
    // proving the cached init fns are bound to their feature
    const bindingFeature = {
      marker: 'bound-feature',
      initCellInstanceData(this: any) {
        initialized.add(`cell:${this.marker}`)
      },
      initColumnInstanceData(this: any) {
        initialized.add(`column:${this.marker}`)
      },
      initHeaderGroupInstanceData(this: any) {
        initialized.add(`headerGroup:${this.marker}`)
      },
      initHeaderInstanceData(this: any) {
        initialized.add(`header:${this.marker}`)
      },
      initRowInstanceData(this: any) {
        initialized.add(`row:${this.marker}`)
      },
    } as TableFeature
    const features = {
      ...testFeatures({}),
      bindingFeature,
    } as any

    const table = constructTable({
      features,
      columns: [{ id: 'first-name', accessorKey: 'firstName' }],
      data: [{ firstName: 'Tanner' }],
    } as any) as any

    expect(table._cellInstanceInitFns).toHaveLength(1)
    expect(table._columnInstanceInitFns).toHaveLength(1)
    expect(table._headerGroupInstanceInitFns).toHaveLength(1)
    expect(table._headerInstanceInitFns).toHaveLength(1)
    expect(table._rowInstanceInitFns).toHaveLength(1)

    table.getHeaderGroups()
    table.getRowModel().rows.forEach((row: any) => row.getAllCells())

    expect(initialized).toEqual(
      new Set([
        'cell:bound-feature',
        'column:bound-feature',
        'headerGroup:bound-feature',
        'header:bound-feature',
        'row:bound-feature',
      ]),
    )
  })

  it('resets feature-owned table data after internal atoms without rerunning initialization', () => {
    const init = vi.fn((table: any) => {
      table.transientValue = 'initialized'
    })
    const reset = vi.fn((table: any) => {
      expect(table.baseAtoms.lifecycle.get()).toBe('initial')
      expect(table.store.state.lifecycle).toBe('initial')
      table.transientValue = null
    })
    const lifecycleFeature: TableFeature = {
      getInitialState: (initialState) =>
        ({ lifecycle: 'initial', ...initialState }) as any,
      initTableInstanceData: init,
      resetTableInstanceData: reset,
    }
    const features = {
      ...testFeatures({}),
      lifecycleFeature,
    } as any
    const table = constructTable({
      features,
      columns: [],
      data: [],
    } as any) as any

    table.baseAtoms.lifecycle.set('changed')
    table.transientValue = 'changed'
    table.reset()

    expect(reset).toHaveBeenCalledOnce()
    expect(init).toHaveBeenCalledOnce()
    expect(table.transientValue).toBeNull()

    table.baseAtoms.lifecycle.set('changed-again')
    table.reset()

    expect(reset).toHaveBeenCalledTimes(2)
    expect(init).toHaveBeenCalledOnce()
  })

  it('should create a table with all core table APIs and properties', () => {
    const table = constructTable({
      features: testFeatures({}),
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
    const features = testFeatures({})
    const atoms = {}
    const initialState = {}
    const data: Array<{ id: number }> = []
    const nextData = [{ id: 1 }]
    const nextFeatures = testFeatures({})
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

describe('table_mergeOptions', () => {
  it('should shallow-merge options while restoring static options', () => {
    const features = testFeatures({})
    const atoms = {}
    const initialState = {}
    const table = constructTable<typeof features, { id: number }>({
      features,
      atoms,
      initialState,
      columns: [],
      data: [],
    })

    const nextData = [{ id: 1 }]
    const merged = table_mergeOptions(table, {
      ...table.options,
      data: nextData,
      features: testFeatures({}),
      atoms: {},
      initialState: {},
    })

    expect(merged.data).toBe(nextData)
    // static options are restored from the original table options
    expect(merged.features).toBe(features)
    expect(merged.atoms).toBe(atoms)
    expect(merged.initialState).toBe(initialState)
  })

  it('should delegate to options.mergeOptions and preserve getters', () => {
    const features = testFeatures({})
    const table = constructTable<typeof features, { id: number }>({
      features,
      columns: [],
      data: [],
      mergeOptions: (defaultOptions, options) =>
        getterOnlyMerge(defaultOptions, options) as any,
    })

    const nextData = [{ id: 1 }]
    const merged = table_mergeOptions(table, {
      ...table.options,
      data: nextData,
    })

    expect(merged.data).toBe(nextData)
    expect(merged.features).toBe(features)
  })
})
