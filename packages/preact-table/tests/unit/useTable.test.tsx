import { render } from 'preact'
import { useState } from 'preact/hooks'
import { act } from 'preact/test-utils'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { afterEach, describe, expect, it } from 'vitest'
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

let container: HTMLDivElement | undefined

function mount(ui: preact.ComponentChildren) {
  container = document.createElement('div')
  document.body.append(container)
  act(() => {
    render(ui as any, container!)
  })
}

function clickButton() {
  container?.querySelector('button')?.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
    }),
  )
}

afterEach(() => {
  if (container) {
    act(() => {
      render(null, container!)
    })
    container.remove()
    container = undefined
  }
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

    mount(<ControlledPaginationHarness />)
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
    expect(renderSnapshots[2]).toMatchObject({ controlled: 2, firstRow: 20 })
  })

  it('notifies external store subscribers exactly once per controlled update, after commit', () => {
    let latestTable:
      | PreactTable<typeof features, TestRow, PaginationState>
      | undefined
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

    mount(<PublicationHarness />)

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

      return <button onClick={() => table.nextPage()}>{table.state}</button>
    }

    mount(<UncontrolledHarness />)
    expect(harnessRenderCount).toBe(1)
    expect(container?.querySelector('button')?.textContent).toBe('0')

    act(() => {
      clickButton()
    })

    expect(harnessRenderCount).toBe(2)
    expect(container?.querySelector('button')?.textContent).toBe('1')
  })
})
