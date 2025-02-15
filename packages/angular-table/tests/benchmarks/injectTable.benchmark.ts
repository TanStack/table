import { setTimeout } from 'node:timers/promises'
import { bench, describe } from 'vitest'
import { benchCases, columns, createTestTable, dataMap } from './setup'

const nIteration = 5

for (const benchCase of benchCases) {
  describe(`injectTable (${benchCase.size} elements)`, () => {
    const data = dataMap[benchCase.size]!

    bench(
      `${benchCase.size} elements - No reactivity`,
      async () => {
        const table = createTestTable(false, data, columns)
        await setTimeout(0)
        table.getRowModel()
      },
      {
        iterations: nIteration,
      },
    )

    bench(
      `${benchCase.size} Enabled reactivity`,
      async () => {
        const table = createTestTable(true, data, columns)
        await setTimeout(0)
        table.getRowModel()
      },
      {
        iterations: nIteration,
      },
    )
  })
}
