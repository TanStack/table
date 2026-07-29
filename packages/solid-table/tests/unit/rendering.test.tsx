// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { stockFeatures } from '@tanstack/table-core'
import { FlexRender } from '../../src/FlexRender'
import { createTable } from '../../src/createTable'
import { createTableHook } from '../../src/createTableHook'
import type { ColumnDef } from '@tanstack/table-core'

afterEach(() => cleanup())

describe('FlexRender', () => {
  type Data = { id: string; name: string }
  type CellMode = 'aggregate' | 'normal' | 'placeholder'
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => `header:${column.id}`,
      cell: ({ getValue }) => `cell:${getValue()}`,
      aggregatedCell: ({ getValue }) => `aggregate:${getValue()}`,
      footer: ({ column }) => `footer:${column.id}`,
    },
  ]

  function CellHarness(props: { mode: CellMode }) {
    const table = createTable({
      data: [{ id: '1', name: 'Ada' }],
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

    if (props.mode === 'aggregate') {
      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(true)
    }

    if (props.mode === 'placeholder') {
      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(false)
      vi.spyOn(cell, 'getIsPlaceholder').mockReturnValue(true)
    }

    return (
      <div data-testid={`cell-${props.mode}`}>
        <FlexRender cell={cell} />
      </div>
    )
  }

  function HeaderFooterHarness() {
    const table = createTable({
      data: [{ id: '1', name: 'Ada' }],
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!
    const footer = table.getFooterGroups()[0]!.headers[0]!

    return (
      <>
        <div data-testid="header">
          <FlexRender header={header} />
        </div>
        <div data-testid="footer">
          <FlexRender footer={footer} />
        </div>
      </>
    )
  }

  test('renders cell, aggregate, placeholder, header, and footer templates', () => {
    render(() => (
      <>
        <CellHarness mode="normal" />
        <CellHarness mode="aggregate" />
        <CellHarness mode="placeholder" />
        <HeaderFooterHarness />
      </>
    ))

    expect(screen.getByTestId('cell-normal').textContent).toBe('cell:Ada')
    expect(screen.getByTestId('cell-aggregate').textContent).toBe(
      'aggregate:Ada',
    )
    expect(screen.getByTestId('cell-placeholder').textContent).toBe('')
    expect(screen.getByTestId('header').textContent).toBe('header:name')
    expect(screen.getByTestId('footer').textContent).toBe('footer:name')
  })

  test('updates when a truthy cell prop is replaced with a new instance', () => {
    function ReactiveCellHarness() {
      const [data, setData] = createSignal<Array<Data>>([
        { id: '1', name: 'Ada' },
      ])
      const table = createTable({
        get data() {
          return data()
        },
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })

      return (
        <>
          <div data-testid="reactive-cell">
            <FlexRender cell={table.getRowModel().rows[0]!.getAllCells()[0]!} />
          </div>
          <button
            data-testid="replace-cell"
            onClick={() => setData([{ id: '1', name: 'Grace' }])}
          />
        </>
      )
    }

    render(() => <ReactiveCellHarness />)

    expect(screen.getByTestId('reactive-cell').textContent).toBe('cell:Ada')

    fireEvent.click(screen.getByTestId('replace-cell'))

    expect(screen.getByTestId('reactive-cell').textContent).toBe('cell:Grace')
  })
})

describe('table.Subscribe', () => {
  test('updates mounted content for the atom read by its child', () => {
    function SubscribeHarness() {
      const table = createTable({
        data: [{ id: '1' }],
        columns: [{ id: 'id', accessorKey: 'id' }],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })

      return (
        <>
          <output data-testid="subscribed-selection">
            <table.Subscribe>
              {(atoms) => (
                <span>{String(Boolean(atoms.rowSelection.get()['1']))}</span>
              )}
            </table.Subscribe>
          </output>
          <button
            data-testid="select-subscribed-row"
            onClick={() => table.getRow('1').toggleSelected(true)}
          />
        </>
      )
    }

    render(() => <SubscribeHarness />)

    expect(screen.getByTestId('subscribed-selection').textContent).toBe('false')

    fireEvent.click(screen.getByTestId('select-subscribed-row'))

    expect(screen.getByTestId('subscribed-selection').textContent).toBe('true')
  })
})

describe('createTableHook runtime', () => {
  type Data = { id: string; name: string }
  const TableBadge = () => <span data-testid="table-badge">table-badge</span>
  const CellBadge = () => <span data-testid="cell-badge">cell-badge</span>
  const HeaderBadge = () => <span data-testid="header-badge">header-badge</span>

  function createTestHook() {
    return createTableHook({
      features: stockFeatures,
      enableRowSelection: false,
      getRowId: (row) => row.id,
      tableComponents: { TableBadge },
      cellComponents: { CellBadge },
      headerComponents: { HeaderBadge },
    })
  }

  test('binds features and components while per-table options override defaults', () => {
    const hook = createTestHook()
    const columnHelper = hook.createAppColumnHelper<Data>()
    const columns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => getValue(),
      }),
    ])
    let tableRef: ReturnType<typeof hook.createAppTable<Data>> | undefined

    function Harness() {
      const table = hook.createAppTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
        enableRowSelection: true,
      })
      tableRef = table

      return (
        <table.AppTable>
          <span data-testid="can-select">
            {String(table.getRow('1').getCanSelect())}
          </span>
          <table.TableBadge />
        </table.AppTable>
      )
    }

    render(() => <Harness />)

    expect(screen.getByTestId('can-select').textContent).toBe('true')
    expect(screen.getByTestId('table-badge').textContent).toBe('table-badge')
    expect(hook.appFeatures).toBe(stockFeatures)
    expect(tableRef?.TableBadge).toBe(TableBadge)
    expect(tableRef?.FlexRender).toBe(FlexRender)
    expect(tableRef?.AppTable).toEqual(expect.any(Function))
    expect(tableRef?.AppCell).toEqual(expect.any(Function))
    expect(tableRef?.AppHeader).toEqual(expect.any(Function))
    expect(tableRef?.AppFooter).toEqual(expect.any(Function))
  })

  test('provides table, cell, and header contexts with bound render helpers', () => {
    const hook = createTestHook()
    const columnHelper = hook.createAppColumnHelper<Data>()
    const columns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => `header:${column.id}`,
        cell: ({ getValue }) => `cell:${getValue()}`,
        footer: ({ column }) => `footer:${column.id}`,
      }),
    ])
    let tableFromContext: unknown
    let cellFromContext: unknown
    let headerFromContext: unknown
    let footerFromContext: unknown
    let tableRef: ReturnType<typeof hook.createAppTable<Data>> | undefined

    function Harness() {
      const table = hook.createAppTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
      })
      tableRef = table
      const cell = table.getRow('1').getAllCells()[0]!
      const header = table.getHeaderGroups()[0]!.headers[0]!
      const footer = table.getFooterGroups()[0]!.headers[0]!

      function TableContextProbe() {
        tableFromContext = hook.useTableContext<Data>()
        return (
          <span data-testid="table-context">
            {String(tableFromContext === table)}
          </span>
        )
      }

      return (
        <table.AppTable>
          <TableContextProbe />
          <table.TableBadge />
          <table.AppCell cell={cell}>
            {(value) => {
              cellFromContext = hook.useCellContext<string>()
              return (
                <>
                  <span data-testid="cell-context">
                    {String(cellFromContext === cell)}
                  </span>
                  <span data-testid="cell-bound">
                    {String(value.CellBadge === CellBadge)}
                  </span>
                  <value.CellBadge />
                  <span data-testid="cell-render">
                    <value.FlexRender />
                  </span>
                </>
              )
            }}
          </table.AppCell>
          <table.AppHeader header={header}>
            {(value) => {
              headerFromContext = hook.useHeaderContext<string>()
              return (
                <>
                  <span data-testid="header-context">
                    {String(headerFromContext === header)}
                  </span>
                  <span data-testid="header-bound">
                    {String(value.HeaderBadge === HeaderBadge)}
                  </span>
                  <value.HeaderBadge />
                  <span data-testid="header-render">
                    <value.FlexRender />
                  </span>
                </>
              )
            }}
          </table.AppHeader>
          <table.AppFooter header={footer}>
            {(value) => {
              footerFromContext = hook.useHeaderContext<string>()
              return (
                <>
                  <span data-testid="footer-context">
                    {String(footerFromContext === footer)}
                  </span>
                  <span data-testid="footer-render">
                    <value.FlexRender />
                  </span>
                </>
              )
            }}
          </table.AppFooter>
        </table.AppTable>
      )
    }

    render(() => <Harness />)

    expect(screen.getByTestId('table-context').textContent).toBe('true')
    expect(screen.getByTestId('cell-context').textContent).toBe('true')
    expect(screen.getByTestId('header-context').textContent).toBe('true')
    expect(screen.getByTestId('footer-context').textContent).toBe('true')
    expect(screen.getByTestId('cell-bound').textContent).toBe('true')
    expect(screen.getByTestId('header-bound').textContent).toBe('true')
    expect(screen.getByTestId('table-badge').textContent).toBe('table-badge')
    expect(screen.getByTestId('cell-badge').textContent).toBe('cell-badge')
    expect(screen.getByTestId('header-badge').textContent).toBe('header-badge')
    expect(screen.getByTestId('cell-render').textContent).toBe('cell:Ada')
    expect(screen.getByTestId('header-render').textContent).toBe('header:name')
    expect(screen.getByTestId('footer-render').textContent).toBe('footer:name')
    expect(tableFromContext).toBe(tableRef)
  })

  test('context hooks fail with actionable errors outside their providers', () => {
    const hook = createTestHook()

    function TableContextFailure() {
      hook.useTableContext()
      return null
    }

    function CellContextFailure() {
      hook.useCellContext()
      return null
    }

    function HeaderContextFailure() {
      hook.useHeaderContext()
      return null
    }

    expect(() => render(() => <TableContextFailure />)).toThrow(
      '`useTableContext` must be used within an `AppTable` component',
    )
    cleanup()
    expect(() => render(() => <CellContextFailure />)).toThrow(
      '`useCellContext` must be used within an `AppCell` component',
    )
    cleanup()
    expect(() => render(() => <HeaderContextFailure />)).toThrow(
      '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component',
    )
  })
})
