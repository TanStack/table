import { afterEach, describe, expect, it, vi } from 'vitest'
import { constructTable } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'

const features = testFeatures({})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('dev-only guards without a `process` global', () => {
  it('constructs a table when `process` is not defined', () => {
    vi.stubGlobal('process', undefined)

    expect(() =>
      constructTable({
        features,
        columns: [],
        data: [],
        debugTable: true,
      }),
    ).not.toThrow()
  })

  it('looks up a missing column when `process` is not defined', () => {
    const table = constructTable({
      features,
      columns: [],
      data: [],
    })

    vi.stubGlobal('process', undefined)

    expect(() => table.getColumn('missing')).not.toThrow()
  })
})
