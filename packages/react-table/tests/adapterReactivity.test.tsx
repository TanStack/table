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

const MemoizedCellValueObserver = React.memo(
  function MemoizedCellValueObserver({
    value,
    capture,
  }: {
    value: unknown
    capture: (value: unknown) => void
  }) {
    capture(value)
    return null
  },
)

afterEach(() => {
  cleanup()
  renderedView = undefined
  vi.restoreAllMocks()
})

// Adapter contract only: React/store ownership, subscriptions, lifecycle, and
// option refreshes. Row-model algorithms remain covered by table-core.
describe('React adapter reactivity and lifecycle', () => {
  test('accepts required data props and updates row reads when the prop changes', async () => {
    function TableHarness({ data }: { data: Array<Data> }) {
      const table = useTable({
        data,
        features: stockFeatures,
        columns,
        getRowId: (row) => row.id,
        autoResetPageIndex: false,
      })

      return (
        <>
          <output data-testid="row-ids">
            {table
              .getRowModel()
              .rows.map((row) => row.id)
              .join(',')}
          </output>
          <output data-testid="row-titles">
            {table
              .getRowModel()
              .rows.map((row) => row.getValue('title'))
              .join(',')}
          </output>
        </>
      )
    }

    render(<TableHarness data={[{ id: '1', title: 'Title' }]} />)

    expect(text('row-ids')).toBe('1')
    expect(text('row-titles')).toBe('Title')

    await act(async () => {
      renderedView!.rerender(
        <TableHarness
          data={[
            { id: '1', title: 'Updated' },
            { id: '2', title: 'Added' },
          ]}
        />,
      )
      await Promise.resolve()
    })

    expect(text('row-ids')).toBe('1,2')
    expect(text('row-titles')).toBe('Updated,Added')
  })

  test('exposes the complete table surface through property checks and enumeration', () => {
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
            hasFeatures: '_features' in table,
            hasOptions: 'options' in table,
            hasState: 'state' in table,
            hasRowModel: 'getRowModel' in table,
            hasNotFound: 'notFound' in table,
            keys: Object.keys(table),
            row: table.getRow('1').original,
          })}
        </output>
      )
    }

    render(<TableHarness />)

    const surface = JSON.parse(text('table-surface')) as {
      hasFeatures: boolean
      hasOptions: boolean
      hasState: boolean
      hasRowModel: boolean
      hasNotFound: boolean
      keys: Array<string>
      row: Data
    }

    expect(surface).toMatchObject({
      hasFeatures: true,
      hasOptions: true,
      hasState: true,
      hasRowModel: true,
      hasNotFound: false,
      row: {
        id: '1',
        title: 'Title',
      },
    })
    expect(surface.keys).toEqual(
      expect.arrayContaining(['_features', 'options', 'state', 'getRowModel']),
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

  test('row, cell, and column reads update only for their subscribed inputs', () => {
    const isSelectedCaptor = vi.fn<(value: boolean) => void>()
    const idValueCaptor = vi.fn<(value: unknown) => void>()
    const memoizedIdValueCaptor = vi.fn<(value: unknown) => void>()
    const titleValueCaptor = vi.fn<(value: unknown) => void>()
    const columnIsVisibleCaptor = vi.fn<(value: boolean) => void>()

    function TableHarness() {
      const [data, setData] = React.useState<Array<Data>>([
        { id: '1', title: 'Title' },
      ])
      const table = useTable(
        {
          data,
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
        },
        () => null,
      )

      const cells = table.getRow('1').getAllCells()
      idValueCaptor(cells[0]!.getValue())
      titleValueCaptor(cells[1]!.getValue())

      return (
        <>
          <MemoizedCellValueObserver
            value={cells[0]!.getValue()}
            capture={memoizedIdValueCaptor}
          />
          <table.Subscribe
            source={table.atoms.rowSelection}
            selector={(selection) => Boolean(selection['1'])}
          >
            {() => {
              isSelectedCaptor(table.getRow('1').getIsSelected())
              return null
            }}
          </table.Subscribe>
          <table.Subscribe
            source={table.atoms.columnVisibility}
            selector={(visibility) => visibility.id !== false}
          >
            {() => {
              columnIsVisibleCaptor(table.getColumn('id')!.getIsVisible())
              return null
            }}
          </table.Subscribe>
          <button
            data-testid="select-row"
            onClick={() => table.getRow('1').toggleSelected(true)}
          />
          <button
            data-testid="replace-data"
            onClick={() => setData([{ id: '1', title: 'Title 3' }])}
          />
          <button
            data-testid="hide-id"
            onClick={() => table.getColumn('id')!.toggleVisibility(false)}
          />
        </>
      )
    }

    render(<TableHarness />)

    expect(isSelectedCaptor.mock.calls).toEqual([[false]])
    expect(idValueCaptor.mock.calls).toEqual([['1']])
    expect(memoizedIdValueCaptor.mock.calls).toEqual([['1']])
    expect(titleValueCaptor.mock.calls).toEqual([['Title']])
    expect(columnIsVisibleCaptor.mock.calls).toEqual([[true]])

    act(() => {
      click('select-row')
    })

    expect(isSelectedCaptor.mock.calls).toEqual([[false], [true]])
    expect(idValueCaptor).toHaveBeenCalledTimes(1)
    expect(memoizedIdValueCaptor.mock.calls).toEqual([['1']])
    expect(titleValueCaptor).toHaveBeenCalledTimes(1)
    expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(1)

    act(() => {
      click('replace-data')
    })

    expect(isSelectedCaptor.mock.calls).toEqual([[false], [true], [true]])
    expect(idValueCaptor.mock.calls).toEqual([['1'], ['1']])
    expect(memoizedIdValueCaptor.mock.calls).toEqual([['1']])
    expect(titleValueCaptor.mock.calls).toEqual([['Title'], ['Title 3']])
    expect(columnIsVisibleCaptor.mock.calls).toEqual([[true], [true]])

    act(() => {
      click('hide-id')
    })

    expect(isSelectedCaptor).toHaveBeenCalledTimes(3)
    expect(idValueCaptor).toHaveBeenCalledTimes(2)
    expect(memoizedIdValueCaptor.mock.calls).toEqual([['1']])
    expect(titleValueCaptor).toHaveBeenCalledTimes(2)
    expect(columnIsVisibleCaptor.mock.calls).toEqual([[true], [true], [false]])
  })

  test('row methods and table state react to external atom changes', () => {
    const rowSelectionAtom = createAtom<RowSelectionState>({})
    const isSelectedCaptor = vi.fn<(value: boolean) => void>()
    const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

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
            {() => {
              isSelectedCaptor(table.getRow('1').getIsSelected())
              return null
            }}
          </table.Subscribe>
          <table.Subscribe source={table.atoms.rowSelection}>
            {(selection) => {
              tableStateCaptor(selection)
              return null
            }}
          </table.Subscribe>
        </>
      )
    }

    render(<TableHarness />)

    expect(isSelectedCaptor.mock.calls).toEqual([[false]])
    expect(tableStateCaptor.mock.calls).toEqual([[{}]])

    act(() => {
      rowSelectionAtom.set({ 1: true })
    })

    expect(isSelectedCaptor.mock.calls).toEqual([[false], [true]])
    expect(tableStateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
  })

  test('table store subscriptions observe updates and stop after unsubscribe', () => {
    const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

    function StoreObserver({
      table,
    }: {
      table: ReactTable<typeof stockFeatures, Data, null>
    }) {
      React.useEffect(() => {
        const subscription = table.store.subscribe((state) => {
          tableStateCaptor(state.rowSelection)
        })

        return () => subscription.unsubscribe()
      }, [table.store])

      return null
    }

    function TableHarness() {
      const [subscribed, setSubscribed] = React.useState(true)
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
          {subscribed ? <StoreObserver table={table} /> : null}
          <output data-testid="initial-row-selection">
            {JSON.stringify(table.store.get().rowSelection)}
          </output>
          <button
            data-testid="select-subscribed-row"
            onClick={() => table.getRow('1').toggleSelected(true)}
          />
          <button
            data-testid="unsubscribe-store"
            onClick={() => setSubscribed(false)}
          />
          <button
            data-testid="deselect-unsubscribed-row"
            onClick={() => table.getRow('1').toggleSelected(false)}
          />
        </>
      )
    }

    render(<TableHarness />)

    expect(text('initial-row-selection')).toBe('{}')
    act(() => {
      click('select-subscribed-row')
    })

    expect(tableStateCaptor.mock.calls).toEqual([[{ 1: true }]])

    act(() => {
      click('unsubscribe-store')
    })
    act(() => {
      click('deselect-unsubscribed-row')
    })

    expect(tableStateCaptor.mock.calls).toEqual([[{ 1: true }]])
  })

  test('controlled table state follows every external React state update', () => {
    const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

    function TableHarness() {
      const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {},
      )
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          state: { rowSelection },
        },
        (state) => state.rowSelection,
      )

      tableStateCaptor(table.state)

      return (
        <>
          <output data-testid="controlled-row-selection">
            {JSON.stringify(table.state)}
          </output>
          <button
            data-testid="select-row-1"
            onClick={() => setRowSelection({ 1: true })}
          />
          <button
            data-testid="select-rows-1-and-2"
            onClick={() => setRowSelection({ 1: true, 2: true })}
          />
          <button
            data-testid="select-row-2"
            onClick={() => setRowSelection({ 2: true })}
          />
        </>
      )
    }

    render(<TableHarness />)

    act(() => {
      click('select-row-1')
    })
    act(() => {
      click('select-rows-1-and-2')
    })
    act(() => {
      click('select-row-2')
    })

    expect(tableStateCaptor.mock.calls).toEqual([
      [{}],
      [{ 1: true }],
      [{ 1: true, 2: true }],
      [{ 2: true }],
    ])
    expect(text('controlled-row-selection')).toBe('{"2":true}')
  })

  test('exposes initial state through atoms and the store on the first render', () => {
    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        },
        () => null,
      )

      return (
        <>
          <output data-testid="initial-atom-pagination">
            {JSON.stringify(table.atoms.pagination.get())}
          </output>
          <output data-testid="initial-store-pagination">
            {JSON.stringify(table.store.get().pagination)}
          </output>
        </>
      )
    }

    render(<TableHarness />)

    expect(text('initial-atom-pagination')).toBe(
      '{"pageIndex":0,"pageSize":20}',
    )
    expect(text('initial-store-pagination')).toBe(
      '{"pageIndex":0,"pageSize":20}',
    )
  })

  test('reacts to every internal state update', () => {
    const pageSizeCaptor = vi.fn<(value: number) => void>()

    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        },
        (state) => state.pagination.pageSize,
      )
      pageSizeCaptor(table.state)

      return (
        <>
          <output data-testid="page-size">{table.state}</output>
          <output data-testid="atom-page-size">
            {table.atoms.pagination.get().pageSize}
          </output>
          <output data-testid="store-page-size">
            {table.store.get().pagination.pageSize}
          </output>
          <button
            data-testid="set-page-size-50"
            onClick={() => table.setPageSize(50)}
          />
          <button
            data-testid="set-page-size-100"
            onClick={() => table.setPageSize(100)}
          />
        </>
      )
    }

    render(<TableHarness />)

    act(() => {
      click('set-page-size-50')
    })
    act(() => {
      click('set-page-size-100')
    })

    expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
    expect(text('page-size')).toBe('100')
    expect(text('atom-page-size')).toBe('100')
    expect(text('store-page-size')).toBe('100')
  })

  test('selected state reads ignore unrelated slices while full state subscribers update', () => {
    const pageSizeCaptor = vi.fn<(value: number) => void>()
    const stateJsonCaptor = vi.fn<(value: string) => void>()

    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        },
        (state) => state.pagination.pageSize,
      )
      pageSizeCaptor(table.state)

      return (
        <>
          <table.Subscribe selector={(state) => JSON.stringify(state)}>
            {(stateJson) => {
              stateJsonCaptor(stateJson)
              return null
            }}
          </table.Subscribe>
          <button
            data-testid="select-all-rows"
            onClick={() => table.toggleAllRowsSelected(true)}
          />
        </>
      )
    }

    render(<TableHarness />)

    act(() => {
      click('select-all-rows')
    })

    expect(pageSizeCaptor.mock.calls).toEqual([[20]])
    expect(stateJsonCaptor).toHaveBeenCalledTimes(2)
    expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain(
      '"rowSelection":{"1":true}',
    )
  })

  test('stock features expose configured initial slices and publish later updates', () => {
    const stateJsonCaptor = vi.fn<(value: string) => void>()

    function TableHarness() {
      const table = useTable(
        {
          data: [{ id: '1', title: 'Title' }],
          features: stockFeatures,
          columns,
          getRowId: (row) => row.id,
          initialState: {
            columnOrder: columns.map((column) => column.id!),
            columnPinning: { start: ['id'], end: [] },
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        },
        (state) => JSON.stringify(state),
      )
      stateJsonCaptor(table.state)

      return (
        <>
          <output data-testid="stock-page-size">
            {table.atoms.pagination.get().pageSize}
          </output>
          <output data-testid="stock-column-order">
            {JSON.stringify(table.atoms.columnOrder.get())}
          </output>
          <output data-testid="stock-column-pinning">
            {JSON.stringify(table.atoms.columnPinning.get())}
          </output>
          <output data-testid="stock-store-page-size">
            {table.store.get().pagination.pageSize}
          </output>
          <button
            data-testid="set-stock-page-size-50"
            onClick={() => table.setPageSize(50)}
          />
        </>
      )
    }

    render(<TableHarness />)

    expect(text('stock-page-size')).toBe('20')
    expect(text('stock-column-order')).toBe('["id","title"]')
    expect(text('stock-column-pinning')).toBe('{"start":["id"],"end":[]}')
    expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize":20')

    act(() => {
      click('set-stock-page-size-50')
    })

    expect(text('stock-page-size')).toBe('50')
    expect(text('stock-store-page-size')).toBe('50')
    expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize":50')
  })

  test('releases external and store subscriptions on unmount', () => {
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
