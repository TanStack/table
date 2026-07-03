import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  coreFeatures,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFns,
  tableFeatures,
} from '../../../../src'
import { column_getAutoFilterFn } from '../../../../src/static-functions'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef } from '../../../../src'

type Sample = {
  tags: Array<string>
  details: { active: boolean }
}

const features = tableFeatures({ ...coreFeatures, columnFilteringFeature })

const sampleKeys: Array<keyof Sample> = ['tags', 'details']

function generateAutoFilterTestTable(data: Array<Sample>) {
  const columns: Array<ColumnDef<typeof features, Sample, any>> =
    sampleKeys.map((key) => ({ accessorKey: key, id: key }))

  const table = constructTable<typeof features, Sample>({
    data,
    columns,
    features: {
      ...features,
      coreReactivityFeature: storeReactivityBindings(),
    },
  })

  table._rowModelFns.filterFns = filterFns

  return table
}

describe('column_getAutoFilterFn', () => {
  const data: Array<Sample> = [
    {
      tags: ['a', 'b'],
      details: { active: true },
    },
  ]

  it('selects arrIncludes for array values', () => {
    const table = generateAutoFilterTestTable(data)
    const column = table.getColumn('tags')!

    expect(column_getAutoFilterFn(column)).toBe(filterFn_arrIncludes)
  })

  it('selects equals for non-array object values', () => {
    const table = generateAutoFilterTestTable(data)
    const column = table.getColumn('details')!

    expect(column_getAutoFilterFn(column)).toBe(filterFn_equals)
  })
})
