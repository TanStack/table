// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/dom'
import { createAtom } from '@tanstack/lit-store'
import { stockFeatures } from '@tanstack/table-core'
import { LitElement, html } from 'lit'
import { createTableHook } from '../../src/createTableHook'
import { FlexRender } from '../../src/flexRender'
import { TableController } from '../../src/TableController'
import { subscribe } from '../../src/subscribe-directive'
import type { Cell, ColumnDef, Header, RowSelectionState } from '../../src'

type Data = { id: string; name: string }

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

let elementId = 0

function mount<TElement extends LitElement>(
  elementClass: CustomElementConstructor,
): TElement {
  const tagName = `lit-table-render-test-${elementId++}`
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

describe('FlexRender', () => {
  test('renders normal, aggregate, placeholder, header, and footer templates reactively', async () => {
    class FlexRenderTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)
      private mode: 'normal' | 'aggregate' | 'placeholder' = 'normal'
      private cell?: Cell<typeof stockFeatures, Data, string>
      private header?: Header<typeof stockFeatures, Data, string>
      private footer?: Header<typeof stockFeatures, Data, string>

      createRenderRoot() {
        return this
      }

      setMode(mode: 'normal' | 'aggregate' | 'placeholder') {
        this.mode = mode
        this.requestUpdate()
      }

      protected render() {
        const table = this.controller.table({
          data: [{ id: '1', name: 'Ada' }],
          columns,
          features: stockFeatures,
          getRowId: (row) => row.id,
        })

        if (!this.cell) {
          this.cell = table.getRow('1').getAllCells()[0] as Cell<
            typeof stockFeatures,
            Data,
            string
          >
          this.header = table.getHeaderGroups()[0]!.headers[0] as Header<
            typeof stockFeatures,
            Data,
            string
          >
          this.footer = table.getFooterGroups()[0]!.headers[0] as Header<
            typeof stockFeatures,
            Data,
            string
          >
          vi.spyOn(this.cell, 'getIsAggregated').mockImplementation(
            () => this.mode === 'aggregate',
          )
          vi.spyOn(this.cell, 'getIsPlaceholder').mockImplementation(
            () => this.mode === 'placeholder',
          )
        }

        return html`
          <output aria-label="Rendered cell">
            ${FlexRender({ cell: this.cell })}
          </output>
          <output aria-label="Rendered header">
            ${FlexRender({ header: this.header! })}
          </output>
          <output aria-label="Rendered footer">
            ${FlexRender({ footer: this.footer! })}
          </output>
        `
      }
    }

    const element = mount<FlexRenderTable>(FlexRenderTable)
    await element.updateComplete

    expect(outputText('Rendered cell')).toBe('cell:Ada')
    expect(outputText('Rendered header')).toBe('header:name')
    expect(outputText('Rendered footer')).toBe('footer:name')

    element.setMode('aggregate')
    await element.updateComplete

    expect(outputText('Rendered cell')).toBe('aggregate:Ada')

    element.setMode('placeholder')
    await element.updateComplete

    expect(outputText('Rendered cell')).toBe('')

    element.setMode('normal')
    await element.updateComplete

    expect(outputText('Rendered cell')).toBe('cell:Ada')
  })
})

