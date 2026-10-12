import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import {
  constructFilterFn,
  constructTable,
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
} from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import TableDevtools from '../src/TableDevtools'
import { bundleSizes } from '../src/bundleSizes'
import { estimateBundleSize } from '../src/estimateBundleSize'
import {
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '../src/tableTarget'

function kB(bytes: number) {
  return `${(bytes / 1000).toFixed(2)} kB`
}

afterEach(() => {
  for (const target of getTableDevtoolsTargets()) {
    removeTableDevtoolsTarget(target.id)
  }
})

describe('FeaturesPanel', () => {
  it('shows measured sizes for registered items and a shared-code-aware total', async () => {
    const startsWithA = constructFilterFn({
      filter: (value: unknown) => String(value).startsWith('a'),
    })
    const table = constructTable({
      key: 'sized-table',
      features: {
        coreReactivityFeature: storeReactivityBindings(),
        columnFilteringFeature,
        rowSortingFeature,
        filteredRowModel: createFilteredRowModel(),
        sortedRowModel: createSortedRowModel(),
        filterFns: { includesString: filterFn_includesString, startsWithA },
        sortFns: { alphanumeric: sortFn_alphanumeric },
      },
      columns: [{ accessorKey: 'name' }],
      data: [{ name: 'a' }, { name: 'b' }],
    })
    const cleanupTarget = upsertTableDevtoolsTarget({ table: table as never })

    const element = document.createElement('div')
    const dispose = render(() => <TableDevtools theme="dark" />, element)
    await Promise.resolve()
    const text = element.textContent

    expect(text).toContain(`+${kB(bundleSizes.features.rowSortingFeature)}`)
    expect(text).toContain(
      `2 rows, ${kB(bundleSizes.rowModels.filteredRowModel)}`,
    )
    expect(text).toContain(
      `includesString${kB(bundleSizes.filterFns.includesString)}`,
    )
    expect(text).toContain('startsWithAcustom')
    expect(text).toContain(
      `Total${kB(
        estimateBundleSize({
          features: ['columnFilteringFeature', 'rowSortingFeature'],
          rowModels: ['filteredRowModel', 'sortedRowModel'],
          filterFns: ['includesString'],
          sortFns: ['alphanumeric'],
        }),
      )}`,
    )

    dispose()
    cleanupTarget?.()
  })
})
