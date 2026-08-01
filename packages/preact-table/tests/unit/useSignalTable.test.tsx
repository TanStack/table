import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { useState } from 'preact/hooks'
import { act } from 'preact/test-utils'
import { signal } from '@preact/signals'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { signalAtom } from '../../src/signalReactivity'
import { useSignalTable } from '../../src/useSignalTable'
import type { ColumnDef, PaginationState } from '@tanstack/table-core'
import type { PreactSignalTable } from '../../src/useSignalTable'

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

type TestRow = {
  id: number
}

const data: ReadonlyArray<TestRow> = Array.from({ length: 100 }, (_, id) => ({
  id,
}))
const columns: ReadonlyArray<ColumnDef<typeof features, TestRow>> = []

type TestTable = PreactSignalTable<typeof features, TestRow>

function text(name: string) {
  return screen.getByRole('status', { name }).textContent
}

function clickButton(name: string) {
  fireEvent.click(screen.getByRole('button', { name }))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('useSignalTable', () => {
  it('re-renders a component that read table APIs when the state they read changes', () => {
    let harnessRenderCount = 0

    function Harness() {
      harnessRenderCount++
      const table = useSignalTable({
        features,
        columns,
        data,
      })

      return (
        <>
          <output aria-label="First row id">
            {table.getRowModel().rows[0]?.original.id ?? -1}
          </output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<Harness />)

    expect(harnessRenderCount).toBe(1)
    expect(text('First row id')).toBe('0')

    act(() => {
      clickButton('Next page')
    })

    expect(text('First row id')).toBe('10')
    expect(harnessRenderCount).toBe(2)
  })

  it('scopes re-renders to the components that read each state slice', () => {
    let rowsReaderRenderCount = 0
    let selectionReaderRenderCount = 0
    let ownerRenderCount = 0

    function RowsReader({ table }: { table: TestTable }) {
      rowsReaderRenderCount++
      return (
        <output aria-label="First row id">
          {table.getRowModel().rows[0]?.original.id ?? -1}
        </output>
      )
    }

    function SelectionReader({ table }: { table: TestTable }) {
      selectionReaderRenderCount++
      return (
        <output aria-label="Selected count">
          {Object.keys(table.atoms.rowSelection.get()).length}
        </output>
      )
    }

    function Harness() {
      ownerRenderCount++
      const table = useSignalTable({
        features,
        columns,
        data,
      })

      return (
        <>
          <RowsReader table={table} />
          <SelectionReader table={table} />
          <button onClick={() => table.nextPage()}>Next page</button>
          <button onClick={() => table.toggleAllRowsSelected()}>
            Toggle all
          </button>
        </>
      )
    }

    render(<Harness />)

    expect(rowsReaderRenderCount).toBe(1)
    expect(selectionReaderRenderCount).toBe(1)
    expect(ownerRenderCount).toBe(1)

    act(() => {
      clickButton('Toggle all')
    })

    // Selection changed: only the component that read rowSelection re-renders.
    expect(text('Selected count')).toBe('100')
    expect(selectionReaderRenderCount).toBe(2)
    expect(rowsReaderRenderCount).toBe(1)
    expect(ownerRenderCount).toBe(1)

    act(() => {
      clickButton('Next page')
    })

    // Pagination changed: only the row-model reader re-renders.
    expect(text('First row id')).toBe('10')
    expect(rowsReaderRenderCount).toBe(2)
    expect(selectionReaderRenderCount).toBe(2)
    expect(ownerRenderCount).toBe(1)
  })

  it('syncs a signalAtom-wrapped external signal in both directions', () => {
    const pagination = signal<PaginationState>({ pageIndex: 3, pageSize: 10 })

    function Harness() {
      const table = useSignalTable({
        features,
        columns,
        data,
        atoms: {
          pagination: signalAtom(pagination),
        },
      })

      return (
        <>
          <output aria-label="First row id">
            {table.getRowModel().rows[0]?.original.id ?? -1}
          </output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<Harness />)

    // The table starts from the external signal's value.
    expect(text('First row id')).toBe('30')

    act(() => {
      clickButton('Next page')
    })

    // Table APIs write back to the external signal.
    expect(pagination.value.pageIndex).toBe(4)
    expect(text('First row id')).toBe('40')

    act(() => {
      pagination.value = { pageIndex: 0, pageSize: 10 }
    })

    // External writes flow into the table and re-render readers.
    expect(text('First row id')).toBe('0')
  })

  it('picks up new options such as a replaced data array', () => {
    function Harness() {
      const [rows, setRows] = useState(data)
      const table = useSignalTable({
        features,
        columns,
        data: rows,
      })

      return (
        <>
          <output aria-label="First row id">
            {table.getRowModel().rows[0]?.original.id ?? -1}
          </output>
          <button onClick={() => setRows([{ id: 500 }])}>Replace data</button>
        </>
      )
    }

    render(<Harness />)

    expect(text('First row id')).toBe('0')

    act(() => {
      clickButton('Replace data')
    })

    expect(text('First row id')).toBe('500')
  })

  it('stops syncing external signals after unmount', () => {
    const pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })
    let latestTable: TestTable | undefined

    function Harness() {
      const table = useSignalTable({
        features,
        columns,
        data,
        atoms: {
          pagination: signalAtom(pagination),
        },
      })
      latestTable = table

      return null
    }

    const { unmount } = render(<Harness />)

    act(() => {
      latestTable!.nextPage()
    })
    expect(pagination.value.pageIndex).toBe(1)

    unmount()

    act(() => {
      pagination.value = { pageIndex: 9, pageSize: 10 }
    })

    // The two-way sync subscriptions were disposed on unmount, so the
    // unmounted table no longer observes the external signal.
    expect(latestTable!.atoms.pagination.get().pageIndex).toBe(1)
  })
})
