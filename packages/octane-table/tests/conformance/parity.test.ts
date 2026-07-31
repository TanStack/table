import { describe, expect, it } from 'vitest'
import * as core from '@tanstack/table-core'
import * as binding from '@tanstack/octane-table'

describe('export surface', () => {
  it('re-exports Table core and the Octane adapter APIs without legacy APIs', () => {
    const adapterExports = [
      'FlexRender',
      'Subscribe',
      'createTableHook',
      'createTableHookContexts',
      'flexRender',
      'useTable',
    ]
    const expected = [...Object.keys(core), ...adapterExports].sort()

    expect(Object.keys(binding).sort()).toEqual(expected)
    expect(binding).not.toHaveProperty('useLegacyTable')
  })

  it('re-exports the same @tanstack/table-core module instance', () => {
    expect(binding.createColumnHelper).toBe(core.createColumnHelper)
    expect(binding.constructTable).toBe(core.constructTable)
    expect(binding.tableFeatures).toBe(core.tableFeatures)
    expect(binding.createSortedRowModel).toBe(core.createSortedRowModel)
    expect(binding.sortFns).toBe(core.sortFns)
  })
})
