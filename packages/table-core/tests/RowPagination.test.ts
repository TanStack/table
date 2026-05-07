import { describe, expect, it, vi } from 'vitest'
import {
  ColumnDef,
  createTable,
  functionalUpdate,
  getCoreRowModel,
  PaginationState,
} from '../src'

type Person = {
  name: string
}

const data: Person[] = [{ name: 'Ada' }]
const columns: ColumnDef<Person>[] = [{ accessorKey: 'name' }]

function createPaginationTable(
  pagination: PaginationState,
  onPaginationChange = vi.fn(),
) {
  const table = createTable<Person>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange,
    onStateChange() {},
    renderFallbackValue: '',
    state: {
      pagination,
    },
  })

  return { table, onPaginationChange }
}

function createStatefulPaginationTable(pagination: PaginationState) {
  const state = { pagination }
  const onStateChange = vi.fn()
  const table = createTable<Person>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onStateChange,
    renderFallbackValue: '',
    state,
  })

  return { table, onStateChange, state }
}

describe('RowPagination', () => {
  it('keeps pagination state identity when resetting to the current page index', () => {
    const { table, onPaginationChange } = createPaginationTable({
      pageIndex: 0,
      pageSize: 10,
    })
    const pagination = table.getState().pagination

    table.resetPageIndex()

    expect(onPaginationChange).toHaveBeenCalledOnce()
    expect(
      functionalUpdate(onPaginationChange.mock.calls[0][0], pagination),
    ).toBe(pagination)
  })

  it('keeps table state identity when resetting to the current page index through the default state updater', () => {
    const { table, onStateChange, state } = createStatefulPaginationTable({
      pageIndex: 0,
      pageSize: 10,
    })

    table.resetPageIndex()

    expect(onStateChange).toHaveBeenCalledOnce()
    expect(functionalUpdate(onStateChange.mock.calls[0][0], state)).toBe(state)
  })

  it('does not drop a reset queued after another page index update', () => {
    const { table, onStateChange, state } = createStatefulPaginationTable({
      pageIndex: 0,
      pageSize: 10,
    })

    table.setPageIndex(1)
    table.resetPageIndex()

    expect(onStateChange).toHaveBeenCalledTimes(2)

    const stateAfterPageChange = functionalUpdate(
      onStateChange.mock.calls[0][0],
      state,
    )
    expect(stateAfterPageChange).not.toBe(state)
    expect(stateAfterPageChange.pagination.pageIndex).toBe(1)

    const stateAfterReset = functionalUpdate(
      onStateChange.mock.calls[1][0],
      stateAfterPageChange,
    )
    expect(stateAfterReset).not.toBe(stateAfterPageChange)
    expect(stateAfterReset.pagination.pageIndex).toBe(0)
  })

  it('emits a pagination change when resetting from a different page index', () => {
    const { table, onPaginationChange } = createPaginationTable({
      pageIndex: 1,
      pageSize: 10,
    })

    table.resetPageIndex()

    expect(onPaginationChange).toHaveBeenCalledOnce()
    expect(
      functionalUpdate(onPaginationChange.mock.calls[0][0], {
        pageIndex: 1,
        pageSize: 10,
      }),
    ).toEqual({
      pageIndex: 0,
      pageSize: 10,
    })
  })

  it('keeps pagination state identity when auto-resetting an already reset page index', async () => {
    const { table, onPaginationChange } = createPaginationTable({
      pageIndex: 0,
      pageSize: 10,
    })
    const pagination = table.getState().pagination

    table._autoResetPageIndex()
    await Promise.resolve()

    table._autoResetPageIndex()
    await Promise.resolve()

    expect(onPaginationChange).toHaveBeenCalledOnce()
    expect(
      functionalUpdate(onPaginationChange.mock.calls[0][0], pagination),
    ).toBe(pagination)
  })

  it('keeps pagination state identity when core row data changes and the page index is already reset', async () => {
    const { table, onPaginationChange } = createPaginationTable({
      pageIndex: 0,
      pageSize: 10,
    })
    const pagination = table.getState().pagination

    table.getRowModel()
    await Promise.resolve()
    onPaginationChange.mockClear()

    table.setOptions((old) => ({
      ...old,
      data: [{ name: 'Grace' }],
    }))
    table.getRowModel()
    await Promise.resolve()

    expect(onPaginationChange).toHaveBeenCalledOnce()
    expect(
      functionalUpdate(onPaginationChange.mock.calls[0][0], pagination),
    ).toBe(pagination)
  })
})
