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
  stockFeatures,
  tableFeatures,
} from '@tanstack/table-core'
import { createAtom } from '@tanstack/react-store'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useTable } from '../src'
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from '@tanstack/table-core'
import type { ReactTable } from '../src'

type Data = {
  id: string
  title: string
}

const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
  {
    id: 'id',
    header: 'Id',
    accessorKey: 'id',
    cell: (context) => context.getValue(),
  },
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
    cell: (context) => context.getValue(),
  },
]

const paginatedFeatures = tableFeatures({
  ...stockFeatures,
  paginatedRowModel: createPaginatedRowModel(),
})
const paginatedColumns: Array<ColumnDef<typeof paginatedFeatures, Data>> = [
  {
    id: 'id',
    header: 'Id',
    accessorKey: 'id',
    cell: (context) => context.getValue(),
  },
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
    cell: (context) => context.getValue(),
  },
]

let renderedView: ReturnType<typeof testingLibraryRender> | undefined

function render(element: React.ReactNode) {
  renderedView = testingLibraryRender(element)
  return renderedView
}

function text(testId: string) {
  return screen.getByTestId(testId).textContent
}

function click(action: string) {
  fireEvent.click(screen.getByTestId(action))
}

function unmount() {
  renderedView!.unmount()
  renderedView = undefined
}

afterEach(() => {
  cleanup()
  renderedView = undefined
  vi.restoreAllMocks()
})

