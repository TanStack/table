// @vitest-environment jsdom

import * as React from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { rowSelectionFeature, tableFeatures } from '@tanstack/table-core'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createTableHook, createTableHookContexts } from '../src'

type Person = {
  id: string
  name: string
}

const features = tableFeatures({
  rowSelectionFeature,
})
const contexts = createTableHookContexts<typeof features, Person>()

function RowCount() {
  const table = contexts.useTableContext<Person>()

  return (
    <output aria-label="Bound row count">
      {table.getRowModel().rows.length}
    </output>
  )
}

function NameCell() {
  const cell = contexts.useCellContext<string>()

  return <span>{cell.getValue().toUpperCase()}</span>
}

function NameHeader() {
  const header = contexts.useHeaderContext<string>()

  return <span>Header {header.column.id}</span>
}

const appTable = createTableHook({
  features,
  tableContext: contexts.tableContext,
  cellContext: contexts.cellContext,
  headerContext: contexts.headerContext,
  tableComponents: { RowCount },
  cellComponents: { NameCell },
  headerComponents: { NameHeader },
})
const columnHelper = appTable.createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    id: 'name',
    header: ({ header }) => <header.NameHeader />,
    cell: ({ cell }) => <cell.NameCell />,
    footer: 'Name footer',
  }),
])

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

