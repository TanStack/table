// @vitest-environment node

import { forwardRef, memo } from 'preact/compat'
import { renderToString } from 'preact-render-to-string'
import { describe, expect, test, vi } from 'vitest'
import { flexRender, stockFeatures, useTable } from '../../src'
import type { ColumnDef } from '../../src'

type Person = {
  id: string
  name: string
}

const columns: Array<ColumnDef<typeof stockFeatures, Person>> = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <span>{`Header ${column.id}`}</span>,
    cell: ({ getValue }) => <strong>{`Cell ${String(getValue())}`}</strong>,
    aggregatedCell: ({ getValue }) => (
      <em>{`Aggregate ${String(getValue())}`}</em>
    ),
    footer: 'Name footer',
  },
]

describe('Preact server rendering', () => {
  test('renders useTable state and FlexRender output without a DOM', () => {
    function ServerTable() {
      const table = useTable({
        data: [{ id: '1', name: 'Ada' }],
        features: stockFeatures,
        columns,
        getRowId: (row) => row.id,
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 25,
          },
        },
      })
      const header = table.getHeaderGroups()[0]!.headers[0]!
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

      return (
        <table data-page-size={table.state.pagination.pageSize}>
          <thead>
            <tr>
              <th>
                <table.FlexRender header={header} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <table.FlexRender cell={cell} />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <table.FlexRender footer={header} />
              </td>
            </tr>
          </tfoot>
        </table>
      )
    }

    expect(typeof document).toBe('undefined')

    const markup = renderToString(<ServerTable />)

    expect(markup).toContain('data-page-size="25"')
    expect(markup).toContain('<span>Header name</span>')
    expect(markup).toContain('<strong>Cell Ada</strong>')
    expect(markup).toContain('<td>Name footer</td>')
  })

  test('selects aggregate content and suppresses placeholder cells', () => {
    function CellModes() {
      const table = useTable({
        data: [
          { id: '1', name: 'Ada' },
          { id: '2', name: 'Grace' },
        ],
        features: stockFeatures,
        columns,
        getRowId: (row) => row.id,
      })
      const aggregatedCell = table.getRow('1').getAllCells()[0]!
      const placeholderCell = table.getRow('2').getAllCells()[0]!

      vi.spyOn(aggregatedCell, 'getIsAggregated').mockReturnValue(true)
      vi.spyOn(placeholderCell, 'getIsAggregated').mockReturnValue(false)
      vi.spyOn(placeholderCell, 'getIsPlaceholder').mockReturnValue(true)

      return (
        <>
          <div data-mode="aggregate">
            <table.FlexRender cell={aggregatedCell} />
          </div>
          <div data-mode="placeholder">
            <table.FlexRender cell={placeholderCell} />
          </div>
        </>
      )
    }

    expect(renderToString(<CellModes />)).toBe(
      '<div data-mode="aggregate"><em>Aggregate Ada</em></div>' +
        '<div data-mode="placeholder"></div>',
    )
  })

  test('flexRender handles functions, exotic components, nodes, zero, and empty values', () => {
    function FunctionRenderable({ value }: { value: string }) {
      return <span data-kind="function">{value}</span>
    }

    const MemoRenderable = memo(function MemoRenderable({
      value,
    }: {
      value: string
    }) {
      return <span data-kind="memo">{value}</span>
    })
    const ForwardRefRenderable = forwardRef<HTMLSpanElement, { value: string }>(
      function ForwardRefRenderable({ value }, ref) {
        return (
          <span ref={ref} data-kind="forward-ref">
            {value}
          </span>
        )
      },
    )

    const markup = renderToString(
      <>
        {flexRender(FunctionRenderable, { value: 'function value' })}
        {flexRender(MemoRenderable, { value: 'memo value' })}
        {flexRender(ForwardRefRenderable, { value: 'forward value' })}
        {flexRender(<span data-kind="node">node value</span>, {
          value: 'ignored',
        })}
        {flexRender(0, { value: 'ignored' })}
      </>,
    )

    expect(markup).toBe(
      '<span data-kind="function">function value</span>' +
        '<span data-kind="memo">memo value</span>' +
        '<span data-kind="forward-ref">forward value</span>' +
        '<span data-kind="node">node value</span>' +
        '0',
    )
    expect(flexRender(0, {})).toBe(0)
    expect(flexRender(false, {})).toBe(false)
    expect(flexRender('', {})).toBe('')
    expect(flexRender(null, {})).toBeNull()
  })
})
