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
    <output data-testid="bound-row-count">
      {table.getRowModel().rows.length}
    </output>
  )
}

function NameCell() {
  const cell = contexts.useCellContext<string>()

  return <span data-testid="bound-cell">{cell.getValue().toUpperCase()}</span>
}

function NameHeader() {
  const header = contexts.useHeaderContext<string>()

  return <span data-testid="bound-header">Header {header.column.id}</span>
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

function text(testId: string) {
  return screen.getByTestId(testId).textContent
}

function click(action: string) {
  fireEvent.click(screen.getByTestId(action))
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
              <output data-testid="app-table-selection">{selectedCount}</output>
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
                    <output data-testid="app-cell-selection">
                      {String(selected)}
                    </output>
                  </>
                )}
              </table.AppCell>
              <table.AppFooter header={header}>
                {(extendedFooter) => <extendedFooter.FlexRender />}
              </table.AppFooter>
              <button
                data-testid="select-app-row"
                onClick={() => cell.row.toggleSelected(true)}
              />
            </>
          )}
        </table.AppTable>
      )
    }

    render(<TableHarness />)

    expect(text('bound-row-count')).toBe('1')
    expect(text('bound-header')).toBe('Header name')
    expect(text('bound-cell')).toBe('ADA')
    expect(screen.getByText('Name footer')).toBeTruthy()
    expect(text('app-table-selection')).toBe('0')
    expect(text('app-cell-selection')).toBe('false')

    act(() => {
      click('select-app-row')
    })

    expect(text('app-table-selection')).toBe('1')
    expect(text('app-cell-selection')).toBe('true')
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
