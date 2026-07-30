// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { useState } from 'preact/hooks'
import { act } from 'preact/test-utils'
import { stockFeatures } from '@tanstack/table-core'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { FlexRender, useTable } from '../../src'
import type { ColumnDef } from '@tanstack/table-core'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent
}

describe('FlexRender', () => {
  type Data = { id: string; name: string }
  type CellMode = 'aggregate' | 'normal' | 'placeholder'

  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => <span>{`header:${column.id}`}</span>,
      cell: ({ getValue }) => <strong>{`cell:${String(getValue())}`}</strong>,
      aggregatedCell: ({ getValue }) => (
        <em>{`aggregate:${String(getValue())}`}</em>
      ),
      footer: ({ column }) => <small>{`footer:${column.id}`}</small>,
    },
  ]

  function CellHarness({ mode }: { mode: CellMode }) {
    const table = useTable({
      data: [{ id: '1', name: 'Ada' }],
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

    if (mode === 'aggregate') {
      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(true)
    }

    if (mode === 'placeholder') {
      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(false)
      vi.spyOn(cell, 'getIsPlaceholder').mockReturnValue(true)
    }

    return (
      <output aria-label={`${mode} cell`}>
        <FlexRender cell={cell} />
      </output>
    )
  }

  function HeaderFooterHarness() {
    const table = useTable({
      data: [{ id: '1', name: 'Ada' }],
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!
    const footer = table.getFooterGroups()[0]!.headers[0]!

    return (
      <>
        <output aria-label="Rendered header">
          <FlexRender header={header} />
        </output>
        <output aria-label="Rendered footer">
          <FlexRender footer={footer} />
        </output>
      </>
    )
  }

  test('renders normal, aggregate, placeholder, header, and footer content', () => {
    render(
      <>
        <CellHarness mode="normal" />
        <CellHarness mode="aggregate" />
        <CellHarness mode="placeholder" />
        <HeaderFooterHarness />
      </>,
    )

    expect(outputText('normal cell')).toBe('cell:Ada')
    expect(outputText('aggregate cell')).toBe('aggregate:Ada')
    expect(outputText('placeholder cell')).toBe('')
    expect(outputText('Rendered header')).toBe('header:name')
    expect(outputText('Rendered footer')).toBe('footer:name')
  })

  test('reacts when a stable cell changes grouping mode', () => {
    function GroupingCellHarness() {
      const [mode, setMode] = useState<CellMode>('normal')
      const table = useTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      vi.spyOn(cell, 'getIsAggregated').mockImplementation(
        () => mode === 'aggregate',
      )
      vi.spyOn(cell, 'getIsPlaceholder').mockImplementation(
        () => mode === 'placeholder',
      )

      return (
        <>
          <output aria-label="Grouping cell">
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

    render(<GroupingCellHarness />)

    expect(outputText('Grouping cell')).toBe('cell:Ada')

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Show aggregate' }))
    })
    expect(outputText('Grouping cell')).toBe('aggregate:Ada')

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Show placeholder' }))
    })
    expect(outputText('Grouping cell')).toBe('')

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Show normal' }))
    })
    expect(outputText('Grouping cell')).toBe('cell:Ada')
  })

  test('updates when the cell prop is replaced with a new instance', () => {
    function CellReplacementHarness() {
      const [data, setData] = useState<Array<Data>>([{ id: '1', name: 'Ada' }])
      const table = useTable({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      return (
        <>
          <output aria-label="Replaced cell">
            <FlexRender cell={cell} />
          </output>
          <button onClick={() => setData([{ id: '1', name: 'Grace' }])}>
            Replace cell
          </button>
        </>
      )
    }

    render(<CellReplacementHarness />)

    expect(outputText('Replaced cell')).toBe('cell:Ada')

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Replace cell' }))
    })

    expect(outputText('Replaced cell')).toBe('cell:Grace')
  })
})

describe('table.Subscribe', () => {
  test('updates mounted content for the selected atom slice', () => {
    function SubscribeHarness() {
      const table = useTable(
        {
          data: [{ id: '1' }],
          columns: [{ id: 'id', accessorKey: 'id' }],
          features: stockFeatures,
          getRowId: (row) => row.id,
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
              <output aria-label="Subscribed selection">
                {String(selected)}
              </output>
            )}
          </table.Subscribe>
          <button onClick={() => table.getRow('1').toggleSelected(true)}>
            Select subscribed row
          </button>
        </>
      )
    }

    render(<SubscribeHarness />)

    expect(outputText('Subscribed selection')).toBe('false')

    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Select subscribed row' }),
      )
    })

    expect(outputText('Subscribed selection')).toBe('true')
  })
})
