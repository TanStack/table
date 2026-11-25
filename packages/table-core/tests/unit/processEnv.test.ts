import { afterEach, describe, expect, it, vi } from 'vitest'
import { constructTable } from '../../src'
import { testFeatures } from '../fixtures/features'

describe('bundler-less environments without a process global', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('constructs a table when process is undefined', () => {
    vi.stubGlobal('process', undefined)
    expect(typeof process).toBe('undefined')

    const table = constructTable({
      features: testFeatures({}),
      columns: [{ id: 'firstName', accessorKey: 'firstName' }],
      data: [{ firstName: 'Tanner' }],
    } as any) as any

    expect(table).toBeTruthy()
    expect(table.getRowModel().rows).toHaveLength(1)
  })
})
