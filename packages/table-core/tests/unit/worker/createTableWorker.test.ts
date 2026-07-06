import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  coreFeatures,
  rowSortingFeature,
} from '../../../src'
import { storeReactivityBindings } from '../../../src/store-reactivity-bindings'
import {
  createTableWorker,
  createWorkerRowModel,
  workerRowModelsFeature,
} from '../../../src/experimental-worker-plugin'
import type { Table_Internal } from '../../../src'

type Person = { firstName: string; age: number }

const data = Array.from({ length: 8 }, (_, i) => ({
  firstName: `person-${i}`,
  age: i * 5,
}))

const columns: any = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'age', header: 'Age' },
]

class FakeWorker {
  static instances: Array<FakeWorker> = []
  posted: Array<any> = []
  terminated = false
  onmessage: ((event: { data: any }) => void) | null = null
  onerror: ((event: unknown) => void) | null = null
  onmessageerror: ((event: unknown) => void) | null = null

  constructor() {
    FakeWorker.instances.push(this)
  }
  postMessage(message: any, _options?: unknown) {
    this.posted.push(message)
  }
  terminate() {
    this.terminated = true
  }

  processMessages() {
    return this.posted.filter((message) => message.type === 'process')
  }
  dataMessages() {
    return this.posted.filter((message) => message.type === 'data')
  }
  emitResult(overrides: Record<string, unknown> = {}) {
    const lastProcess = this.processMessages().at(-1)
    this.onmessage?.({
      data: {
        type: 'result',
        requestId: lastProcess?.requestId ?? 1,
        dataVersion: lastProcess?.dataVersion ?? 1,
        stages: {},
        computeMs: 1,
        ...overrides,
      },
    })
  }
}

function reversedIndices(count: number) {
  return Uint32Array.from({ length: count }, (_, i) => count - 1 - i)
}