describe('table.subscribe', () => {
  test('updates both source overloads without rerendering an opted-out host', async () => {
    const hostRenderCaptor = vi.fn()

    class SubscribeTable extends LitElement {
      private controller = new TableController<typeof stockFeatures, Data>(this)

      createRenderRoot() {
        return this
      }

      protected render() {
        hostRenderCaptor()
        const table = this.controller.table(
          {
            data: [{ id: '1', name: 'Ada' }],
            columns,
            features: stockFeatures,
            getRowId: (row) => row.id,
          },
          () => ({}),
        )

        return html`
          ${table.subscribe(
            table.atoms.rowSelection,
            (selection) => html`
              <output aria-label="Subscribed atom selection">
                ${JSON.stringify(selection)}
              </output>
            `,
          )}
          ${table.subscribe(
            table.store,
            (state) => Boolean(state.rowSelection['1']),
            (selected) => html`
              <output aria-label="Subscribed selected row">
                ${String(selected)}
              </output>
            `,
          )}
          <button @click=${() => table.getRow('1').toggleSelected(true)}>
            Select subscribed row
          </button>
        `
      }
    }

    const element = mount<SubscribeTable>(SubscribeTable)
    await element.updateComplete

    expect(outputText('Subscribed atom selection')).toBe('{}')
    expect(outputText('Subscribed selected row')).toBe('false')

    fireEvent.click(
      screen.getByRole('button', { name: 'Select subscribed row' }),
    )

    await waitFor(() => {
      expect(outputText('Subscribed atom selection')).toBe('{"1":true}')
      expect(outputText('Subscribed selected row')).toBe('true')
    })
    expect(hostRenderCaptor).toHaveBeenCalledOnce()
  })

  test('disconnecting a directive unsubscribes its source', async () => {
    const sourceAtom = createAtom<RowSelectionState>({})
    const subscribeSpy = vi.spyOn(sourceAtom, 'subscribe')
    const templateCaptor = vi.fn<(selection: RowSelectionState) => void>()

    class SubscribeLifecycle extends LitElement {
      createRenderRoot() {
        return this
      }

      protected render() {
        return html`
          ${subscribe(sourceAtom, (selection) => {
            templateCaptor(selection)
            return html`
              <output aria-label="Directive lifecycle selection">
                ${JSON.stringify(selection)}
              </output>
            `
          })}
        `
      }
    }

    const element = mount<SubscribeLifecycle>(SubscribeLifecycle)
    await element.updateComplete

    expect(subscribeSpy).toHaveBeenCalledOnce()

    sourceAtom.set({ 1: true })
    await waitFor(() => {
      expect(outputText('Directive lifecycle selection')).toBe('{"1":true}')
    })

    element.remove()

    const callsAfterDisconnect = templateCaptor.mock.calls.length
    sourceAtom.set({ 2: true })

    expect(templateCaptor).toHaveBeenCalledTimes(callsAfterDisconnect)

    document.body.append(element)
    await element.updateComplete

    expect(subscribeSpy).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(outputText('Directive lifecycle selection')).toBe('{"2":true}')
    })

    sourceAtom.set({ 3: true })
    await waitFor(() => {
      expect(outputText('Directive lifecycle selection')).toBe('{"3":true}')
    })
  })
})

