import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { act } from 'preact/test-utils'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { afterEach, describe, expect, it } from 'vitest'
import { createSignalTableHook } from '../../src/createSignalTableHook'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

type TestRow = {
  id: number
  name: string
}

const data: ReadonlyArray<TestRow> = Array.from({ length: 100 }, (_, id) => ({
  id,
  name: `Row ${id}`,
}))

let paginationControlsRenderCount = 0
let ownerRenderCount = 0

const { useAppTable, createAppColumnHelper, useTableContext, useCellContext } =
  createSignalTableHook({
    features,
    tableComponents: {
      PaginationControls: function PaginationControls() {
        paginationControlsRenderCount++
        const table = useTableContext()
        return (
          <>
            <output aria-label="Page index">
              {table.atoms.pagination.get().pageIndex}
            </output>
            <button onClick={() => table.nextPage()}>Next page</button>
          </>
        )
      },
    },
    cellComponents: {
      NameCell: function NameCell() {
        const cell = useCellContext<string>()
        return <span>name: {cell.getValue()}</span>
      },
    },
  })

const columnHelper = createAppColumnHelper<TestRow>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ cell }) => <cell.NameCell />,
  }),
])

function text(name: string) {
  return screen.getByRole('status', { name }).textContent
}

afterEach(() => {
  cleanup()
  paginationControlsRenderCount = 0
  ownerRenderCount = 0
})

describe('createSignalTableHook', () => {
  it('wires default options, App wrappers, and registered components', () => {
    function Harness() {
      ownerRenderCount++
      const table = useAppTable({ columns, data })

      return (
        <table.AppTable>
          <tbody>
            {table.getRowModel().rows.slice(0, 1).map((row) =>
              row.getAllCells().map((cell) => (
                <table.AppCell cell={cell} key={cell.id}>
                  {(c) => (
                    <output aria-label="First cell">
                      <c.FlexRender />
                    </output>
                  )}
                </table.AppCell>
              )),
            )}
          </tbody>
          <table.PaginationControls />
        </table.AppTable>
      )
    }

    render(<Harness />)

    // The cellComponent registered in the hook renders through the pre-bound
    // column helper's cell context.
    expect(text('First cell')).toBe('name: Row 0')
    expect(text('Page index')).toBe('0')

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    })

    expect(text('First cell')).toBe('name: Row 10')
    expect(text('Page index')).toBe('1')
  })

  it('scopes re-renders: paging re-renders readers, never the owner', () => {
    function Harness() {
      ownerRenderCount++
      const table = useAppTable({ columns, data })

      return (
        <table.AppTable>
          <table.PaginationControls />
        </table.AppTable>
      )
    }

    render(<Harness />)

    expect(ownerRenderCount).toBe(1)
    expect(paginationControlsRenderCount).toBe(1)

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    })

    expect(text('Page index')).toBe('1')
    expect(paginationControlsRenderCount).toBe(2)
    expect(ownerRenderCount).toBe(1)
  })
})
