import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { useState } from 'preact/hooks'
import { act } from 'preact/test-utils'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { createAtom } from '@tanstack/preact-store'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTable } from '../../src/useTable'
import type { ColumnDef, PaginationState } from '@tanstack/table-core'
import type { PreactTable } from '../../src/useTable'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

type TestRow = {
  id: number
}

const data: ReadonlyArray<TestRow> = Array.from({ length: 100 }, (_, id) => ({
  id,
}))
const columns: ReadonlyArray<ColumnDef<typeof features, TestRow>> = []

function text(name: string) {
  return screen.getByRole('status', { name }).textContent
}

function clickButton(name = 'Next page') {
  fireEvent.click(screen.getByRole('button', { name }))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('useTable controlled state', () => {
  it('renders each controlled update in a single pass with consistent reads', () => {
    const renderSnapshots: Array<{
      controlled: number
      selected: number
      atom: number
      store: number
      firstRow: number
    }> = []

    function ControlledPaginationHarness() {
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: {
            pagination,
          },
          onPaginationChange: setPagination,
        },
        (state) => state.pagination,
      )

      renderSnapshots.push({
        controlled: pagination.pageIndex,
        selected: table.state.pageIndex,
        atom: table.atoms.pagination.get().pageIndex,
        store: table.store.get().pagination.pageIndex,
        firstRow: table.getRowModel().rows[0]?.original.id ?? -1,
      })

      return <button onClick={() => table.nextPage()}>Next page</button>
    }

    render(<ControlledPaginationHarness />)
    expect(renderSnapshots).toHaveLength(1)

    act(() => {
      clickButton()
    })
    // One render pass per controlled update: the root subscription must not
    // forward the post-commit publication back into the owner.
    expect(renderSnapshots).toHaveLength(2)

    act(() => {
      clickButton()
    })
    expect(renderSnapshots).toHaveLength(3)

    // Controlled prop, selected state, slice atom, aggregate store, and the
    // row model agree within every render pass.
    expect(
      renderSnapshots.every(
        ({ controlled, selected, atom, store, firstRow }) =>
          controlled === selected &&
          selected === atom &&
          atom === store &&
          firstRow === controlled * 10,
      ),
    ).toBe(true)
    expect(renderSnapshots).toEqual([
      {
        controlled: 0,
        selected: 0,
        atom: 0,
        store: 0,
        firstRow: 0,
      },
      {
        controlled: 1,
        selected: 1,
        atom: 1,
        store: 1,
        firstRow: 10,
      },
      {
        controlled: 2,
        selected: 2,
        atom: 2,
        store: 2,
        firstRow: 20,
      },
    ])
  })

  it('notifies external store subscribers exactly once per controlled update, after commit', () => {
    let latestTable:
      PreactTable<typeof features, TestRow, PaginationState> | undefined
    let harnessRenderCount = 0

    function PublicationHarness() {
      harnessRenderCount++
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: {
            pagination,
          },
          onPaginationChange: setPagination,
        },
        (state) => state.pagination,
      )
      latestTable = table

      return <button onClick={() => table.nextPage()}>Next page</button>
    }

    render(<PublicationHarness />)

    const notifications: Array<number> = []
    const subscription = latestTable!.store.subscribe((state) => {
      notifications.push(state.pagination.pageIndex)
    })

    act(() => {
      clickButton()
    })

    // The unfiltered public store still publishes the committed snapshot for
    // isolated consumers, without re-rendering the owner a second time.
    expect(notifications).toEqual([1])
    expect(harnessRenderCount).toBe(2)

    subscription.unsubscribe()
  })

  it('still re-renders for uncontrolled internal updates', () => {
    let harnessRenderCount = 0

    function UncontrolledHarness() {
      harnessRenderCount++
      const table = useTable(
        {
          features,
          columns,
          data,
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output aria-label="Uncontrolled page index">{table.state}</output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<UncontrolledHarness />)
    expect(harnessRenderCount).toBe(1)
    expect(text('Uncontrolled page index')).toBe('0')

    act(() => {
      clickButton()
    })

    expect(harnessRenderCount).toBe(2)
    expect(text('Uncontrolled page index')).toBe('1')
  })

  it('releases and reacquires ownership when the controlled slice is omitted', () => {
    let harnessRenderCount = 0

    function OwnershipHarness() {
      harnessRenderCount++
      const [controlled, setControlled] = useState(true)
      const [pagination] = useState<PaginationState>({
        pageIndex: 5,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: controlled ? { pagination } : {},
        },
        (state) => state.pagination,
      )

      return (
        <>
          <output aria-label="Ownership page index">
            {table.state.pageIndex}
          </output>
          <button onClick={() => setControlled((value) => !value)}>
            Toggle ownership
          </button>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<OwnershipHarness />)

    expect(text('Ownership page index')).toBe('5')
    expect(harnessRenderCount).toBe(1)

    act(() => {
      clickButton('Toggle ownership')
    })

    expect(text('Ownership page index')).toBe('5')
    expect(harnessRenderCount).toBe(2)

    act(() => {
      clickButton()
    })

    expect(text('Ownership page index')).toBe('6')
    expect(harnessRenderCount).toBe(3)

    act(() => {
      clickButton('Toggle ownership')
    })

    expect(text('Ownership page index')).toBe('5')
    expect(harnessRenderCount).toBe(4)

    act(() => {
      clickButton()
    })

    expect(text('Ownership page index')).toBe('5')
    expect(harnessRenderCount).toBe(4)
  })

  it('invalidates an isolated subscriber when the controlled slice is omitted', () => {
    function OwnershipReleaseHarness() {
      const [controlled, setControlled] = useState(true)
      const [pagination] = useState<PaginationState>({
        pageIndex: 5,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: controlled ? { pagination } : {},
        },
        () => null,
      )

      return (
        <>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output aria-label="Isolated page index">{pageIndex}</output>
            )}
          </table.Subscribe>
          <button onClick={() => table.nextPage()}>Change base</button>
          <button onClick={() => setControlled(false)}>Release control</button>
        </>
      )
    }

    render(<OwnershipReleaseHarness />)

    expect(text('Isolated page index')).toBe('5')

    act(() => {
      clickButton('Change base')
    })

    expect(text('Isolated page index')).toBe('5')

    act(() => {
      clickButton('Release control')
    })

    expect(text('Isolated page index')).toBe('6')
  })

  it('gives an external atom precedence over controlled state and writes back to it', () => {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 3,
      pageSize: 10,
    })

    function ExternalAtomHarness() {
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: { pagination },
          atoms: {
            pagination: paginationAtom,
          },
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output aria-label="External page index">{table.state}</output>
          <button
            onClick={() =>
              setPagination({
                pageIndex: 7,
                pageSize: 10,
              })
            }
          >
            Change controlled page
          </button>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<ExternalAtomHarness />)

    expect(text('External page index')).toBe('3')

    act(() => {
      clickButton('Change controlled page')
    })

    expect(text('External page index')).toBe('3')
    expect(paginationAtom.get().pageIndex).toBe(3)

    act(() => {
      clickButton()
    })

    expect(paginationAtom.get().pageIndex).toBe(4)
    expect(text('External page index')).toBe('4')
  })

  it('keeps the owner stable when an update misses its selected slice', () => {
    let harnessRenderCount = 0

    function SelectedPageIndexHarness() {
      harnessRenderCount++
      const table = useTable(
        {
          features,
          columns,
          data,
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output aria-label="Selected page index">{table.state}</output>
          <table.Subscribe selector={(state) => state.pagination.pageSize}>
            {(pageSize) => (
              <output aria-label="Isolated page size">{pageSize}</output>
            )}
          </table.Subscribe>
          <button onClick={() => table.setPageSize(20)}>
            Set page size to 20
          </button>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<SelectedPageIndexHarness />)

    expect(harnessRenderCount).toBe(1)
    expect(text('Selected page index')).toBe('0')
    expect(text('Isolated page size')).toBe('10')

    act(() => {
      clickButton('Set page size to 20')
    })

    expect(harnessRenderCount).toBe(1)
    expect(text('Selected page index')).toBe('0')
    expect(text('Isolated page size')).toBe('20')

    act(() => {
      clickButton()
    })

    expect(harnessRenderCount).toBe(2)
    expect(text('Selected page index')).toBe('1')
  })

  it('publishes the final value after rapid controlled updates', () => {
    function RapidUpdateHarness() {
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: { pagination },
          onPaginationChange: setPagination,
        },
        () => null,
      )

      return (
        <>
          <output aria-label="Controlled page index">
            {pagination.pageIndex}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output aria-label="Rapid isolated page index">
                {pageIndex}
              </output>
            )}
          </table.Subscribe>
          <button
            onClick={() => {
              table.nextPage()
              table.nextPage()
              table.nextPage()
            }}
          >
            Advance three pages
          </button>
        </>
      )
    }

    render(<RapidUpdateHarness />)

    expect(text('Controlled page index')).toBe('0')
    expect(text('Rapid isolated page index')).toBe('0')

    act(() => {
      clickButton('Advance three pages')
    })

    expect(text('Controlled page index')).toBe('3')
    expect(text('Rapid isolated page index')).toBe('3')
  })
})
