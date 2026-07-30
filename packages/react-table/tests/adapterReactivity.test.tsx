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

function text(name: string) {
  return screen.getByRole('status', { name }).textContent
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }))
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
          data: [
            { id: '1', title: 'First' },
            { id: '2', title: 'Second' },
          ],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
        },
        () => null,
      )

      return (
        <output aria-label="Table surface">
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

    const surface = JSON.parse(text('Table surface')) as {
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
          <output aria-label="Core row IDs">
            {coreRowModel.rows.map((row) => row.id).join(',')}
          </output>
          <output aria-label="Page row IDs">
            {rowModel.rows.map((row) => row.id).join(',')}
          </output>
          <button onClick={() => setPagination({ pageIndex: 0, pageSize: 3 })}>
            Set page size to 3
          </button>
        </>
      )
    }

    render(<TableHarness />)

    expect(text('Core row IDs')).toBe('0,1,2,3,4,5,6,7,8,9')
    expect(text('Page row IDs')).toBe('0,1,2,3,4')

    act(() => {
      click('Set page size to 3')
    })

    expect(text('Core row IDs')).toBe('0,1,2,3,4,5,6,7,8,9')
    expect(text('Page row IDs')).toBe('0,1,2')
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
              <output aria-label="External row selected">
                {String(selected)}
              </output>
            )}
          </table.Subscribe>
          <table.Subscribe source={table.atoms.rowSelection}>
            {(selection) => {
              return (
                <output aria-label="External row selection">
                  {JSON.stringify(selection)}
                </output>
              )
            }}
          </table.Subscribe>
          <button onClick={() => table.getRow('1').toggleSelected()}>
            Toggle external row
          </button>
        </>
      )
    }

    render(<TableHarness />)

    expect(text('External row selected')).toBe('false')
    expect(text('External row selection')).toBe('{}')

    act(() => {
      rowSelectionAtom.set({ 1: true })
    })

    expect(text('External row selected')).toBe('true')
    expect(text('External row selection')).toBe('{"1":true}')

    act(() => {
      click('Toggle external row')
    })

    expect(rowSelectionAtom.get()).toEqual({})
    expect(text('External row selected')).toBe('false')
    expect(text('External row selection')).toBe('{}')
  })

  test('isolates Subscribe render cycles to each selected dependency', () => {
    const ownerRenderCaptor = vi.fn()
    const selectedRowRenderCaptor = vi.fn<(selected: boolean) => void>()
    const selectionAtomRenderCaptor =
      vi.fn<(state: RowSelectionState) => void>()
    const pageSizeRenderCaptor = vi.fn<(pageSize: number) => void>()

    function TableHarness() {
      ownerRenderCaptor()
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
        <>
          <table.Subscribe
            selector={(state) => Boolean(state.rowSelection['1'])}
          >
            {(selected) => {
              selectedRowRenderCaptor(selected)
              return (
                <output aria-label="Selected row value">
                  {String(selected)}
                </output>
              )
            }}
          </table.Subscribe>
          <table.Subscribe source={table.atoms.rowSelection}>
            {(selection) => {
              selectionAtomRenderCaptor(selection)
              return (
                <output aria-label="Selection atom value">
                  {JSON.stringify(selection)}
                </output>
              )
            }}
          </table.Subscribe>
          <table.Subscribe selector={(state) => state.pagination.pageSize}>
            {(pageSize) => {
              pageSizeRenderCaptor(pageSize)
              return (
                <output aria-label="Subscribed page size">{pageSize}</output>
              )
            }}
          </table.Subscribe>
          <button onClick={() => table.setRowSelection({ 1: true })}>
            Select first row
          </button>
          <button onClick={() => table.setRowSelection({ 1: true, 2: true })}>
            Select second row too
          </button>
          <button onClick={() => table.setPageSize(20)}>
            Set page size to 20
          </button>
        </>
      )
    }

    render(<TableHarness />)

    expect(ownerRenderCaptor).toHaveBeenCalledTimes(1)
    expect(selectedRowRenderCaptor.mock.calls).toEqual([[false]])
    expect(selectionAtomRenderCaptor.mock.calls).toEqual([[{}]])
    expect(pageSizeRenderCaptor.mock.calls).toEqual([[10]])

    act(() => {
      click('Select first row')
    })

    expect(text('Selected row value')).toBe('true')
    expect(text('Selection atom value')).toBe('{"1":true}')
    expect(text('Subscribed page size')).toBe('10')
    expect(ownerRenderCaptor).toHaveBeenCalledTimes(1)
    expect(selectedRowRenderCaptor.mock.calls).toEqual([[false], [true]])
    expect(selectionAtomRenderCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    expect(pageSizeRenderCaptor.mock.calls).toEqual([[10]])

    act(() => {
      click('Select second row too')
    })

    expect(text('Selected row value')).toBe('true')
    expect(text('Selection atom value')).toBe('{"1":true,"2":true}')
    expect(ownerRenderCaptor).toHaveBeenCalledTimes(1)
    expect(selectedRowRenderCaptor).toHaveBeenCalledTimes(2)
    expect(selectionAtomRenderCaptor.mock.calls).toEqual([
      [{}],
      [{ 1: true }],
      [{ 1: true, 2: true }],
    ])
    expect(pageSizeRenderCaptor).toHaveBeenCalledTimes(1)

    act(() => {
      click('Set page size to 20')
    })

    expect(text('Subscribed page size')).toBe('20')
    expect(ownerRenderCaptor).toHaveBeenCalledTimes(1)
    expect(selectedRowRenderCaptor).toHaveBeenCalledTimes(2)
    expect(selectionAtomRenderCaptor).toHaveBeenCalledTimes(3)
    expect(pageSizeRenderCaptor.mock.calls).toEqual([[10], [20]])

    act(() => {
      click('Select second row too')
      click('Set page size to 20')
    })

    expect(ownerRenderCaptor).toHaveBeenCalledTimes(1)
    expect(selectedRowRenderCaptor).toHaveBeenCalledTimes(2)
    expect(selectionAtomRenderCaptor).toHaveBeenCalledTimes(3)
    expect(pageSizeRenderCaptor).toHaveBeenCalledTimes(2)
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
              <output aria-label="Lifecycle selection">
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

    expect(text('Lifecycle selection')).toBe('true')

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
          <output aria-label="Dynamic row ID">{row.id}</output>
          <output aria-label="Dynamic column IDs">
            {table
              .getAllLeafColumns()
              .map((column) => column.id)
              .join(',')}
          </output>
          <output aria-label="Dynamic headers">
            {table
              .getAllLeafColumns()
              .map((column) => column.columnDef.header)
              .join(',')}
          </output>
          <output aria-label="Dynamic cell value">
            {String(cells[0]!.getValue())}
          </output>
          <output aria-label="Dynamic fallback">
            {String(cells[1]!.renderValue())}
          </output>
          <button onClick={() => setVersion(1)}>Refresh options</button>
        </>
      )
    }

    render(<TableHarness />)

    expect(text('Dynamic row ID')).toBe('1')
    expect(text('Dynamic column IDs')).toBe('title,missing')
    expect(text('Dynamic headers')).toBe('Title,Missing')
    expect(text('Dynamic cell value')).toBe('Alpha')
    expect(text('Dynamic fallback')).toBe('initial fallback')

    await act(async () => {
      click('Refresh options')
      await Promise.resolve()
    })

    expect(text('Dynamic row ID')).toBe('alternate-2')
    expect(text('Dynamic column IDs')).toBe('status,missing')
    expect(text('Dynamic headers')).toBe('Status,Absent')
    expect(text('Dynamic cell value')).toBe('ready')
    expect(text('Dynamic fallback')).toBe('updated fallback')
    expect(renderCaptor.mock.calls).toEqual([[0], [1]])
  })
})
