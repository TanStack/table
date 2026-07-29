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
      <output aria-label={`${props.mode} cell`}>
        <FlexRender cell={cell} />
      </output>
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
        <output aria-label="header">
          <FlexRender header={header} />
        </output>
        <output aria-label="footer">
          <FlexRender footer={footer} />
        </output>
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

    expect(
      screen.getByRole('status', { name: 'normal cell' }).textContent,
    ).toBe('cell:Ada')
    expect(
      screen.getByRole('status', { name: 'aggregate cell' }).textContent,
    ).toBe('aggregate:Ada')
    expect(
      screen.getByRole('status', { name: 'placeholder cell' }).textContent,
    ).toBe('')
    expect(screen.getByRole('status', { name: 'header' }).textContent).toBe(
      'header:name',
    )
    expect(screen.getByRole('status', { name: 'footer' }).textContent).toBe(
      'footer:name',
    )
  })

  test('reacts when a cell changes grouping mode', () => {
    function GroupingCellHarness() {
      const [mode, setMode] = createSignal<CellMode>('normal')
      const table = createTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      vi.spyOn(cell, 'getIsAggregated').mockImplementation(
        () => mode() === 'aggregate',
      )
      vi.spyOn(cell, 'getIsPlaceholder').mockImplementation(
        () => mode() === 'placeholder',
      )

      return (
        <>
          <output aria-label="grouping cell">
            <FlexRender cell={cell} />
          </output>
          <button onClick={() => setMode('aggregate')}>Show aggregate</button>
          <button onClick={() => setMode('placeholder')}>
            Show placeholder
          </button>
          <button onClick={() => setMode('normal')}>Show normal</button>
        </>
      )
    }

    render(() => <GroupingCellHarness />)

    const renderedCell = () =>
      screen.getByRole('status', { name: 'grouping cell' }).textContent

    expect(renderedCell()).toBe('cell:Ada')

    fireEvent.click(screen.getByRole('button', { name: 'Show aggregate' }))
    expect(renderedCell()).toBe('aggregate:Ada')

    fireEvent.click(screen.getByRole('button', { name: 'Show placeholder' }))
    expect(renderedCell()).toBe('')

    fireEvent.click(screen.getByRole('button', { name: 'Show normal' }))
    expect(renderedCell()).toBe('cell:Ada')
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
          <output aria-label="rendered cell">
            <FlexRender cell={table.getRowModel().rows[0]!.getAllCells()[0]!} />
          </output>
          <button onClick={() => setData([{ id: '1', name: 'Grace' }])}>
            Replace cell
          </button>
        </>
      )
    }

    render(() => <ReactiveCellHarness />)

    expect(
      screen.getByRole('status', { name: 'rendered cell' }).textContent,
    ).toBe('cell:Ada')

    fireEvent.click(screen.getByRole('button', { name: 'Replace cell' }))

    expect(
      screen.getByRole('status', { name: 'rendered cell' }).textContent,
    ).toBe('cell:Grace')
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
          <output aria-label="subscribed selection">
            <table.Subscribe>
              {(atoms) => (
                <span>{String(Boolean(atoms.rowSelection.get()['1']))}</span>
              )}
            </table.Subscribe>
          </output>
          <button onClick={() => table.getRow('1').toggleSelected(true)}>
            Select subscribed row
          </button>
        </>
      )
    }

    render(() => <SubscribeHarness />)

    expect(
      screen.getByRole('status', { name: 'subscribed selection' }).textContent,
    ).toBe('false')

    fireEvent.click(
      screen.getByRole('button', { name: 'Select subscribed row' }),
    )

    expect(
      screen.getByRole('status', { name: 'subscribed selection' }).textContent,
    ).toBe('true')
  })
})

describe('createTableHook runtime', () => {
  type Data = { id: string; name: string }
  const TableBadge = () => <span>table-badge</span>
  const CellBadge = () => <span>cell-badge</span>
  const HeaderBadge = () => <span>header-badge</span>

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
          <output aria-label="row can be selected">
            {String(table.getRow('1').getCanSelect())}
          </output>
          <table.TableBadge />
        </table.AppTable>
      )
    }

    render(() => <Harness />)

    expect(
      screen.getByRole('status', { name: 'row can be selected' }).textContent,
    ).toBe('true')
    expect(screen.getByText('table-badge').textContent).toBe('table-badge')
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
          <output aria-label="table context matches">
            {String(tableFromContext === table)}
          </output>
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
                  <output aria-label="cell context matches">
                    {String(cellFromContext === cell)}
                  </output>
                  <output aria-label="cell component is bound">
                    {String(value.CellBadge === CellBadge)}
                  </output>
                  <value.CellBadge />
                  <output aria-label="rendered cell">
                    <value.FlexRender />
                  </output>
                </>
              )
            }}
          </table.AppCell>
          <table.AppHeader header={header}>
            {(value) => {
              headerFromContext = hook.useHeaderContext<string>()
              return (
                <>
                  <output aria-label="header context matches">
                    {String(headerFromContext === header)}
                  </output>
                  <output aria-label="header component is bound">
                    {String(value.HeaderBadge === HeaderBadge)}
                  </output>
                  <value.HeaderBadge />
                  <output aria-label="rendered header">
                    <value.FlexRender />
                  </output>
                </>
              )
            }}
          </table.AppHeader>
          <table.AppFooter header={footer}>
            {(value) => {
              footerFromContext = hook.useHeaderContext<string>()
              return (
                <>
                  <output aria-label="footer context matches">
                    {String(footerFromContext === footer)}
                  </output>
                  <output aria-label="rendered footer">
                    <value.FlexRender />
                  </output>
                </>
              )
            }}
          </table.AppFooter>
        </table.AppTable>
      )
    }

    render(() => <Harness />)

    expect(
      screen.getByRole('status', { name: 'table context matches' }).textContent,
    ).toBe('true')
    expect(
      screen.getByRole('status', { name: 'cell context matches' }).textContent,
    ).toBe('true')
    expect(
      screen.getByRole('status', { name: 'header context matches' })
        .textContent,
    ).toBe('true')
    expect(
      screen.getByRole('status', { name: 'footer context matches' })
        .textContent,
    ).toBe('true')
    expect(
      screen.getByRole('status', { name: 'cell component is bound' })
        .textContent,
    ).toBe('true')
    expect(
      screen.getByRole('status', { name: 'header component is bound' })
        .textContent,
    ).toBe('true')
    expect(screen.getByText('table-badge').textContent).toBe('table-badge')
    expect(screen.getByText('cell-badge').textContent).toBe('cell-badge')
    expect(screen.getByText('header-badge').textContent).toBe('header-badge')
    expect(
      screen.getByRole('status', { name: 'rendered cell' }).textContent,
    ).toBe('cell:Ada')
    expect(
      screen.getByRole('status', { name: 'rendered header' }).textContent,
    ).toBe('header:name')
    expect(
      screen.getByRole('status', { name: 'rendered footer' }).textContent,
    ).toBe('footer:name')
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