function makeTable(tableWorker: ReturnType<typeof createTableWorker>) {
  return constructTable({
    data,
    columns,
    features: {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
      rowSortingFeature,
      columnFilteringFeature,
      workerRowModelsFeature,
      filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
      sortedRowModel: createWorkerRowModel(tableWorker, 'sorted'),
    },
  } as any) as unknown as Table_Internal<any, Person>
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('createTableWorker bridge', () => {
  beforeEach(() => {
    FakeWorker.instances = []
    vi.stubGlobal('Worker', FakeWorker)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts data once per identity and single-flights the first request', async () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)

    ;(table as any).getSortedRowModel()
    ;(table as any).getFilteredRowModel()

    expect(FakeWorker.instances).toHaveLength(1)
    const worker = FakeWorker.instances[0]!
    // one data message, one in-flight process (stage set growth waits)
    expect(worker.dataMessages()).toHaveLength(1)
    expect(worker.processMessages()).toHaveLength(1)

    // result arrival triggers the trailing request with the full stage set
    worker.emitResult({
      stages: { sorted: { kind: 'flat', indices: reversedIndices(8) } },
    })
    expect(worker.processMessages()).toHaveLength(2)
    expect(worker.processMessages().at(-1)!.stages).toEqual([
      'filtered',
      'sorted',
    ])

    worker.emitResult({
      stages: {
        filtered: { kind: 'flat', indices: reversedIndices(8) },
        sorted: { kind: 'unchanged' },
      },
    })
    expect(worker.processMessages()).toHaveLength(2)

    // rebuilt sorted model reflects the payload
    const sorted = (table as any).getSortedRowModel()
    expect(sorted.rows[0].id).toBe('7')

    // repeat reads post nothing new
    ;(table as any).getSortedRowModel()
    expect(worker.posted).toHaveLength(3)

    // new data identity posts a second data message
    table.setOptions((prev: any) => ({ ...prev, data: [...data] }))
    ;(table as any).getSortedRowModel()
    expect(worker.dataMessages()).toHaveLength(2)
    await flushMicrotasks()
  })

  it('coalesces rapid state changes into single-flight with a trailing request', () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    ;(table as any).getSortedRowModel()
    const worker = FakeWorker.instances[0]!
    worker.emitResult({ stages: {} })
    worker.emitResult({ stages: {} }) // settle stage-growth trailing request
    const settled = worker.processMessages().length

    ;(table.baseAtoms as any).sorting.set([{ id: 'age', desc: false }])
    ;(table as any).getSortedRowModel()
    expect(worker.processMessages()).toHaveLength(settled + 1)

    // two more changes while in flight: no additional posts
    ;(table.baseAtoms as any).sorting.set([{ id: 'age', desc: true }])
    ;(table as any).getSortedRowModel()
    ;(table.baseAtoms as any).sorting.set([{ id: 'firstName', desc: false }])
    ;(table as any).getSortedRowModel()
    expect(worker.processMessages()).toHaveLength(settled + 1)

    // result arrives -> exactly one trailing request with the latest state
    worker.emitResult({ stages: {} })
    expect(worker.processMessages()).toHaveLength(settled + 2)
    expect(worker.processMessages().at(-1)!.state.sorting).toEqual([
      { id: 'firstName', desc: false },
    ])
  })

  it('drops results for a stale dataVersion and reprocesses', () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    ;(table as any).getSortedRowModel()
    const worker = FakeWorker.instances[0]!
    const staleProcess = worker.processMessages().at(-1)!

    // data changes while request 1 is in flight
    table.setOptions((prev: any) => ({ ...prev, data: [...data] }))
    ;(table as any).getSortedRowModel()

    worker.emitResult({
      requestId: staleProcess.requestId,
      dataVersion: staleProcess.dataVersion, // old version
      stages: { sorted: { kind: 'flat', indices: reversedIndices(8) } },
    })

    // stale payload not applied; an immediate reprocess was posted
    const sorted = (table as any).getSortedRowModel()
    expect(sorted.rows[0].id).toBe('0')
    const latest = worker.processMessages().at(-1)!
    expect(latest.dataVersion).toBe(2)
  })

  it('keeps previous results and skips rebuilds for unchanged stages', () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    ;(table as any).getSortedRowModel()
    const worker = FakeWorker.instances[0]!

    worker.emitResult({
      stages: { sorted: { kind: 'flat', indices: reversedIndices(8) } },
    })
    worker.emitResult({
      stages: {
        filtered: { kind: 'flat', indices: reversedIndices(8) },
        sorted: { kind: 'unchanged' },
      },
    })
    const modelA = (table as any).getSortedRowModel()
    expect(modelA.rows[0].id).toBe('7')

    // another round trip reporting sorted unchanged -> identical model object
    ;(table.baseAtoms as any).columnFilters.set([
      { id: 'firstName', value: 'person' },
    ])
    ;(table as any).getSortedRowModel()
    worker.emitResult({
      stages: {
        filtered: { kind: 'flat', indices: reversedIndices(8) },
        sorted: { kind: 'unchanged' },
      },
    })
    const modelB = (table as any).getSortedRowModel()
    expect(modelB).toBe(modelA)
  })

  it('clears pending and stops posting after a worker error', async () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    ;(table as any).getSortedRowModel()
    const worker = FakeWorker.instances[0]!
    await flushMicrotasks()
    expect((table.atoms as any).workerRowModels.get().isPending).toBe(true)

    worker.onerror?.(new Event('error'))
    await flushMicrotasks()
    expect((table.atoms as any).workerRowModels.get().isPending).toBe(false)
    expect(worker.terminated).toBe(true)
    expect(consoleSpy).toHaveBeenCalledOnce()

    // further state changes never post or create workers again
    const postedBefore = worker.posted.length
    ;(table.baseAtoms as any).sorting.set([{ id: 'age', desc: true }])
    const model = (table as any).getSortedRowModel()
    expect(worker.posted).toHaveLength(postedBefore)
    expect(FakeWorker.instances).toHaveLength(1)
    // falls back to the pre-stage model
    expect(model.rows[0].id).toBe('0')
    consoleSpy.mockRestore()
  })

  it('self-heals after terminate()', () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    ;(table as any).getSortedRowModel()
    const firstWorker = FakeWorker.instances[0]!

    tableWorker.terminate()
    expect(firstWorker.terminated).toBe(true)
    ;(table as any).getSortedRowModel()
    expect(FakeWorker.instances).toHaveLength(2)
    const secondWorker = FakeWorker.instances[1]!
    expect(secondWorker.dataMessages()).toHaveLength(1)
    expect(secondWorker.processMessages()).toHaveLength(1)
  })

  it('sets timing fields when a result lands', () => {
    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)
    ;(table as any).getSortedRowModel()
    const worker = FakeWorker.instances[0]!

    worker.emitResult({ stages: {}, computeMs: 42 })
    const slice = (table.atoms as any).workerRowModels.get()
    expect(slice.lastComputeMs).toBe(42)
    expect(typeof slice.lastRoundTripMs).toBe('number')
    expect(slice.version).toBe(1)
  })
})

describe('createTableWorker without a Worker global (SSR)', () => {
  it('falls back to pre-stage models without touching Worker', () => {
    // jsdom has no Worker; make sure of it for this test
    expect(typeof (globalThis as any).Worker).toBe('undefined')

    const tableWorker = createTableWorker({
      createWorker: () => new (globalThis as any).Worker(),
    })
    const table = makeTable(tableWorker)

    const model = (table as any).getSortedRowModel()
    expect(model.rows.map((row: any) => row.id)).toEqual(
      data.map((_, i) => String(i)),
    )
  })
})
