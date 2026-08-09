// @vitest-environment jsdom

import * as React from 'react'
import { act, cleanup, render } from '@testing-library/react'
import {
  createCoreRowModel,
  createExpandedRowModel,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useTable } from '../src'
import type { ColumnDef, ExpandedState } from '@tanstack/table-core'

// Regression harness from #6519: controlled `expanded` via useState, an
// unstable `data` reference (`items ?? []` allocates per render), and one
// row-model read during render. Before the centralized no-op guard, every
// data identity change fired `table_autoResetExpanded` ->
// `onExpandedChange(new empty map)`, the controlled consumer re-rendered
// with yet another fresh `data` reference, and the app looped: 50 renders
// (capped) with 48 onExpandedChange calls. With the owner-side guard the reset
// updater resolves to the host's existing `{}` reference, so it does not cause
// the next render that previously sustained the loop.

type Data = { id: string; title: string }

const features = tableFeatures({
  rowExpandingFeature,
  coreRowModel: createCoreRowModel(),
  expandedRowModel: createExpandedRowModel(),
})

const columns: Array<ColumnDef<typeof features, Data>> = [
  { id: 'id', accessorKey: 'id' },
  { id: 'title', accessorKey: 'title' },
]

const MAX_RENDERS = 50

function makeApp(options?: {
  items?: Array<Data>
  autoResetExpanded?: boolean
}) {
  const renderCount = { current: 0 }
  const onExpandedChangeCalls = { current: 0 }

  function App() {
    renderCount.current++
    if (renderCount.current > MAX_RENDERS) {
      throw new Error(`render loop: exceeded ${MAX_RENDERS} renders`)
    }

    const [expanded, setExpanded] = React.useState<ExpandedState>({})
    const items = options?.items

    const table = useTable({
      features,
      columns,
      // `items ?? []` produces a fresh array identity on every render unless
      // a stable array is supplied, which is what fed the loop.
      data: items ?? [],
      getRowCanExpand: () => true,
      state: { expanded },
      onExpandedChange: (updater) => {
        onExpandedChangeCalls.current++
        setExpanded(updater)
      },
      ...(options?.autoResetExpanded !== undefined
        ? { autoResetExpanded: options.autoResetExpanded }
        : {}),
    })

    // one row-model read during render
    const rows = table.getRowModel().rows

    return <div data-testid="row-count">{rows.length}</div>
  }

  return { App, renderCount, onExpandedChangeCalls }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('expanded auto reset with an unstable data reference (#6519)', () => {
  test('items ?? [] does not loop when the reset reaches controlled state', async () => {
    const { App, renderCount, onExpandedChangeCalls } = makeApp()

    // The loop needs a second render to produce a fresh `data` identity;
    // nudge one re-render the way a parent update (or StrictMode) would.
    const { rerender } = render(<App />)
    await act(async () => {
      rerender(<App />)
    })
    await act(() => Promise.resolve())

    expect(onExpandedChangeCalls.current).toBe(1)
    expect(renderCount.current).toBeLessThanOrEqual(4)
  })

  test('a stable data reference behaves identically', async () => {
    const STABLE_EMPTY_ARRAY: Array<Data> = []
    const { App, renderCount, onExpandedChangeCalls } = makeApp({
      items: STABLE_EMPTY_ARRAY,
    })

    const { rerender } = render(<App />)
    await act(async () => {
      rerender(<App />)
    })
    await act(() => Promise.resolve())

    expect(onExpandedChangeCalls.current).toBe(0)
    expect(renderCount.current).toBeLessThanOrEqual(4)
  })

  test('autoResetExpanded: false behaves identically', async () => {
    const { App, renderCount, onExpandedChangeCalls } = makeApp({
      autoResetExpanded: false,
    })

    const { rerender } = render(<App />)
    await act(async () => {
      rerender(<App />)
    })
    await act(() => Promise.resolve())

    expect(onExpandedChangeCalls.current).toBe(0)
    expect(renderCount.current).toBeLessThanOrEqual(4)
  })

  test('a real reset still fires when expanded state has diverged', async () => {
    const data: Array<Data> = [
      { id: '1', title: 'One' },
      { id: '2', title: 'Two' },
    ]
    const renderCount = { current: 0 }
    const onExpandedChangeCalls = { current: 0 }
    let tableRef: any

    function App() {
      renderCount.current++
      if (renderCount.current > MAX_RENDERS) {
        throw new Error(`render loop: exceeded ${MAX_RENDERS} renders`)
      }
      const [expanded, setExpanded] = React.useState<ExpandedState>({
        '1': true,
      })
      const table = useTable({
        features,
        columns,
        data,
        getRowCanExpand: () => true,
        state: { expanded },
        onExpandedChange: (updater) => {
          onExpandedChangeCalls.current++
          setExpanded(updater)
        },
      })
      tableRef = table
      table.getRowModel()
      return null
    }

    render(<App />)
    await act(() => Promise.resolve())
    expect(onExpandedChangeCalls.current).toBe(0)

    await act(async () => {
      tableRef.resetExpanded(true)
    })

    expect(onExpandedChangeCalls.current).toBe(1)
    expect(tableRef.atoms.expanded.get()).toEqual({})
    expect(renderCount.current).toBeLessThanOrEqual(6)
  })

  test('same-tick controlled updates compose against the host queue', async () => {
    const onExpandedChangeCalls = { current: 0 }
    let tableRef: any

    function App() {
      const [expanded, setExpanded] = React.useState<ExpandedState>({})
      const table = useTable({
        features,
        columns,
        data: [],
        state: { expanded },
        onExpandedChange: (updater) => {
          onExpandedChangeCalls.current++
          setExpanded(updater)
        },
      })
      tableRef = table

      return <output data-testid="expanded">{JSON.stringify(expanded)}</output>
    }

    const view = render(<App />)

    await act(async () => {
      tableRef.setExpanded({ '1': true })
      tableRef.resetExpanded(true)
    })

    expect(onExpandedChangeCalls.current).toBe(2)
    expect(view.getByTestId('expanded').textContent).toBe('{}')
    expect(tableRef.atoms.expanded.get()).toEqual({})
  })
})
