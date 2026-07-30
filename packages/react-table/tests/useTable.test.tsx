// @vitest-environment jsdom

import * as React from 'react'
import {
  act,
  cleanup,
  fireEvent,
  screen,
  render as testingLibraryRender,
} from '@testing-library/react'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { createAtom } from '@tanstack/react-store'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTable } from '../src/useTable'
import type { ColumnDef, PaginationState } from '@tanstack/table-core'
import type { ReactTable } from '../src/useTable'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

type TestRow = {
  id: number
}

type NullSelectedTable = ReactTable<typeof features, TestRow, null>

const data: ReadonlyArray<TestRow> = Array.from({ length: 100 }, (_, id) => ({
  id,
}))
const columns: ReadonlyArray<ColumnDef<typeof features, TestRow>> = []

const IsolatedPaginationSubscriber = React.memo(
  function IsolatedPaginationSubscriber({
    Subscribe,
  }: {
    Subscribe: NullSelectedTable['Subscribe']
  }) {
    return (
      <Subscribe selector={(state) => state.pagination.pageIndex}>
        {(pageIndex) => (
          <output aria-label="Isolated page index">{pageIndex}</output>
        )}
      </Subscribe>
    )
  },
)

function render(element: React.ReactNode) {
  return testingLibraryRender(element)
}

