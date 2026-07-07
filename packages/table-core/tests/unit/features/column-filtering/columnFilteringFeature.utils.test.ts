import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFns,
} from '../../../../src'
import { column_getAutoFilterFn } from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Sample = {
  tags: Array<string>
  details: { active: boolean }
}

const features = testFeatures({ columnFilteringFeature, filterFns })

const sampleKeys: Array<keyof Sample> = ['tags', 'details']

function generateAutoFilterTestTable(data: Array<Sample>) {
  const columns: Array<ColumnDef<typeof features, Sample, any>> =
    sampleKeys.map((key) => ({ accessorKey: key, id: key }))

  return constructTable<typeof features, Sample>({
    data,
    columns,
    features,
  })
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