describe('createTableHook runtime', () => {
  test('binds defaults, registered renderers, wrappers, and table context', async () => {
    const tableBadge = vi.fn(() => html`<span>table-badge</span>`)
    const cellBadge = vi.fn(
      (cell: Cell<typeof stockFeatures, Data>) =>
        html`<span>cell-badge:${cell.id}</span>`,
    )
    const headerBadge = vi.fn(
      (header: Header<typeof stockFeatures, Data>) =>
        html`<span>header-badge:${header.id}</span>`,
    )
    const hook = createTableHook({
      features: stockFeatures,
      enableRowSelection: false,
      getRowId: (row: Data) => `row-${row.id}`,
      tableComponents: { tableBadge },
      cellComponents: { cellBadge },
      headerComponents: { headerBadge },
    })
    const columnHelper = hook.createAppColumnHelper<Data>()
    const appColumns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => `header:${column.id}`,
        cell: ({ getValue }) => `cell:${getValue()}`,
        footer: ({ column }) => `footer:${column.id}`,
      }),
    ])
    const tableContextCaptor = vi.fn<(table: unknown) => void>()

    class TableContextConsumer extends LitElement {
      private tableConsumer = hook.useTableContext<Data>(this)

      createRenderRoot() {
        return this
      }

      protected render() {
        const table = this.tableConsumer.value
        tableContextCaptor(table)

        return html`
          <output aria-label="Table context available">
            ${String(Boolean(table))}
          </output>
        `
      }
    }
    customElements.define(
      'lit-table-context-consumer-test',
      TableContextConsumer,
    )

    class AppTable extends LitElement {
      private appTable = hook.useAppTable(this, {
        data: [{ id: '1', name: 'Ada' }],
        columns: appColumns,
        enableRowSelection: true,
      })
      table?: ReturnType<(typeof this.appTable)['table']>

      createRenderRoot() {
        return this
      }

      protected render() {
        const table = this.appTable.table()
        this.table = table
        const row = table.getRowModel().rows[0]!
        const cell = row.getAllCells()[0]!
        const header = table.getHeaderGroups()[0]!.headers[0]!
        const footer = table.getFooterGroups()[0]!.headers[0]!

        return html`
          <output aria-label="Row can be selected">
            ${String(row.getCanSelect())}
          </output>
          ${table.tableBadge()}
          ${table.AppCell(
            cell,
            (appCell) => html`
              ${appCell.cellBadge()}
              <output aria-label="Bound cell"> ${appCell.FlexRender()} </output>
            `,
          )}
          ${table.AppHeader(
            header,
            (appHeader) => html`
              ${appHeader.headerBadge()}
              <output aria-label="Bound header">
                ${appHeader.FlexRender()}
              </output>
            `,
          )}
          ${table.AppFooter(
            footer,
            (appFooter) => html`
              <output aria-label="Bound footer">
                ${appFooter.FlexRender()}
              </output>
            `,
          )}
          <lit-table-context-consumer-test></lit-table-context-consumer-test>
        `
      }
    }

    const element = mount<AppTable>(AppTable)
    await element.updateComplete
    await waitFor(() => {
      expect(outputText('Table context available')).toBe('true')
    })

    const table = element.table!
    const cell = table.getRowModel().rows[0]!.getAllCells()[0]!
    const header = table.getHeaderGroups()[0]!.headers[0]!

    expect(hook.appFeatures).toBe(stockFeatures)
    expect(table.FlexRender).toBe(FlexRender)
    expect(table.AppCell).toEqual(expect.any(Function))
    expect(table.AppHeader).toEqual(expect.any(Function))
    expect(table.AppFooter).toEqual(expect.any(Function))
    expect(outputText('Row can be selected')).toBe('true')
    expect(outputText('Bound cell')).toBe('cell:Ada')
    expect(outputText('Bound header')).toBe('header:name')
    expect(outputText('Bound footer')).toBe('footer:name')
    expect(screen.getByText(`cell-badge:${cell.id}`)).toBeTruthy()
    expect(screen.getByText(`header-badge:${header.id}`)).toBeTruthy()
    expect(screen.getByText('table-badge')).toBeTruthy()
    expect(cellBadge).toHaveBeenCalledWith(cell)
    expect(headerBadge).toHaveBeenCalledWith(header)
    expect(tableContextCaptor).toHaveBeenCalledWith(table)
  })

  test('bound cell FlexRender preserves aggregate and placeholder modes', async () => {
    const hook = createTableHook({
      features: stockFeatures,
    })
    const columnHelper = hook.createAppColumnHelper<Data>()
    const appColumns = columnHelper.columns([
      columnHelper.accessor('name', {
        cell: ({ getValue }) => `cell:${getValue()}`,
        aggregatedCell: ({ getValue }) => `aggregate:${getValue()}`,
      }),
    ])

    class BoundCellTable extends LitElement {
      private appTable = hook.useAppTable(this, {
        data: [{ id: '1', name: 'Ada' }],
        columns: appColumns,
        getRowId: (row) => row.id,
      })
      private mode: 'aggregate' | 'placeholder' | 'normal' = 'aggregate'
      private cell?: Cell<typeof stockFeatures, Data, string>

      createRenderRoot() {
        return this
      }

      setMode(mode: 'aggregate' | 'placeholder' | 'normal') {
        this.mode = mode
        this.requestUpdate()
      }

      protected render() {
        const table = this.appTable.table()
        if (!this.cell) {
          this.cell = table.getRow('1').getAllCells()[0] as Cell<
            typeof stockFeatures,
            Data,
            string
          >
          vi.spyOn(this.cell, 'getIsAggregated').mockImplementation(
            () => this.mode === 'aggregate',
          )
          vi.spyOn(this.cell, 'getIsPlaceholder').mockImplementation(
            () => this.mode === 'placeholder',
          )
        }

        return table.AppCell(
          this.cell,
          (cell) => html`
            <output aria-label="Bound cell mode"> ${cell.FlexRender()} </output>
          `,
        )
      }
    }

    const element = mount<BoundCellTable>(BoundCellTable)
    await element.updateComplete

    expect(outputText('Bound cell mode')).toBe('aggregate:Ada')

    element.setMode('placeholder')
    await element.updateComplete

    expect(outputText('Bound cell mode')).toBe('')

    element.setMode('normal')
    await element.updateComplete

    expect(outputText('Bound cell mode')).toBe('cell:Ada')
  })
})
