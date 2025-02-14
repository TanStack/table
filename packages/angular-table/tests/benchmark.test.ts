import { describe, expect, test } from 'vitest'
import { injectTable, stockFeatures } from '../src'
import type { ColumnDef } from '../src'
import { setTimeout } from 'node:timers/promises'

const columns: Array<ColumnDef<typeof stockFeatures, any>> = [
  { id: 'col1' },
  { id: 'col2' },
  { id: 'col3' },
  { id: 'col4' },
  { id: 'col5' },
  { id: 'col6' },
  { id: 'col7' },
]

describe('Reactivity benchmark', () => {
  test.each([1000, 2000, 5000, 10_000, 25_000, 50_000, 100_000])(
    'benchmark with %s',
    async (size) => {
      let data = Array.from({ length: size }, (_, index) => ({
        id: index,
        title: `title-${index}`,
        name: `name-${index}`,
      }))

      const t0 = performance.now()

      const table = injectTable(() => ({
        _features: stockFeatures,
        columns: columns,
        data,
        enableExperimentalReactivity: true,
        enableRowAutoReactivity: true,
        enableCellAutoReactivity: true,
        enableColumnAutoReactivity: true,
        enableHeaderAutoReactivity: true,
        debugAll: true,
        debugTable: true,
      }))

      await setTimeout(0)

      const t1 = performance.now()

      const elapsed = Math.round((t1 - t0) * 100) / 100

      table.getCoreRowModel()

      console.log(elapsed)
      // expect(elapsed).toBeLessThan(2)
    },
  )
})
