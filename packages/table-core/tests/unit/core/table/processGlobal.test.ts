import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowAggregationFeature,
  rowSortingFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import {
  createTableWorker,
  createWorkerRowModel,
  workerRowModelsFeature,
} from '../../../../src/experimental-worker-plugin'
import type { ColumnDef } from '../../../../src'

const features = testFeatures({})

const processingFeatures = testFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowAggregationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})

type Person = { firstName: string; age: number }

const data: Array<Person> = [
  { firstName: 'alice', age: 30 },
  { firstName: 'bob', age: 40 },
]

// No `filterFns`/`sortFns`/`aggregationFns` registries are provided, so every
// lookup misses and takes the dev-only warning branch.
const columns: Array<ColumnDef<typeof processingFeatures, Person, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  {
    accessorKey: 'age',
    id: 'age',
    aggregationFn: 'unregistered' as any,
    filterFn: 'unregistered' as any,
    sortFn: 'unregistered' as any,
  },
]

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

  it('looks up a missing row when `process` is not defined', () => {
    const table = constructTable({ features, columns: [], data: [] })

    vi.stubGlobal('process', undefined)

    expect(() => table.getRow('missing')).not.toThrow(TypeError)
  })

  it('constructs columns with unresolvable accessors when `process` is not defined', () => {
    vi.stubGlobal('process', undefined)

    const table = constructTable<typeof features, { details: {} }>({
      features,
      columns: [{ accessorKey: 'details.missing.deep', id: 'deep' }],
      data: [{ details: {} }],
    })

    expect(() =>
      table.getCoreRowModel().flatRows[0]!.getValue('deep'),
    ).not.toThrow()

    expect(() =>
      constructTable({
        features,
        // @ts-expect-error - an accessorFn column needs an explicit id
        columns: [{ accessorFn: (row: Person) => row.firstName }],
        data,
      }).getAllColumns(),
    ).not.toThrow(TypeError)
  })

  it('sorts by unregistered sort fns when `process` is not defined', () => {
    const table = constructTable({
      features: processingFeatures,
      columns,
      data,
    })

    vi.stubGlobal('process', undefined)

    table.setSorting([
      { id: 'firstName', desc: false },
      { id: 'age', desc: true },
    ])

    expect(() => table.getSortedRowModel()).not.toThrow()
  })

  it('applies column filters with unregistered filter fns when `process` is not defined', () => {
    const table = constructTable({
      features: processingFeatures,
      columns,
      data,
    })

    vi.stubGlobal('process', undefined)

    table.setColumnFilters([
      { id: 'firstName', value: 'a' },
      { id: 'age', value: 30 },
    ])

    expect(() => table.getFilteredRowModel()).not.toThrow()
  })

  it('applies a global filter with an unregistered filter fn when `process` is not defined', () => {
    const table = constructTable({
      features: processingFeatures,
      columns,
      data,
      globalFilterFn: 'unregistered' as any,
    })

    vi.stubGlobal('process', undefined)

    table.setGlobalFilter('a')

    expect(() => table.getFilteredRowModel()).not.toThrow()
  })

  it('resolves unregistered aggregation fns when `process` is not defined', () => {
    const table = constructTable({
      features: processingFeatures,
      columns,
      data,
    })

    vi.stubGlobal('process', undefined)

    expect(() => table.getColumn('age')!.getAggregationFns()).not.toThrow()
    expect(() =>
      table.getColumn('firstName')!.getAutoAggregationFn(),
    ).not.toThrow()
  })

  it('reads a worker row model when `process` is not defined', () => {
    const posted: Array<any> = []
    class FakeWorker {
      onmessage: ((event: { data: any }) => void) | null = null
      postMessage(message: any) {
        posted.push(message)
      }
      terminate() {}
    }
    let worker: FakeWorker
    const tableWorker = createTableWorker({
      createWorker: () => (worker = new FakeWorker()) as unknown as Worker,
    })
    vi.stubGlobal('Worker', FakeWorker)
    const table = constructTable({
      features: testFeatures({
        columnFilteringFeature,
        workerRowModelsFeature,
        filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
      }),
      columns: [{ accessorKey: 'firstName', id: 'firstName' }],
      data,
    })

    vi.stubGlobal('process', undefined)

    table.getFilteredRowModel()
    const request = posted
      .filter((message) => message.type === 'process')
      .at(-1)
    worker!.onmessage?.({
      data: {
        type: 'result',
        requestId: request.requestId,
        dataVersion: request.dataVersion,
        stages: {},
        computeMs: 1,
      },
    })
    table.setOptions((prev) => ({ ...prev, data: [...data] }))

    expect(() => table.getFilteredRowModel()).not.toThrow()
  })
})
