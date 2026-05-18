import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  coreFeatures,
  createColumnHelper,
  globalFilteringFeature,
} from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef } from '../../../../src'

type Row = { name: string | null | undefined }

const _features = {
  ...coreFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  coreReativityFeature: storeReactivityBindings(),
}

const columnHelper = createColumnHelper<typeof _features, Row>()
const columns: Array<ColumnDef<typeof _features, Row, any>> = [
  columnHelper.accessor('name', { id: 'name' }),
]

function makeTable(data: Array<Row>) {
  return constructTable<typeof _features, Row>({
    _features,
    _rowModels: {},
    renderFallbackValue: '',
    data,
    columns,
  })
}

describe('globalFilteringFeature', () => {
  it('getColumnCanGlobalFilter returns true when a later row has a string value even if the first row is nullish', () => {
    const table = makeTable([{ name: undefined }, { name: 'second' }])
    expect(table.getColumn('name')!.getCanGlobalFilter()).toBe(true)
  })

  it('getColumnCanGlobalFilter returns false when every row value is nullish', () => {
    const table = makeTable([{ name: undefined }, { name: null }])
    expect(table.getColumn('name')!.getCanGlobalFilter()).toBe(false)
  })
})
