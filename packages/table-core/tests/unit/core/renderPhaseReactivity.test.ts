import { afterEach, describe, expect, it, vi } from 'vitest'
import { batch, createAtom } from '@tanstack/store'
import { constructTable, rowSortingFeature } from '../../../src'
import {
  createRenderPhaseSource,
  renderPhaseReactivity,
} from '../../../src/reactivity'
import {
  table_publishExternalState,
  table_setOptions,
  table_syncExternalStateToBaseAtoms,
} from '../../../src/static-functions'
import { testFeatures } from '../../fixtures/features'
import type { SortingState, Table_Internal } from '../../../src'

const features = testFeatures({
  rowSortingFeature,
})

function makeDeferredTable() {
  const bindings = renderPhaseReactivity({ createAtom, batch })
  const table = constructTable({
    features: {
      ...features,
      coreReactivityFeature: bindings,
    },
    columns: [],
    data: [],
  })

  return {
    bindings,
    table,
    internalTable: table as unknown as Table_Internal<typeof features, any>,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('renderPhaseReactivity bindings', () => {
  it('caches memo-mode reads within a render and refreshes after staging', () => {
    const bindings = renderPhaseReactivity({ createAtom, batch })
    const option = bindings.createWritableAtom(1, {
      debugName: 'option',
      mode: 'staged',
    })
    const evaluate = vi.fn(() => option.get() * 2)
    const memo = bindings.createReadonlyAtom(evaluate, {
      debugName: 'memo',
      mode: 'memo',
    })

    expect(memo.get()).toBe(2)
    expect(memo.get()).toBe(2)
    expect(evaluate).toHaveBeenCalledTimes(1)

    option.set(2)
    bindings.stage()

    expect(memo.get()).toBe(4)
    expect(memo.get()).toBe(4)
    expect(evaluate).toHaveBeenCalledTimes(2)
  })

  it('uses broad memo invalidation for a materially changed staged source', () => {
    const bindings = renderPhaseReactivity({ createAtom, batch })
    const dependency = bindings.createWritableAtom(1, {
      debugName: 'dependency',
      mode: 'staged',
    })
    const unrelated = bindings.createWritableAtom('before', {
      debugName: 'unrelated',
      mode: 'staged',
    })
    const evaluate = vi.fn(() => ({ value: dependency.get() }))
    const memo = bindings.createReadonlyAtom(evaluate, {
      debugName: 'memo',
      mode: 'memo',
    })

    const initial = memo.get()

    unrelated.set('after')
    bindings.stage()

    expect(memo.get()).not.toBe(initial)
    expect(evaluate).toHaveBeenCalledTimes(2)
  })

  it('publishes staged readonly values once for the committed token', () => {
    const bindings = renderPhaseReactivity({ createAtom, batch })
    const option = bindings.createWritableAtom(1, {
      debugName: 'option',
      mode: 'staged',
    })
    const projection = bindings.createReadonlyAtom(() => option.get(), {
      debugName: 'projection',
    })
    const notifications: Array<number> = []
    const subscription = projection.subscribe((value) => {
      notifications.push(value)
    })

    option.set(2)
    const token = bindings.stage()

    expect(projection.get()).toBe(2)
    expect(notifications).toEqual([])

    bindings.commit(token)
    bindings.commit(token)

    expect(notifications).toEqual([2])
    subscription.unsubscribe()
  })

  it('does not publish an abandoned staged value', () => {
    const bindings = renderPhaseReactivity({ createAtom, batch })
    const option = bindings.createWritableAtom(1, {
      debugName: 'option',
      mode: 'staged',
    })
    const projection = bindings.createReadonlyAtom(() => option.get(), {
      debugName: 'projection',
    })
    const notifications: Array<number> = []
    const subscription = projection.subscribe((value) => {
      notifications.push(value)
    })

    option.set(2)
    const abandonedToken = bindings.stage()
    expect(projection.get()).toBe(2)

    option.set(3)
    const committedToken = bindings.stage()
    expect(projection.get()).toBe(3)

    bindings.commit(committedToken)
    bindings.commit(abandonedToken)

    expect(notifications).toEqual([3])
    subscription.unsubscribe()
  })

  it('does not publish newer staged values through an older commit token', () => {
    const bindings = renderPhaseReactivity({ createAtom, batch })
    const option = bindings.createWritableAtom(1, {
      debugName: 'option',
      mode: 'staged',
    })
    const projection = bindings.createReadonlyAtom(() => option.get(), {
      debugName: 'projection',
    })
    const notifications: Array<number> = []
    const subscription = projection.subscribe((value) => {
      notifications.push(value)
    })

    option.set(2)
    const olderToken = bindings.stage()
    option.set(3)
    bindings.stage()

    bindings.commit(olderToken)

    expect(notifications).toEqual([])
    subscription.unsubscribe()
  })

  it('gates option atom publication and forwards the captured token', () => {
    const { bindings, table, internalTable } = makeDeferredTable()
    const nextData = [{ id: 'next' }]
    const notifications: Array<ReadonlyArray<unknown>> = []
    const subscription = table.optionAtoms.data.subscribe((value) => {
      notifications.push(value)
    })
    const commitSpy = vi.spyOn(bindings, 'commit')

    const token = table_setOptions(
      internalTable,
      (options) => ({
        ...options,
        data: nextData,
      }),
      { syncExternalState: false },
    )

    expect(token).toEqual(expect.any(Number))
    expect(table.optionAtoms.data.get()).toBe(nextData)
    expect(notifications).toEqual([])

    table_publishExternalState(internalTable, null, undefined, token)

    expect(commitSpy).toHaveBeenCalledWith(token)
    expect(notifications).toEqual([nextData])
    subscription.unsubscribe()
  })

  it('does not stage a source with unchanged option values', () => {
    const { bindings, internalTable } = makeDeferredTable()
    // The first merge installs construct-static undefined slots. Subsequent
    // render merges with the same values should not rotate memo caches.
    table_setOptions(internalTable, (options) => ({ ...options }), {
      syncExternalState: false,
    })
    const stageSpy = vi.spyOn(bindings, 'stage')

    const token = table_setOptions(
      internalTable,
      (options) => ({ ...options }),
      { syncExternalState: false },
    )

    expect(token).toBe(bindings.getStageToken())
    expect(stageSpy).not.toHaveBeenCalled()
  })

  it('invokes the commit hook on publish, including when nothing is published', () => {
    const { bindings, internalTable } = makeDeferredTable()
    const commitSpy = vi.spyOn(bindings, 'commit')

    table_publishExternalState(internalTable, {
      sorting: [{ id: 'a', desc: false }],
    })
    expect(commitSpy).toHaveBeenCalledTimes(1)

    // Publishing options with no controlled state still bumps the commit
    // version so ownership releases invalidate subscribers.
    table_publishExternalState(internalTable, null)
    expect(commitSpy).toHaveBeenCalledTimes(2)
  })

  it('treats null capturedState as "publish nothing" and omitted as "read current options"', () => {
    const { table, internalTable } = makeDeferredTable()
    const controlled: SortingState = [{ id: 'controlled', desc: false }]

    table_setOptions(
      internalTable,
      (options) => ({
        ...options,
        state: { sorting: controlled },
      }),
      { syncExternalState: false },
    )

    table_syncExternalStateToBaseAtoms(internalTable, null)
    expect(table.baseAtoms.sorting.get()).toEqual([])

    table_syncExternalStateToBaseAtoms(internalTable)
    expect(table.baseAtoms.sorting.get()).toBe(controlled)
  })

  it('keeps public setOptions eager', () => {
    const { table, internalTable } = makeDeferredTable()
    const controlled: SortingState = [{ id: 'controlled', desc: false }]
    const notifications: Array<SortingState> = []
    const subscription = table.atoms.sorting.subscribe((value) => {
      notifications.push(value)
    })

    table_setOptions(internalTable, (options) => ({
      ...options,
      state: { sorting: controlled },
    }))

    expect(table.baseAtoms.sorting.get()).toBe(controlled)
    expect(table.atoms.sorting.get()).toBe(controlled)
    expect(notifications).toEqual([controlled])

    subscription.unsubscribe()
  })

  it('suppresses semantically equal slice writes through the compare parameter', () => {
    const { table, internalTable } = makeDeferredTable()
    const sorting: SortingState = [{ id: 'a', desc: false }]

    table_syncExternalStateToBaseAtoms(internalTable, { sorting })
    const published = table.baseAtoms.sorting.get()

    const recreated = [...sorting]
    table_syncExternalStateToBaseAtoms(
      internalTable,
      { sorting: recreated },
      (currentState, externalState) =>
        JSON.stringify(currentState) === JSON.stringify(externalState),
    )

    expect(table.baseAtoms.sorting.get()).toBe(published)
  })
})

describe('createRenderPhaseSource', () => {
  it('filters against explicit commits, not speculative reads', () => {
    const listeners: Array<(value: { n: number }) => void> = []
    let snapshot = { n: 1 }
    const source = {
      get: () => snapshot,
      subscribe: (listener: (value: { n: number }) => void) => {
        listeners.push(listener)
        return { unsubscribe: () => {} }
      },
    }

    const filtered = createRenderPhaseSource(source)
    const received: Array<{ n: number }> = []
    filtered.subscribe((value) => received.push(value))

    // No render has committed yet, so the notification is forwarded.
    listeners[0]!(snapshot)
    expect(received).toEqual([{ n: 1 }])

    filtered.markCommitted(snapshot)
    listeners[0]!(snapshot)
    expect(received).toHaveLength(1)

    // Reading a speculative snapshot does not move the commit baseline.
    snapshot = { n: 2 }
    expect(filtered.get()).toBe(snapshot)
    listeners[0]!(snapshot)
    expect(received).toEqual([{ n: 1 }, { n: 2 }])

    filtered.markCommitted(snapshot)
    listeners[0]!(snapshot)
    expect(received).toHaveLength(2)
  })

  it('does not filter other subscribers of the underlying source', () => {
    const atom = createAtom({ n: 0 })
    const filtered = createRenderPhaseSource(atom)

    const direct: Array<number> = []
    atom.subscribe((value) => direct.push(value.n))

    filtered.markCommitted(filtered.get())
    const next = { n: 1 }
    atom.set(next)
    filtered.markCommitted(filtered.get())
    atom.set({ n: 2 })

    expect(direct).toEqual([1, 2])
  })
})
