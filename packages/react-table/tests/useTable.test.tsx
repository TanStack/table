import * as React from 'react'
import { createRoot } from 'react-dom/client'
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
import type { Root } from 'react-dom/client'

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
          <output data-testid="isolated-page-index">{pageIndex}</output>
        )}
      </Subscribe>
    )
  },
)

let container: HTMLDivElement | undefined
let root: Root | undefined

function render(element: React.ReactNode) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)

  React.act(() => {
    root!.render(element)
  })
}

afterEach(() => {
  if (root) {
    React.act(() => {
      root!.unmount()
    })
  }

  container?.remove()
  container = undefined
  root = undefined
  vi.restoreAllMocks()
})

describe('useTable state subscriptions', () => {
  it('reads controlled state from the live table store', () => {
    let harnessRenderCount = 0
    let setControlledPagination: React.Dispatch<
      React.SetStateAction<PaginationState>
    >
    let storeSubscribe: ReturnType<typeof vi.spyOn> | undefined

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

      // useSyncExternalStore subscribes after render. Installing the spy here
      // distinguishes the root adapter subscription from table construction.
      storeSubscribe ??= vi.spyOn(table.store, 'subscribe')

      return (
        <output data-testid="controlled-source-page-index">
          {table.state}
        </output>
      )
    }

    render(<ControlledStateHarness />)

    expect(storeSubscribe).toHaveBeenCalledTimes(1)
    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      setControlledPagination!({
        pageIndex: 1,
        pageSize: 10,
      })
    })

    expect(
      container?.querySelector('[data-testid="controlled-source-page-index"]')
        ?.textContent,
    ).toBe('1')
    expect(harnessRenderCount).toBe(2)
    expect(storeSubscribe).toHaveBeenCalledTimes(1)
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
          <button
            data-testid="toggle-ownership"
            onClick={() => setControlled((value) => !value)}
          />
          <button data-testid="next-page" onClick={() => table.nextPage()} />
          <output data-testid="ownership-page-index">
            {table.state.pageIndex}
          </output>
        </>
      )
    }

    render(<OwnershipChangeHarness />)

    const pageIndex = () =>
      container?.querySelector('[data-testid="ownership-page-index"]')
        ?.textContent

    const toggleOwnership = () => {
      const button = container?.querySelector<HTMLButtonElement>(
        '[data-testid="toggle-ownership"]',
      )
      button?.click()
    }

    const nextPage = () => {
      const button = container?.querySelector<HTMLButtonElement>(
        '[data-testid="next-page"]',
      )
      button?.click()
    }

    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      toggleOwnership()
    })

    // Releasing control exposes the last committed controlled value in the
    // base atom and installs the internal-atom subscription.
    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(2)

    React.act(() => {
      nextPage()
    })

    expect(pageIndex()).toBe('6')
    expect(harnessRenderCount).toBe(3)

    React.act(() => {
      toggleOwnership()
    })

    expect(pageIndex()).toBe('5')
    expect(harnessRenderCount).toBe(4)

    React.act(() => {
      nextPage()
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
          <button data-action="change-base" onClick={() => table.nextPage()} />
          <button
            data-action="release-control"
            onClick={() => setControlled(false)}
          />
        </>
      )
    }

    render(<OwnershipReleaseHarness />)

    const isolatedPageIndex = () =>
      container?.querySelector('[data-testid="isolated-page-index"]')
        ?.textContent

    expect(isolatedPageIndex()).toBe('5')

    React.act(() => {
      container
        ?.querySelector('[data-action="change-base"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // The controlled value still wins even though the internal base moved.
    expect(isolatedPageIndex()).toBe('5')

    React.act(() => {
      container
        ?.querySelector('[data-action="release-control"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
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
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output data-testid="external-atom-page-index">{table.state}</output>
          <output data-testid="external-atom-first-row">
            {table.getRowModel().rows[0]?.original.id}
          </output>
        </>
      )
    }

    render(<ExternalAtomHarness />)

    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      paginationAtom.set({
        pageIndex: 0,
        pageSize: 20,
      })
    })

    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      paginationAtom.set({
        pageIndex: 1,
        pageSize: 20,
      })
    })

    expect(
      container?.querySelector('[data-testid="external-atom-page-index"]')
        ?.textContent,
    ).toBe('1')
    expect(
      container?.querySelector('[data-testid="external-atom-first-row"]')
        ?.textContent,
    ).toBe('20')
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
        },
        (state) => state.pagination.pageIndex,
      )

      return (
        <>
          <output data-testid="mixed-page-index">{table.state}</output>
          <output data-testid="mixed-first-row">
            {table.getRowModel().rows[0]?.original.id}
          </output>
        </>
      )
    }

    render(<MixedOwnershipHarness />)

    expect(
      container?.querySelector('[data-testid="mixed-page-index"]')?.textContent,
    ).toBe('3')
    expect(
      container?.querySelector('[data-testid="mixed-first-row"]')?.textContent,
    ).toBe('30')
    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      setControlledPagination!({
        pageIndex: 7,
        pageSize: 10,
      })
    })

    expect(
      container?.querySelector('[data-testid="mixed-page-index"]')?.textContent,
    ).toBe('3')
    expect(harnessRenderCount).toBe(2)

    React.act(() => {
      paginationAtom.set({
        pageIndex: 3,
        pageSize: 20,
      })
    })

    expect(harnessRenderCount).toBe(2)

    React.act(() => {
      paginationAtom.set({
        pageIndex: 4,
        pageSize: 10,
      })
    })

    expect(
      container?.querySelector('[data-testid="mixed-page-index"]')?.textContent,
    ).toBe('4')
    expect(
      container?.querySelector('[data-testid="mixed-first-row"]')?.textContent,
    ).toBe('40')
    expect(harnessRenderCount).toBe(3)
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
          <output data-testid="committed-page-index">
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
              <output data-testid="isolated-page-index">{pageIndex}</output>
            )}
          </table.Subscribe>
          <SuspendedRender suspend={version === 1} />
        </>
      )
    }

    render(<ConcurrentPaginationHarness />)

    expect(
      container?.querySelector('[data-testid="committed-page-index"]')
        ?.textContent,
    ).toBe('0')
    const storeNotifications: Array<number> = []
    const subscription = committedTable!.store.subscribe((state) => {
      storeNotifications.push(state.pagination.pageIndex)
    })

    React.act(() => {
      container?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      )
    })

    // The previous UI is still committed while the transition is suspended.
    expect(
      container?.querySelector('[data-testid="committed-page-index"]')
        ?.textContent,
    ).toBe('0')
    expect(
      container?.querySelector('[data-testid="isolated-page-index"]')
        ?.textContent,
    ).toBe('0')
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
      latestTable = table

      return (
        <>
          <output data-testid="imperative-page-index">
            {table.state.pageIndex}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output data-testid="imperative-subscriber">{pageIndex}</output>
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

    React.act(() => {
      latestTable!.setOptions((options) => ({
        ...options,
        state: { ...options.state, pagination },
      }))
    })

    expect(latestTable!.baseAtoms.pagination.get()).toBe(pagination)
    expect(latestTable!.store.get().pagination).toBe(pagination)
    expect(
      container?.querySelector('[data-testid="imperative-page-index"]')
        ?.textContent,
    ).toBe('3')
    expect(
      container?.querySelector('[data-testid="imperative-subscriber"]')
        ?.textContent,
    ).toBe('3')
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
          <output data-testid="page-index">
            {table.state.pagination.pageIndex}
          </output>
          <output data-testid="atom-page-index">
            {table.atoms.pagination.get().pageIndex}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageIndex}>
            {(pageIndex) => (
              <output data-testid="subscribed-page-index">{pageIndex}</output>
            )}
          </table.Subscribe>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <React.StrictMode>
        <ControlledPaginationHarness />
      </React.StrictMode>,
    )

    const pageIndex = () =>
      container?.querySelector('[data-testid="page-index"]')?.textContent
    const atomPageIndex = () =>
      container?.querySelector('[data-testid="atom-page-index"]')?.textContent
    const subscribedPageIndex = () =>
      container?.querySelector('[data-testid="subscribed-page-index"]')
        ?.textContent
    const nextPage = () =>
      container?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      )

    expect(pageIndex()).toBe('0')
    expect(atomPageIndex()).toBe('0')
    expect(subscribedPageIndex()).toBe('0')
    React.act(() => {
      nextPage()
    })
    expect(pageIndex()).toBe('1')
    expect(atomPageIndex()).toBe('1')
    expect(subscribedPageIndex()).toBe('1')

    React.act(() => {
      nextPage()
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
          <output data-testid="controlled-page-index">
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

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<IsolatedControlledPaginationHarness />)

    const controlledPageIndex = () =>
      container?.querySelector('[data-testid="controlled-page-index"]')
        ?.textContent
    const isolatedPageIndex = () =>
      container?.querySelector('[data-testid="isolated-page-index"]')
        ?.textContent

    expect(controlledPageIndex()).toBe('0')
    expect(isolatedPageIndex()).toBe('0')

    React.act(() => {
      container?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      )
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
          <output data-testid="selected-page-index">{table.state}</output>
          <output data-testid="harness-render-count">
            {harnessRenderCount}
          </output>
          <table.Subscribe selector={(state) => state.pagination.pageSize}>
            {(pageSize) => (
              <output data-testid="subscribed-page-size">{pageSize}</output>
            )}
          </table.Subscribe>
          <button
            data-action="resize-page"
            onClick={() => table.setPageSize(20)}
          >
            Resize page
          </button>
          <button data-action="next-page" onClick={() => table.nextPage()}>
            Next page
          </button>
        </>
      )
    }

    render(<SelectedPageIndexHarness />)

    const selectedPageIndex = () =>
      container?.querySelector('[data-testid="selected-page-index"]')
        ?.textContent
    const subscribedPageSize = () =>
      container?.querySelector('[data-testid="subscribed-page-size"]')
        ?.textContent

    expect(harnessRenderCount).toBe(1)
    expect(selectedPageIndex()).toBe('0')
    expect(subscribedPageSize()).toBe('10')

    React.act(() => {
      container
        ?.querySelector('[data-action="resize-page"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(harnessRenderCount).toBe(1)
    expect(selectedPageIndex()).toBe('0')
    expect(subscribedPageSize()).toBe('20')

    React.act(() => {
      container
        ?.querySelector('[data-action="next-page"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
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
          <output data-testid="unrelated-tick">{tick}</output>
          <output data-testid="recreated-page-index">
            {table.state.pagination.pageIndex}
          </output>
          <output data-testid="recreated-atom-page-index">
            {table.atoms.pagination.get().pageIndex}
          </output>
          <button
            data-action="unrelated-update"
            onClick={() => setTick((value) => value + 1)}
          >
            Unrelated update
          </button>
          <button
            data-action="controlled-next-page"
            onClick={() => table.nextPage()}
          >
            Next page
          </button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<RecreatedControlledSliceHarness />)

    expect(harnessRenderCount).toBe(1)

    React.act(() => {
      container
        ?.querySelector('[data-action="unrelated-update"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(
      container?.querySelector('[data-testid="unrelated-tick"]')?.textContent,
    ).toBe('1')
    expect(
      container?.querySelector('[data-testid="recreated-page-index"]')
        ?.textContent,
    ).toBe('0')
    expect(harnessRenderCount).toBe(2)

    React.act(() => {
      container
        ?.querySelector('[data-action="controlled-next-page"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(
      container?.querySelector('[data-testid="recreated-page-index"]')
        ?.textContent,
    ).toBe('1')
    expect(
      container?.querySelector('[data-testid="recreated-atom-page-index"]')
        ?.textContent,
    ).toBe('1')
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
          <output data-testid="page-index">{table.state.pageIndex}</output>
          <output data-testid="selected-state">
            {JSON.stringify(table.state)}
          </output>
          <button onClick={() => table.nextPage()}>Next page</button>
        </>
      )
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<UncontrolledPaginationHarness />)

    const pageIndex = () =>
      container?.querySelector('[data-testid="page-index"]')?.textContent
    const selectedState = () =>
      container?.querySelector('[data-testid="selected-state"]')?.textContent
    const nextPage = () =>
      container?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      )

    expect(selectedState()).toBe('{"pageIndex":0}')
    expect(pageIndex()).toBe('0')
    React.act(() => {
      nextPage()
    })
    expect(pageIndex()).toBe('1')

    React.act(() => {
      nextPage()
    })
    expect(pageIndex()).toBe('2')

    const errors = consoleError.mock.calls.flat().map(String).join('\n')

    expect(errors).not.toContain('The result of getSnapshot should be cached')
  })
})