describe('createTableHook runtime', () => {
  test('binds components, contexts, FlexRender, and state selectors', () => {
    function TableHarness() {
      const table = appTable.useAppTable(
        {
          data: [{ id: '1', name: 'Ada' }],
          columns,
          getRowId: (row) => row.id,
        },
        () => null,
      )
      const header = table.getHeaderGroups()[0]!.headers[0]!
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      return (
        <table.AppTable
          selector={(state) => Object.keys(state.rowSelection).length}
        >
          {(selectedCount) => (
            <>
              <table.RowCount />
              <output aria-label="App table selection">{selectedCount}</output>
              <table.AppHeader header={header}>
                {(extendedHeader) => <extendedHeader.FlexRender />}
              </table.AppHeader>
              <table.AppCell
                cell={cell}
                selector={(state) => Boolean(state.rowSelection[cell.row.id])}
              >
                {(extendedCell, selected) => (
                  <>
                    <extendedCell.FlexRender />
                    <output aria-label="App cell selection">
                      {String(selected)}
                    </output>
                  </>
                )}
              </table.AppCell>
              <table.AppFooter header={header}>
                {(extendedFooter) => <extendedFooter.FlexRender />}
              </table.AppFooter>
              <button onClick={() => cell.row.toggleSelected(true)}>
                Select app row
              </button>
            </>
          )}
        </table.AppTable>
      )
    }

    render(<TableHarness />)

    expect(text('Bound row count')).toBe('1')
    expect(screen.getByText('Header name')).toBeTruthy()
    expect(screen.getByText('ADA')).toBeTruthy()
    expect(screen.getByText('Name footer')).toBeTruthy()
    expect(text('App table selection')).toBe('0')
    expect(text('App cell selection')).toBe('false')

    act(() => {
      click('Select app row')
    })

    expect(text('App table selection')).toBe('1')
    expect(text('App cell selection')).toBe('true')
  })

  test('keeps App wrappers mounted while their contexts receive new table objects', () => {
    const mountCaptor = vi.fn()
    const unmountCaptor = vi.fn()

    function StatefulCell() {
      const cell = appTable.useCellContext<string>()
      const [draft, setDraft] = React.useState('initial')

      React.useEffect(() => {
        mountCaptor()
        return () => unmountCaptor()
      }, [])

      return (
        <>
          <label htmlFor="stateful-cell-input">Cell draft</label>
          <input
            id="stateful-cell-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <output aria-label="Latest cell value">{cell.getValue()}</output>
        </>
      )
    }

    function TableHarness() {
      const [updated, setUpdated] = React.useState(false)
      const table = appTable.useAppTable(
        {
          data: [{ id: '1', name: updated ? 'Grace' : 'Ada' }],
          columns,
          getRowId: (row) => row.id,
        },
        () => null,
      )
      const header = table.getHeaderGroups()[0]!.headers[0]!
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      return (
        <>
          <table.AppTable>
            <table.AppHeader header={header}>
              {() => (
                <table.AppFooter header={header}>
                  {() => (
                    <table.AppCell cell={cell}>
                      {() => <StatefulCell />}
                    </table.AppCell>
                  )}
                </table.AppFooter>
              )}
            </table.AppHeader>
          </table.AppTable>
          <button onClick={() => setUpdated(true)}>Refresh app table</button>
        </>
      )
    }

    render(<TableHarness />)

    const input = screen.getByRole('textbox', { name: 'Cell draft' })
    fireEvent.change(input, { target: { value: 'edited' } })

    expect(text('Latest cell value')).toBe('Ada')
    expect(mountCaptor).toHaveBeenCalledOnce()

    act(() => {
      click('Refresh app table')
    })

    expect(screen.getByRole('textbox', { name: 'Cell draft' })).toBe(input)
    expect((input as HTMLInputElement).value).toBe('edited')
    expect(text('Latest cell value')).toBe('Grace')
    expect(mountCaptor).toHaveBeenCalledOnce()
    expect(unmountCaptor).not.toHaveBeenCalled()
  })

  test.each([
    ['cached', true],
    ['uncached', false],
  ])(
    'refreshes the AppTable context once when the owner replaces data under a %s element',
    (_label, cacheTree) => {
      const renderCaptor = vi.fn()

      function RowNames() {
        const table = appTable.useTableContext<Person>()
        renderCaptor()

        return (
          <output aria-label="Context row names">
            {table
              .getRowModel()
              .rows.map((row) => row.original.name)
              .join(',')}
          </output>
        )
      }

      function TableHarness() {
        const [data, setData] = React.useState([{ id: '1', name: 'Ada' }])
        const table = appTable.useAppTable(
          { data, columns, getRowId: (row) => row.id },
          () => null,
        )
        // The React Compiler caches this element because `table.AppTable` is
        // stable, so React skips AppTable when only `data` changes.
        const cachedTree = React.useMemo(
          () => (
            <table.AppTable>
              <RowNames />
            </table.AppTable>
          ),
          [table.AppTable],
        )
        const tree = cacheTree ? (
          cachedTree
        ) : (
          <table.AppTable>
            <RowNames />
          </table.AppTable>
        )

        return (
          <>
            {tree}
            <button onClick={() => setData([{ id: '1', name: 'Grace' }])}>
              Replace data
            </button>
          </>
        )
      }

      render(<TableHarness />)

      expect(text('Context row names')).toBe('Ada')
      expect(renderCaptor).toHaveBeenCalledTimes(1)

      act(() => {
        click('Replace data')
      })

      expect(text('Context row names')).toBe('Grace')
      expect(renderCaptor).toHaveBeenCalledTimes(2)
    },
  )

  test('keeps the AppTable context stable when the owner re-renders with the same options', () => {
    const renderCaptor = vi.fn()

    function RowNames() {
      const table = appTable.useTableContext<Person>()
      renderCaptor()

      return (
        <output aria-label="Context row names">
          {table
            .getRowModel()
            .rows.map((row) => row.original.name)
            .join(',')}
        </output>
      )
    }

    const data = [{ id: '1', name: 'Ada' }]

    function TableHarness() {
      const [count, setCount] = React.useState(0)
      // The React Compiler memoizes these options because their inputs are
      // stable, so an unrelated owner render should not refresh the context.
      const tableOptions = React.useMemo(
        () => ({ data, columns, getRowId: (row: Person) => row.id }),
        [],
      )
      const table = appTable.useAppTable(tableOptions, () => null)
      const cachedTree = React.useMemo(
        () => (
          <table.AppTable>
            <RowNames />
          </table.AppTable>
        ),
        [table.AppTable],
      )

      return (
        <>
          {cachedTree}
          <button onClick={() => setCount(count + 1)}>Render owner</button>
        </>
      )
    }

    render(<TableHarness />)

    expect(text('Context row names')).toBe('Ada')
    expect(renderCaptor).toHaveBeenCalledTimes(1)

    act(() => {
      click('Render owner')
    })
    act(() => {
      click('Render owner')
    })

    expect(text('Context row names')).toBe('Ada')
    expect(renderCaptor).toHaveBeenCalledTimes(1)
  })

  test('throws focused errors when context hooks are used outside wrappers', () => {
    function MissingTableContext() {
      appTable.useTableContext<Person>()
      return null
    }

    function MissingCellContext() {
      appTable.useCellContext<string>()
      return null
    }

    function MissingHeaderContext() {
      appTable.useHeaderContext<string>()
      return null
    }

    expect(() => render(<MissingTableContext />)).toThrow(
      '`useTableContext` must be used within an `AppTable` component',
    )
    cleanup()
    expect(() => render(<MissingCellContext />)).toThrow(
      '`useCellContext` must be used within an `AppCell` component',
    )
    cleanup()
    expect(() => render(<MissingHeaderContext />)).toThrow(
      '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component',
    )
  })
})