// Adapter contract only: React/store ownership, subscriptions, lifecycle, and
// option refreshes. Row-model algorithms remain covered by table-core.
describe('React adapter reactivity and lifecycle', () => {
  test('exposes React adapter APIs through the returned table surface', () => {
    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
        },
        () => null,
      )

      return (
        <output data-testid="table-surface">
          {JSON.stringify({
            hasOptions: 'options' in table,
            hasState: 'state' in table,
            hasRowModel: 'getRowModel' in table,
            hasSubscribe: 'Subscribe' in table,
            hasFlexRender: 'FlexRender' in table,
            keys: Object.keys(table),
          })}
        </output>
      )
    }

    render(<TableHarness />)

    const surface = JSON.parse(text('table-surface')) as {
      hasOptions: boolean
      hasState: boolean
      hasRowModel: boolean
      hasSubscribe: boolean
      hasFlexRender: boolean
      keys: Array<string>
    }

    expect(surface).toEqual({
      hasOptions: true,
      hasState: true,
      hasRowModel: true,
      hasSubscribe: true,
      hasFlexRender: true,
      keys: expect.any(Array),
    })
    expect(surface.keys).toEqual(
      expect.arrayContaining([
        'options',
        'state',
        'Subscribe',
        'FlexRender',
        'getRowModel',
      ]),
    )
  })

  test('updates the paginated row model without invalidating the core row model', () => {
    const data = Array.from({ length: 10 }, (_, index) => ({
      id: String(index),
      title: `Title ${index}`,
    }))
    const coreRowModelCaptor = vi.fn()
    const rowModelCaptor = vi.fn()
    function TableHarness() {
      const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
      })
      const table = useTable(
        {
          data,
          features: paginatedFeatures,
          columns: paginatedColumns,
          getRowId: (row) => row.id,
          state: { pagination },
          onPaginationChange: setPagination,
        },
        (state) => state.pagination,
      )
      const coreRowModel = table.getCoreRowModel()
      const rowModel = table.getRowModel()

      coreRowModelCaptor(coreRowModel)
      rowModelCaptor(rowModel)

      return (
        <>
          <output data-testid="core-row-ids">
            {coreRowModel.rows.map((row) => row.id).join(',')}
          </output>
          <output data-testid="page-row-ids">
            {rowModel.rows.map((row) => row.id).join(',')}
          </output>
          <button
            data-testid="set-page-size-3"
            onClick={() => setPagination({ pageIndex: 0, pageSize: 3 })}
          />
        </>
      )
    }

    render(<TableHarness />)

    expect(text('core-row-ids')).toBe('0,1,2,3,4,5,6,7,8,9')
    expect(text('page-row-ids')).toBe('0,1,2,3,4')

    act(() => {
      click('set-page-size-3')
    })

    expect(text('core-row-ids')).toBe('0,1,2,3,4,5,6,7,8,9')
    expect(text('page-row-ids')).toBe('0,1,2')
    expect(coreRowModelCaptor).toHaveBeenCalledTimes(2)
    expect(rowModelCaptor).toHaveBeenCalledTimes(2)
    expect(coreRowModelCaptor.mock.calls[0]![0]).toBe(
      coreRowModelCaptor.mock.calls[1]![0],
    )
    expect(rowModelCaptor.mock.calls[0]![0].rows).toHaveLength(5)
    expect(rowModelCaptor.mock.calls[1]![0].rows).toHaveLength(3)
  })

  test('bridges external atoms through both Subscribe source overloads', () => {
    const rowSelectionAtom = createAtom<RowSelectionState>({})

    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          atoms: {
            rowSelection: rowSelectionAtom,
          },
        },
        () => null,
      )

      return (
        <>
          <table.Subscribe
            source={table.atoms.rowSelection}
            selector={(selection) => Boolean(selection['1'])}
          >
            {(selected) => (
              <output data-testid="external-row-selected">
                {String(selected)}
              </output>
            )}
          </table.Subscribe>
          <table.Subscribe source={table.atoms.rowSelection}>
            {(selection) => {
              return (
                <output data-testid="external-row-selection">
                  {JSON.stringify(selection)}
                </output>
              )
            }}
          </table.Subscribe>
          <button
            data-testid="toggle-external-row"
            onClick={() => table.getRow('1').toggleSelected()}
          />
        </>
      )
    }

    render(<TableHarness />)

    expect(text('external-row-selected')).toBe('false')
    expect(text('external-row-selection')).toBe('{}')

    act(() => {
      rowSelectionAtom.set({ 1: true })
    })

    expect(text('external-row-selected')).toBe('true')
    expect(text('external-row-selection')).toBe('{"1":true}')

    act(() => {
      click('toggle-external-row')
    })

    expect(rowSelectionAtom.get()).toEqual({})
    expect(text('external-row-selected')).toBe('false')
    expect(text('external-row-selection')).toBe('{}')
  })

  test('stops root and isolated React observers after unmount', () => {
    const rowSelectionAtom = createAtom<RowSelectionState>({})
    const rootStoreSelectorCaptor = vi.fn()
    const isolatedStoreCaptor = vi.fn()
    const captureTable =
      vi.fn<(table: ReactTable<typeof stockFeatures, Data, boolean>) => void>()

    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          atoms: {
            rowSelection: rowSelectionAtom,
          },
        },
        (state) => {
          rootStoreSelectorCaptor({
            rowSelection: state.rowSelection,
            pageSize: state.pagination.pageSize,
          })
          return Boolean(state.rowSelection['1'])
        },
      )

      React.useLayoutEffect(() => {
        captureTable(table)
      }, [table])

      return (
        <table.Subscribe
          selector={(state) => ({
            selected: Boolean(state.rowSelection['1']),
            pageSize: state.pagination.pageSize,
          })}
        >
          {(snapshot) => {
            isolatedStoreCaptor(snapshot)
            return (
              <output data-testid="lifecycle-selection">
                {String(snapshot.selected)}
              </output>
            )
          }}
        </table.Subscribe>
      )
    }

    render(<TableHarness />)

    act(() => {
      rowSelectionAtom.set({ 1: true })
    })

    expect(text('lifecycle-selection')).toBe('true')

    unmount()

    const rootCallsAfterUnmount = rootStoreSelectorCaptor.mock.calls.length
    const isolatedCallsAfterUnmount = isolatedStoreCaptor.mock.calls.length
    const table = captureTable.mock.lastCall![0]

    act(() => {
      rowSelectionAtom.set({})
      table.setPageSize(25)
    })

    expect(rootStoreSelectorCaptor).toHaveBeenCalledTimes(rootCallsAfterUnmount)
    expect(isolatedStoreCaptor).toHaveBeenCalledTimes(isolatedCallsAfterUnmount)
  })

  test('refreshes data, columns, and table options together on the next render', async () => {
    type DynamicData = {
      id: string
      alternateId: string
      title: string
      status: string
    }

    const initialColumns: Array<ColumnDef<typeof stockFeatures, DynamicData>> =
      [
        { id: 'title', header: 'Title', accessorKey: 'title' },
        { id: 'missing', header: 'Missing', accessorFn: () => undefined },
      ]
    const updatedColumns: Array<ColumnDef<typeof stockFeatures, DynamicData>> =
      [
        { id: 'status', header: 'Status', accessorKey: 'status' },
        { id: 'missing', header: 'Absent', accessorFn: () => undefined },
      ]
    const initialData: Array<DynamicData> = [
      {
        id: '1',
        alternateId: 'alternate-1',
        title: 'Alpha',
        status: 'draft',
      },
    ]
    const updatedData: Array<DynamicData> = [
      {
        id: '2',
        alternateId: 'alternate-2',
        title: 'Beta',
        status: 'ready',
      },
    ]
    const renderCaptor = vi.fn<(version: number) => void>()

    function TableHarness() {
      const [version, setVersion] = React.useState(0)
      const isUpdated = version === 1
      const table = useTable({
        data: isUpdated ? updatedData : initialData,
        features: stockFeatures,
        columns: isUpdated ? updatedColumns : initialColumns,
        getRowId: isUpdated ? (row) => row.alternateId : (row) => row.id,
        renderFallbackValue: isUpdated
          ? 'updated fallback'
          : 'initial fallback',
        autoResetAll: false,
      })
      const row = table.getRowModel().rows[0]!
      const cells = row.getAllCells()

      renderCaptor(version)

      return (
        <>
          <output data-testid="dynamic-row-id">{row.id}</output>
          <output data-testid="dynamic-column-ids">
            {table
              .getAllLeafColumns()
              .map((column) => column.id)
              .join(',')}
          </output>
          <output data-testid="dynamic-headers">
            {table
              .getAllLeafColumns()
              .map((column) => column.columnDef.header)
              .join(',')}
          </output>
          <output data-testid="dynamic-cell-value">
            {String(cells[0]!.getValue())}
          </output>
          <output data-testid="dynamic-fallback">
            {String(cells[1]!.renderValue())}
          </output>
          <button data-testid="refresh-options" onClick={() => setVersion(1)} />
        </>
      )
    }

    render(<TableHarness />)

    expect(text('dynamic-row-id')).toBe('1')
    expect(text('dynamic-column-ids')).toBe('title,missing')
    expect(text('dynamic-headers')).toBe('Title,Missing')
    expect(text('dynamic-cell-value')).toBe('Alpha')
    expect(text('dynamic-fallback')).toBe('initial fallback')

    await act(async () => {
      click('refresh-options')
      await Promise.resolve()
    })

    expect(text('dynamic-row-id')).toBe('alternate-2')
    expect(text('dynamic-column-ids')).toBe('status,missing')
    expect(text('dynamic-headers')).toBe('Status,Absent')
    expect(text('dynamic-cell-value')).toBe('ready')
    expect(text('dynamic-fallback')).toBe('updated fallback')
    expect(renderCaptor.mock.calls).toEqual([[0], [1]])
  })
})
