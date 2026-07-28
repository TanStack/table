import { afterEach, describe, expect, it, vi } from 'vitest'
import { batch, createAtom } from '@tanstack/store'
import { constructTable, rowSortingFeature } from '../../../src'
import {
  createCommitFilteredSource,
  renderPhaseReactivity,
} from '../../../src/reactivity'
import {
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
  it('invokes the commit hook on publish, including when nothing is published', () => {
    const { bindings, internalTable } = makeDeferredTable()
    const commitSpy = vi.spyOn(bindings, 'commit')

    table_syncExternalStateToBaseAtoms(internalTable, {
      sorting: [{ id: 'a', desc: false }],
    })
    expect(commitSpy).toHaveBeenCalledTimes(1)

    // A captured "no controlled state" publishes nothing but still bumps the
    // commit version so ownership releases invalidate subscribers.
    table_syncExternalStateToBaseAtoms(internalTable, null)
    expect(commitSpy).toHaveBeenCalledTimes(2)
  })

  it('treats null capturedState as "publish nothing" and omitted as "read current options"', () => {
    const { table, internalTable } = makeDeferredTable()
    const controlled: SortingState = [{ id: 'controlled', desc: false }]

    table_setOptions(internalTable, (options) => ({
      ...options,
      state: { sorting: controlled },
    }))

    table_syncExternalStateToBaseAtoms(internalTable, null)
    expect(table.baseAtoms.sorting.get()).toEqual([])

    table_syncExternalStateToBaseAtoms(internalTable)
    expect(table.baseAtoms.sorting.get()).toBe(controlled)
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

describe('createCommitFilteredSource', () => {
  it('drops notifications whose snapshot the consumer already read, forwards the rest', () => {
    const listeners: Array<(value: { n: number }) => void> = []
    let snapshot = { n: 1 }
    const source = {
      get: () => snapshot,
      subscribe: (listener: (value: { n: number }) => void) => {
        listeners.push(listener)
        return { unsubscribe: () => {} }
      },
    }

    const filtered = createCommitFilteredSource(source)
    const received: Array<{ n: number }> = []
    filtered.subscribe((value) => received.push(value))

    // Never read through the filtered source yet — forwarded.
    listeners[0]!(snapshot)
    expect(received).toEqual([{ n: 1 }])

    // Read it, then republish the same reference — dropped.
    expect(filtered.get()).toBe(snapshot)
    listeners[0]!(snapshot)
    expect(received).toHaveLength(1)

    // A new snapshot reference is forwarded again.
    snapshot = { n: 2 }
    listeners[0]!(snapshot)
    expect(received).toEqual([{ n: 1 }, { n: 2 }])
  })

  it('does not filter other subscribers of the underlying source', () => {
    const atom = createAtom({ n: 0 })
    const filtered = createCommitFilteredSource(atom)

    const direct: Array<number> = []
    atom.subscribe((value) => direct.push(value.n))

    filtered.get()
    const next = { n: 1 }
    atom.set(next)
    filtered.get()
    atom.set({ n: 2 })

    expect(direct).toEqual([1, 2])
  })
})