function text(name: string) {
  return screen.getByRole('status', { name }).textContent
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('useTable state subscriptions', () => {
  it('renders each controlled update once without a redundant commit render', () => {
    let harnessRenderCount = 0
    let setControlledPagination: React.Dispatch<
      React.SetStateAction<PaginationState>
    >

    function ControlledStateHarness() {
      harnessRenderCount++
      const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      setControlledPagination = setPagination

      const table = useTable(
        {
          features,
          columns,
          data,
          state: {
            pagination,
          },
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <output aria-label="Controlled source page index">{table.state}</output>
      )
    }

    render(<ControlledStateHarness />)

    expect(harnessRenderCount).toBe(1)

    act(() => {
      setControlledPagination!({
        pageIndex: 1,
        pageSize: 10,
      })
    })

    expect(text('Controlled source page index')).toBe('1')
    expect(harnessRenderCount).toBe(2)
  })

  it('resolves changes in slice ownership', () => {
    let harnessRenderCount = 0

    function OwnershipChangeHarness() {
      harnessRenderCount++
      const [controlled, setControlled] = React.useState(true)
      const [pagination] = React.useState<PaginationState>({
        pageIndex: 5,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: controlled
            ? {
                pagination,
              }
            : undefined,
        },
        (state) => state.pagination,
      )

      return (
        <>
          <button onClick={() => setControlled((value) => !value)}>
            Toggle ownership
          </button>
          <button onClick={() => table.nextPage()}>Next page</button>
          <output aria-label="Ownership page index">
            {table.state.pageIndex}
          </output>
        </>
      )
    }

    render(<OwnershipChangeHarness />)

    const pageIndex = () => text('Ownership page index')

    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(1)

    act(() => {
      click('Toggle ownership')
    })

    // Releasing control exposes the last committed controlled value in the
    // base atom and installs the internal-atom subscription.
    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(2)

    act(() => {
      click('Next page')
    })

    expect(pageIndex()).toBe('6')
    expect(harnessRenderCount).toBe(3)

    act(() => {
      click('Toggle ownership')
    })

    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(4)

    act(() => {
      click('Next page')
    })

    // The controlled prop owns the slice again; base writes are not observed
    // by the root hook.
    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(4)
  })

  it('invalidates an isolated subscriber when a controlled slice is released', () => {
    function OwnershipReleaseHarness() {
      const [controlled, setControlled] = React.useState(true)
      const [pagination] = React.useState<PaginationState>({
        pageIndex: 5,
        pageSize: 10,
      })
      const table = useTable(
        {
          features,
          columns,
          data,
          state: controlled ? { pagination } : undefined,
        },
        () => null,
      )

      return (
        <>
          <IsolatedPaginationSubscriber Subscribe={table.Subscribe} />
          <button onClick={() => table.nextPage()}>Change base</button>
          <button onClick={() => setControlled(false)}>Release control</button>
        </>
      )
    }

    render(<OwnershipReleaseHarness />)

    const isolatedPageIndex = () => text('Isolated page index')

    expect(isolatedPageIndex()).toBe('5')

    act(() => {
      click('Change base')
    })

    // The controlled value still wins even though the internal base moved.
    expect(isolatedPageIndex()).toBe('5')

    act(() => {
      click('Release control')
    })

    expect(isolatedPageIndex()).toBe('6')
  })

  it('subscribes to an external atom without an outer React subscription', () => {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
    let harnessRenderCount = 0

    function ExternalAtomHarness() {
      harnessRenderCount++
      const table = useTable(
        {
          features,
          columns,
          data,
          atoms: {
            pagination: paginationAtom,
          },
          autoResetPageIndex: false,
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output aria-label="External atom page index">{table.state}</output>
          <output aria-label="External atom first row">
            {table.getRowModel().rows[0]?.original.id}
          </output>
        </>
      )
    }

    render(<ExternalAtomHarness />)

    expect(harnessRenderCount).toBe(1)

    act(() => {
      paginationAtom.set({
        pageIndex: 0,
        pageSize: 20,
      })
    })

    expect(harnessRenderCount).toBe(1)

    act(() => {
      paginationAtom.set({
        pageIndex: 1,
        pageSize: 20,
      })
    })

    expect(text('External atom page index')).toBe('1')
    expect(text('External atom first row')).toBe('20')
    expect(harnessRenderCount).toBe(2)
  })

  it('gives an external atom precedence over controlled state for the same slice', () => {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 3,
      pageSize: 10,
    })
    let harnessRenderCount = 0
    let setControlledPagination: React.Dispatch<
      React.SetStateAction<PaginationState>
    >

    function MixedOwnershipHarness() {
      harnessRenderCount++
      const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      setControlledPagination = setPagination

      const table = useTable(
        {
          features,
          columns,
          data,
          atoms: {
            pagination: paginationAtom,
          },
          state: {
            pagination,
          },
          autoResetPageIndex: false,
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output aria-label="Mixed page index">{table.state}</output>
          <output aria-label="Mixed first row">
            {table.getRowModel().rows[0]?.original.id}
          </output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<MixedOwnershipHarness />)

    expect(text('Mixed page index')).toBe('3')
    expect(text('Mixed first row')).toBe('30')
    expect(harnessRenderCount).toBe(1)

    act(() => {
      setControlledPagination!({
        pageIndex: 7,
        pageSize: 10,
      })
    })

    expect(text('Mixed page index')).toBe('3')
    expect(harnessRenderCount).toBe(2)

    act(() => {
      paginationAtom.set({
        pageIndex: 3,
        pageSize: 20,
      })
    })

    expect(harnessRenderCount).toBe(2)

    act(() => {
      paginationAtom.set({
        pageIndex: 4,
        pageSize: 10,
      })
    })

    expect(text('Mixed page index')).toBe('4')
    expect(text('Mixed first row')).toBe('40')
    expect(harnessRenderCount).toBe(3)

    act(() => {
      click('Next page')
    })

    expect(paginationAtom.get()).toEqual({
      pageIndex: 5,
      pageSize: 10,
    })
    expect(text('Mixed page index')).toBe('5')
    expect(text('Mixed first row')).toBe('50')
    expect(harnessRenderCount).toBe(4)
  })

  it('does not mutate base state or notify subscribers from a suspended render', () => {
    const suspendedRender = new Promise<never>(() => {})
    let committedTable: ReactTable<typeof features, TestRow, PaginationState>

    function SuspendedRender({ suspend }: { suspend: boolean }) {
      if (suspend) {
        throw suspendedRender
      }

      return null
    }

    function ConcurrentPaginationHarness() {
      const [version, setVersion] = React.useState(0)
      const pagination: PaginationState = {
        pageIndex: version,
        pageSize: 10,
      }
      const table = useTable(
        {
          features,
          columns,
          data,
          state: {
            pagination,
          },
        },
        (state) => state.pagination,
      )

      React.useLayoutEffect(() => {
        committedTable = table
      }, [table])

      return (
        <>
          <output aria-label="Committed page index">
            {table.state.pageIndex}
          </output>
          <button
            onClick={() => {
              React.startTransition(() => setVersion(1))
            }}
          >
            Suspend next render
          </button>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output aria-label="Isolated page index">{pageIndex}</output>
            )}
          </table.Subscribe>
          <SuspendedRender suspend={version === 1} />
        </>
      )
    }

    render(<ConcurrentPaginationHarness />)

    expect(text('Committed page index')).toBe('0')
    const storeNotifications: Array<number> = []
    const subscription = committedTable!.store.subscribe((state) => {
      storeNotifications.push(state.pagination.pageIndex)
    })

    act(() => {
      click('Suspend next render')
    })

    // The previous UI is still committed while the transition is suspended.
    expect(text('Committed page index')).toBe('0')
    expect(text('Isolated page index')).toBe('0')
    const committedBasePageIndex =
      committedTable!.baseAtoms.pagination.get().pageIndex

    subscription.unsubscribe()

    expect(committedBasePageIndex).toBe(0)
    expect(storeNotifications).toEqual([])
  })

  it('keeps imperative table.setOptions eager outside render', () => {
    let latestTable: ReactTable<typeof features, TestRow, PaginationState>

    function ImperativeOptionsHarness() {
      const table = useTable(
        {
          features,
          columns,
          data,
        },
        (state) => state.pagination,
      )
      React.useEffect(() => {
        latestTable = table
      }, [table])

      return (
        <>
          <output aria-label="Imperative page index">
            {table.state.pageIndex}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output aria-label="Imperative subscriber page index">
                {pageIndex}
              </output>
            )}
          </table.Subscribe>
        </>
      )
    }

    render(<ImperativeOptionsHarness />)

    const notifications: Array<number> = []
    const subscription = latestTable!.store.subscribe((state) => {
      notifications.push(state.pagination.pageIndex)
    })
    const pagination = { pageIndex: 3, pageSize: 10 }

    act(() => {
      latestTable!.setOptions((options) => ({
        ...options,
        state: { ...options.state, pagination },
      }))
    })

    expect(latestTable!.atoms.pagination.get()).toEqual(pagination)
    expect(latestTable!.store.get().pagination).toEqual(pagination)
    expect(text('Imperative page index')).toBe('3')
    expect(text('Imperative subscriber page index')).toBe('3')
    expect(notifications).toEqual([3])

    subscription.unsubscribe()
  })

  it('publishes controlled pagination after commit without a render-phase update', () => {
    const renderSnapshots: Array<{
      controlled: number
      selected: number
      atom: number
      store: number
      stableStoreSnapshot: boolean
      firstRow: number
    }> = []

    function ControlledPaginationHarness() {
      const [pagination, setPagination] = React.useState<PaginationState>({
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
        (state) => state,
      )

      const firstStoreSnapshot = table.store.get()
      const secondStoreSnapshot = table.store.get()

      renderSnapshots.push({
        controlled: pagination.pageIndex,
        selected: table.state.pagination.pageIndex,
        atom: table.atoms.pagination.get().pageIndex,
        store: firstStoreSnapshot.pagination.pageIndex,
        stableStoreSnapshot: Object.is(firstStoreSnapshot, secondStoreSnapshot),
        firstRow: table.getRowModel().rows[0]?.original.id ?? -1,
      })

      return (
        <>
          <output aria-label="Selected page index">
            {table.state.pagination.pageIndex}
          </output>
          <output aria-label="Atom page index">
            {table.atoms.pagination.get().pageIndex}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output aria-label="Subscribed page index">{pageIndex}</output>
            )}
          </table.Subscribe>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error')

    render(
      <React.StrictMode>
        <ControlledPaginationHarness />
      </React.StrictMode>,
    )

    const pageIndex = () => text('Selected page index')
    const atomPageIndex = () => text('Atom page index')
    const subscribedPageIndex = () => text('Subscribed page index')

    expect(pageIndex()).toBe('0')
    expect(atomPageIndex()).toBe('0')
    expect(subscribedPageIndex()).toBe('0')
    act(() => {
      click('Next page')
    })
    expect(pageIndex()).toBe('1')
    expect(atomPageIndex()).toBe('1')
    expect(subscribedPageIndex()).toBe('1')

    act(() => {
      click('Next page')
    })
    expect(pageIndex()).toBe('2')
    expect(atomPageIndex()).toBe('2')
    expect(subscribedPageIndex()).toBe('2')
    expect(renderSnapshots).toContainEqual({
      controlled: 1,
      selected: 1,
      atom: 1,
      store: 1,
      stableStoreSnapshot: true,
      firstRow: 10,
    })
    expect(renderSnapshots).toContainEqual({
      controlled: 2,
      selected: 2,
      atom: 2,
      store: 2,
      stableStoreSnapshot: true,
      firstRow: 20,
    })
    expect(
      renderSnapshots.every(
        ({
          controlled,
          selected,
          atom,
          store,
          stableStoreSnapshot,
          firstRow,
        }) =>
          controlled === selected &&
          selected === atom &&
          atom === store &&
          stableStoreSnapshot &&
          firstRow === controlled * 10,
      ),
    ).toBe(true)

    const errors = consoleError.mock.calls.flat().map(String).join('\n')

    expect(errors).not.toContain('Cannot update a component')
  })

  it('updates an isolated subscriber after rapid controlled updates', () => {
    function IsolatedControlledPaginationHarness() {
      const [pagination, setPagination] = React.useState<PaginationState>({
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
        () => null,
      )

      return (
        <>
          <output aria-label="Controlled page index">
            {pagination.pageIndex}
          </output>
          <IsolatedPaginationSubscriber Subscribe={table.Subscribe} />
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

    const consoleError = vi.spyOn(console, 'error')

    render(<IsolatedControlledPaginationHarness />)

    const controlledPageIndex = () => text('Controlled page index')
    const isolatedPageIndex = () => text('Isolated page index')

    expect(controlledPageIndex()).toBe('0')
    expect(isolatedPageIndex()).toBe('0')

    act(() => {
      click('Advance three pages')
    })

    expect(controlledPageIndex()).toBe('3')
    expect(isolatedPageIndex()).toBe('3')

    const errors = consoleError.mock.calls.flat().map(String).join('\n')

    expect(errors).not.toContain('Cannot update a component')
  })

  it('does not re-render when an uncontrolled update misses the selected slice', () => {
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
          <output aria-label="Harness render count">
            {harnessRenderCount}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageSize}>
            {(pageSize) => (
              <output aria-label="Subscribed page size">{pageSize}</output>
            )}
          </table.Subscribe>
          <button onClick={() => table.setPageSize(20)}>Resize page</button>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    render(<SelectedPageIndexHarness />)

    const selectedPageIndex = () => text('Selected page index')
    const subscribedPageSize = () => text('Subscribed page size')

    expect(harnessRenderCount).toBe(1)
    expect(selectedPageIndex()).toBe('0')
    expect(subscribedPageSize()).toBe('10')

    act(() => {
      click('Resize page')
    })

    expect(harnessRenderCount).toBe(1)
    expect(selectedPageIndex()).toBe('0')
    expect(subscribedPageSize()).toBe('20')

    act(() => {
      click('Next page')
    })

    expect(harnessRenderCount).toBe(2)
    expect(selectedPageIndex()).toBe('1')
  })

  it('settles when a controlled slice is recreated during an unrelated render', () => {
    let harnessRenderCount = 0

    function RecreatedControlledSliceHarness() {
      harnessRenderCount++
      const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      const [tick, setTick] = React.useState(0)
      const table = useTable(
        {
          features,
          columns,
          data,
          state: {
            pagination: { ...pagination },
          },
          onPaginationChange: setPagination,
        },
        (state) => state,
      )

      return (
        <>
          <output aria-label="Unrelated tick">{tick}</output>
          <output aria-label="Recreated page index">
            {table.state.pagination.pageIndex}
          </output>
          <output aria-label="Recreated atom page index">
            {table.atoms.pagination.get().pageIndex}
          </output>
          <button onClick={() => setTick((value) => value + 1)}>
            Unrelated update
          </button>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error')

    render(<RecreatedControlledSliceHarness />)

    expect(harnessRenderCount).toBe(1)

    act(() => {
      click('Unrelated update')
    })

    expect(text('Unrelated tick')).toBe('1')
    expect(text('Recreated page index')).toBe('0')
    expect(harnessRenderCount).toBe(2)

    act(() => {
      click('Next page')
    })

    expect(text('Recreated page index')).toBe('1')
    expect(text('Recreated atom page index')).toBe('1')
    expect(harnessRenderCount).toBe(3)

    const errors = consoleError.mock.calls.flat().map(String).join('\n')

    expect(errors).not.toContain('Maximum update depth exceeded')
  })

  it('returns the selected slice and still reacts to uncontrolled updates', () => {
    function UncontrolledPaginationHarness() {
      const table = useTable(
        {
          features,
          columns,
          data,
        },
        (state) => ({
          pageIndex: state.pagination.pageIndex,
        }),
      )

      return (
        <>
          <output aria-label="Page index">{table.state.pageIndex}</output>
          <output aria-label="Selected state">
            {JSON.stringify(table.state)}
          </output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error')

    render(<UncontrolledPaginationHarness />)

    const pageIndex = () => text('Page index')
    const selectedState = () => text('Selected state')

    expect(selectedState()).toBe('{"pageIndex":0}')
    expect(pageIndex()).toBe('0')
    act(() => {
      click('Next page')
    })
    expect(pageIndex()).toBe('1')

    act(() => {
      click('Next page')
    })
    expect(pageIndex()).toBe('2')

    const errors = consoleError.mock.calls.flat().map(String).join('\n')

    expect(errors).not.toContain('The result of getSnapshot should be cached')
  })
})
