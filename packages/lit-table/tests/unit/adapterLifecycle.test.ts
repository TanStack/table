// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/dom'
import { createAtom } from '@tanstack/lit-store'
import { stockFeatures } from '@tanstack/table-core'
import { LitElement, html } from 'lit'
import { TableController } from '../../src/TableController'
import type {
  ColumnDef,
  LitTable,
  OnChangeFn,
  RowSelectionState,
} from '../../src'

type Data = { id: string; title: string }

const idColumn: ColumnDef<typeof stockFeatures, Data> = {
  id: 'id',
  accessorKey: 'id',
}
const titleColumn: ColumnDef<typeof stockFeatures, Data> = {
  id: 'title',
  accessorKey: 'title',
}

let elementId = 0

function mount<TElement extends LitElement>(
  elementClass: CustomElementConstructor,
): TElement {
  const tagName = `lit-table-adapter-test-${elementId++}`
  customElements.define(tagName, elementClass)
  const element = document.createElement(tagName) as TElement
  document.body.append(element)
  return element
}

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent.trim()
}

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('TableController lifecycle and option ownership', () => {
  test('disconnecting the host stops root reactions to later state changes', async () => {
    const sourceAtom = createAtom<RowSelectionState>({})
    const rootSelectorCaptor = vi.fn<(state: RowSelectionState) => void>()

    class LifecycleTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)
      table?: LitTable<typeof stockFeatures, Data, RowSelectionState>

      createRenderRoot() {
        return this
      }

      protected render() {
        const table = this.controller.table(
          {
            data: [{ id: '1', title: 'First' }],
            columns: [idColumn, titleColumn],
            features: stockFeatures,
            getRowId: (row) => row.id,
            atoms: {
              rowSelection: sourceAtom,
            },
          },
          (state) => {
            rootSelectorCaptor(state.rowSelection)
            return state.rowSelection
          },
        )
        this.table = table

        return html`
          <output aria-label="Lifecycle selection">
            ${JSON.stringify(table.state)}
          </output>
        `
      }
    }

    const element = mount<LifecycleTable>(LifecycleTable)
    await element.updateComplete

    expect(rootSelectorCaptor.mock.lastCall?.[0]).toEqual({})

    sourceAtom.set({ 1: true })
    await element.updateComplete

    expect(outputText('Lifecycle selection')).toBe('{"1":true}')
    expect(rootSelectorCaptor.mock.lastCall?.[0]).toEqual({ 1: true })

    element.remove()

    const callsAfterDisconnect = rootSelectorCaptor.mock.calls.length

    sourceAtom.set({ 2: true })
    element.table?.setPageSize(25)

    expect(rootSelectorCaptor).toHaveBeenCalledTimes(callsAfterDisconnect)

    document.body.append(element)
    await element.updateComplete

    expect(outputText('Lifecycle selection')).toBe('{"2":true}')
    expect(rootSelectorCaptor.mock.lastCall?.[0]).toEqual({ 2: true })
  })

  test('controlled state can release and reacquire ownership of a slice', async () => {
    class OwnershipTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)
      private controlledState: { rowSelection?: RowSelectionState } = {
        rowSelection: { 1: true },
      }
      table?: LitTable<typeof stockFeatures, Data, RowSelectionState>

      createRenderRoot() {
        return this
      }

      setControlledState(state: { rowSelection?: RowSelectionState }) {
        this.controlledState = state
        this.requestUpdate()
      }

      protected render() {
        const table = this.controller.table(
          {
            data: [
              { id: '1', title: 'First' },
              { id: '2', title: 'Second' },
            ],
            columns: [idColumn, titleColumn],
            features: stockFeatures,
            getRowId: (row) => row.id,
            state: this.controlledState,
          },
          (state) => state.rowSelection,
        )
        this.table = table

        return html`
          <output aria-label="Owned selection">
            ${JSON.stringify(table.state)}
          </output>
        `
      }
    }

    const element = mount<OwnershipTable>(OwnershipTable)
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{"1":true}')

    element.setControlledState({})
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{"1":true}')

    element.table!.setRowSelection({ 2: true })
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{"2":true}')

    element.setControlledState({ rowSelection: { 1: true, 2: true } })
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{"1":true,"2":true}')

    element.table!.setRowSelection({})
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{"1":true,"2":true}')

    element.setControlledState({})
    await element.updateComplete

    expect(outputText('Owned selection')).toBe('{}')
  })

  test('an external atom takes precedence over controlled state and receives table writes', async () => {
    const externalAtom = createAtom<RowSelectionState>({ 2: true })

    class ExternalAtomTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)
      private controlledSelection: RowSelectionState = { 1: true }
      table?: LitTable<typeof stockFeatures, Data, RowSelectionState>

      createRenderRoot() {
        return this
      }

      setControlledSelection(selection: RowSelectionState) {
        this.controlledSelection = selection
        this.requestUpdate()
      }

      protected render() {
        const table = this.controller.table(
          {
            data: [
              { id: '1', title: 'First' },
              { id: '2', title: 'Second' },
            ],
            columns: [idColumn, titleColumn],
            features: stockFeatures,
            getRowId: (row) => row.id,
            state: {
              rowSelection: this.controlledSelection,
            },
            atoms: {
              rowSelection: externalAtom,
            },
          },
          (state) => state.rowSelection,
        )
        this.table = table

        return html`
          <output aria-label="External selection">
            ${JSON.stringify(table.state)}
          </output>
          <button @click=${() => table.getRow('1').toggleSelected(false)}>
            Deselect external row
          </button>
        `
      }
    }

    const element = mount<ExternalAtomTable>(ExternalAtomTable)
    await element.updateComplete

    expect(outputText('External selection')).toBe('{"2":true}')

    element.setControlledSelection({ 1: true, 2: true })
    await element.updateComplete

    expect(outputText('External selection')).toBe('{"2":true}')

    externalAtom.set({ 1: true, 2: true })
    await element.updateComplete

    expect(outputText('External selection')).toBe('{"1":true,"2":true}')

    fireEvent.click(
      screen.getByRole('button', { name: 'Deselect external row' }),
    )
    await element.updateComplete

    expect(externalAtom.get()).toEqual({ 2: true })
    expect(outputText('External selection')).toBe('{"2":true}')
  })

  test('coalesces dynamic data, columns, and callbacks into the next render', async () => {
    const firstSelectionHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const secondSelectionHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const renderCaptor =
      vi.fn<
        (snapshot: {
          canSelect: boolean
          columnIds: Array<string>
          values: Array<unknown>
        }) => void
      >()

    class DynamicOptionsTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)
      private data: Array<Data> = [{ id: '1', title: 'Initial' }]
      private columns: Array<ColumnDef<typeof stockFeatures, Data>> = [idColumn]
      private enableRowSelection = true
      private onRowSelectionChange: OnChangeFn<RowSelectionState> =
        firstSelectionHandler
      table?: LitTable<typeof stockFeatures, Data, null>

      createRenderRoot() {
        return this
      }

      setOptions(options: {
        columns: Array<ColumnDef<typeof stockFeatures, Data>>
        data: Array<Data>
        enableRowSelection: boolean
        onRowSelectionChange: OnChangeFn<RowSelectionState>
      }) {
        this.data = options.data
        this.columns = options.columns
        this.enableRowSelection = options.enableRowSelection
        this.onRowSelectionChange = options.onRowSelectionChange
        this.requestUpdate()
      }

      protected render() {
        const table = this.controller.table(
          {
            data: this.data,
            columns: this.columns,
            features: stockFeatures,
            enableRowSelection: this.enableRowSelection,
            getRowId: (row) => row.id,
            onRowSelectionChange: this.onRowSelectionChange,
          },
          () => null,
        )
        this.table = table
        const row = table.getRowModel().rows[0]!
        const snapshot = {
          canSelect: row.getCanSelect(),
          columnIds: table.getAllLeafColumns().map((column) => column.id),
          values: row.getAllCells().map((cell) => cell.getValue()),
        }
        renderCaptor(snapshot)

        return html`
          <output aria-label="Dynamic options">
            ${JSON.stringify(snapshot)}
          </output>
        `
      }
    }

    const element = mount<DynamicOptionsTable>(DynamicOptionsTable)
    await element.updateComplete

    expect(element.table?.subscribe).toEqual(expect.any(Function))
    expect(element.table?.FlexRender).toEqual(expect.any(Function))
    expect('state' in element.table!).toBe(true)

    element.table!.toggleAllRowsSelected(true)

    expect(firstSelectionHandler).toHaveBeenCalledOnce()
    expect(secondSelectionHandler).not.toHaveBeenCalled()

    element.setOptions({
      data: [{ id: '2', title: 'Intermediate' }],
      columns: [idColumn, titleColumn],
      enableRowSelection: false,
      onRowSelectionChange: secondSelectionHandler,
    })
    element.setOptions({
      data: [{ id: '3', title: 'Final' }],
      columns: [titleColumn],
      enableRowSelection: false,
      onRowSelectionChange: secondSelectionHandler,
    })
    await element.updateComplete

    expect(renderCaptor.mock.calls).toEqual([
      [
        {
          canSelect: true,
          columnIds: ['id'],
          values: ['1'],
        },
      ],
      [
        {
          canSelect: false,
          columnIds: ['title'],
          values: ['Final'],
        },
      ],
    ])
    expect(outputText('Dynamic options')).toBe(
      '{"canSelect":false,"columnIds":["title"],"values":["Final"]}',
    )

    element.table!.toggleAllRowsSelected(false)

    expect(firstSelectionHandler).toHaveBeenCalledOnce()
    expect(secondSelectionHandler).toHaveBeenCalledOnce()
  })
})
