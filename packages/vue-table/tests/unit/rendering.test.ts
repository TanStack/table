// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import { stockFeatures } from '@tanstack/table-core'
import { FlexRender } from '../../src/FlexRender'
import { createTableHook } from '../../src/createTableHook'
import { useTable } from '../../src/useTable'

afterEach(cleanup)

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent
}

describe('FlexRender', () => {
  test('supports cell modes, header/footer shorthand, and legacy props', () => {
    const normalContext = { value: 'Normal' }
    const aggregatedContext = { value: 'Aggregated' }
    const headerContext = { label: 'Title' }
    const footerContext = { label: 'Total' }
    const normalCellRenderer = vi.fn(
      (context: typeof normalContext) => `cell:${context.value}`,
    )
    const aggregatedCellRenderer = vi.fn(
      (context: typeof aggregatedContext) => `sum:${context.value}`,
    )
    const headerRenderer = vi.fn(
      (context: typeof headerContext) => `header:${context.label}`,
    )
    const footerRenderer = vi.fn(
      (context: typeof footerContext) => `footer:${context.label}`,
    )
    const placeholderRenderer = vi.fn(() => 'should-not-render')

    const Root = defineComponent({
      setup() {
        return () =>
          h('output', { 'aria-label': 'Flex render output' }, [
            h(FlexRender, {
              cell: {
                column: {
                  columnDef: {
                    cell: normalCellRenderer,
                  },
                },
                getContext: () => normalContext,
              },
            }),
            h(FlexRender, {
              cell: {
                column: {
                  columnDef: {
                    cell: normalCellRenderer,
                    aggregatedCell: aggregatedCellRenderer,
                  },
                },
                getContext: () => aggregatedContext,
                getIsAggregated: () => true,
              },
            }),
            h(FlexRender, {
              cell: {
                column: {
                  columnDef: {
                    cell: placeholderRenderer,
                  },
                },
                getContext: () => normalContext,
                getIsPlaceholder: () => true,
              },
            }),
            h(FlexRender, {
              header: {
                column: {
                  columnDef: {
                    header: headerRenderer,
                  },
                },
                getContext: () => headerContext,
              },
            }),
            h(FlexRender, {
              footer: {
                column: {
                  columnDef: {
                    footer: footerRenderer,
                  },
                },
                getContext: () => footerContext,
              },
            }),
            h(FlexRender, {
              render: (context: { value: string }) => `legacy:${context.value}`,
              props: { value: 'Legacy' },
            }),
          ])
      },
    })

    render(Root)

    expect(outputText('Flex render output')).toBe(
      'cell:Normalsum:Aggregatedheader:Titlefooter:Totallegacy:Legacy',
    )
    expect(normalCellRenderer).toHaveBeenCalledOnce()
    expect(normalCellRenderer).toHaveBeenCalledWith(normalContext)
    expect(aggregatedCellRenderer).toHaveBeenCalledWith(aggregatedContext)
    expect(placeholderRenderer).not.toHaveBeenCalled()
    expect(headerRenderer).toHaveBeenCalledWith(headerContext)
    expect(footerRenderer).toHaveBeenCalledWith(footerContext)
  })

  test('updates when the shorthand cell prop is replaced', async () => {
    const cell = ref({
      column: {
        columnDef: {
          cell: (context: { value: string }) => `cell:${context.value}`,
        },
      },
      getContext: () => ({ value: 'Ada' }),
    })
    const Root = defineComponent({
      setup() {
        return () =>
          h(
            'output',
            { 'aria-label': 'Reactive flex render' },
            h(FlexRender, { cell: cell.value }),
          )
      },
    })

    render(Root)

    expect(outputText('Reactive flex render')).toBe('cell:Ada')

    cell.value = {
      column: cell.value.column,
      getContext: () => ({ value: 'Grace' }),
    }
    await nextTick()

    expect(outputText('Reactive flex render')).toBe('cell:Grace')
  })
})

describe('table.Subscribe', () => {
  test('updates mounted content for the atom read by its child', async () => {
    const Root = defineComponent({
      setup() {
        const table = useTable<typeof stockFeatures, { id: string }>({
          data: [{ id: '1' }],
          columns: [{ id: 'id', accessorKey: 'id' }],
          features: stockFeatures,
          getRowId: (row) => row.id,
        })

        return () =>
          h('main', [
            table.Subscribe({
              children: (atoms) =>
                h(
                  'output',
                  { 'aria-label': 'Subscribed row selection' },
                  String(Boolean(atoms.rowSelection.get()['1'])),
                ),
            }),
            h(
              'button',
              {
                onClick: () => table.getRow('1').toggleSelected(true),
              },
              'Select subscribed row',
            ),
          ])
      },
    })

    render(Root)

    expect(outputText('Subscribed row selection')).toBe('false')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select subscribed row' }),
    )

    expect(outputText('Subscribed row selection')).toBe('true')
  })
})

describe('createTableHook', () => {
  type Data = { id: string; title: string }

  const TableBadge = defineComponent({
    setup() {
      return () => h('span', 'table-component')
    },
  })
  const CellBadge = defineComponent({
    setup() {
      return () => h('span', 'cell-component')
    },
  })
  const HeaderBadge = defineComponent({
    setup() {
      return () => h('span', 'header-component')
    },
  })

  const hook = createTableHook({
    features: stockFeatures,
    getRowId: (row: Data) => `row-${row.id}`,
    tableComponents: { TableBadge },
    cellComponents: { CellBadge },
    headerComponents: { HeaderBadge },
  })
  const columnHelper = hook.createAppColumnHelper<Data>()
  const columns = columnHelper.columns([
    columnHelper.accessor('title', {
      header: (context) => `header:${context.column.id}`,
      cell: (context) => `cell:${context.getValue()}`,
      aggregatedCell: (context) => `aggregate:${context.getValue()}`,
      footer: (context) => `footer:${context.column.id}`,
    }),
  ])

  test('binds defaults, wrapper components, and all three contexts', () => {
    const tableContextCaptor = vi.fn<(value: unknown) => void>()
    const cellContextCaptor = vi.fn<(value: unknown) => void>()
    const headerContextCaptor = vi.fn<(value: unknown) => void>()
    const footerContextCaptor = vi.fn<(value: unknown) => void>()
    let createdTable: unknown
    let originalCell: unknown
    let originalHeader: unknown
    let originalFooter: unknown
    let firstRowId: string | undefined

    const TableConsumer = defineComponent({
      setup() {
        const table = hook.useTableContext<Data>()
        tableContextCaptor(table)

        return () => h(table.TableBadge)
      },
    })
    const CellConsumer = defineComponent({
      setup() {
        const cell = hook.useCellContext<string>()
        cellContextCaptor(cell)

        return () => [h(cell.CellBadge), h(cell.FlexRender)]
      },
    })
    const HeaderConsumer = defineComponent({
      setup() {
        const header = hook.useHeaderContext<string>()
        headerContextCaptor(header)

        return () => [h(header.HeaderBadge), h(header.FlexRender)]
      },
    })
    const FooterConsumer = defineComponent({
      setup() {
        const header = hook.useHeaderContext<string>()
        footerContextCaptor(header)

        return () => h(header.FlexRender)
      },
    })
    const Root = defineComponent({
      setup() {
        const table = hook.useAppTable({
          data: [{ id: '1', title: 'First' }],
          columns,
        })
        const row = table.getRowModel().rows[0]!
        const cell = row.getAllCells()[0]!
        const header = table.getHeaderGroups()[0]!.headers[0]!
        const footer = table.getFooterGroups()[0]!.headers[0]!

        createdTable = table
        originalCell = cell
        originalHeader = header
        originalFooter = footer
        firstRowId = row.id

        return () =>
          h(
            'main',
            h(table.AppTable, null, {
              default: () => [
                h(TableConsumer),
                h(
                  table.AppCell,
                  { cell },
                  {
                    default: () => h(CellConsumer),
                  },
                ),
                h(
                  table.AppHeader,
                  { header },
                  {
                    default: () => h(HeaderConsumer),
                  },
                ),
                h(
                  table.AppFooter,
                  { header: footer },
                  {
                    default: () => h(FooterConsumer),
                  },
                ),
              ],
            }),
          )
      },
    })

    render(Root)

    expect(hook.appFeatures).toBe(stockFeatures)
    expect(firstRowId).toBe('row-1')
    expect(tableContextCaptor).toHaveBeenCalledWith(createdTable)
    expect(cellContextCaptor).toHaveBeenCalledWith(originalCell)
    expect(headerContextCaptor).toHaveBeenCalledWith(originalHeader)
    expect(footerContextCaptor).toHaveBeenCalledWith(originalFooter)
    expect(screen.getByText('table-component').textContent).toBe(
      'table-component',
    )
    expect(screen.getByText('cell-component').textContent).toBe(
      'cell-component',
    )
    expect(screen.getByText('header-component').textContent).toBe(
      'header-component',
    )
    expect(screen.getByRole('main').textContent).toBe(
      'table-componentcell-componentcell:First' +
        'header-componentheader:titlefooter:title',
    )
  })

  test('bound cell render helpers preserve aggregate and placeholder modes', async () => {
    const mode = ref<'aggregate' | 'placeholder'>('aggregate')
    const CellConsumer = defineComponent({
      setup() {
        const cell = hook.useCellContext<string>()
        return () =>
          h('output', { 'aria-label': 'Bound cell mode' }, h(cell.FlexRender))
      },
    })
    const Root = defineComponent({
      setup() {
        const table = hook.useAppTable({
          data: [{ id: '1', title: 'First' }],
          columns,
        })
        const cell = table.getRowModel().rows[0]!.getAllCells()[0]!

        vi.spyOn(cell, 'getIsAggregated').mockImplementation(
          () => mode.value === 'aggregate',
        )
        vi.spyOn(cell, 'getIsPlaceholder').mockImplementation(
          () => mode.value === 'placeholder',
        )

        return () =>
          h(
            table.AppCell,
            { cell },
            {
              default: () => h(CellConsumer),
            },
          )
      },
    })

    render(Root)

    expect(outputText('Bound cell mode')).toBe('aggregate:First')

    mode.value = 'placeholder'
    await nextTick()

    expect(outputText('Bound cell mode')).toBe('')
  })

  test.each([
    ['useTableContext', () => hook.useTableContext()],
    ['useCellContext', () => hook.useCellContext()],
    ['useHeaderContext', () => hook.useHeaderContext()],
  ])('%s throws a focused error outside its provider', (name, readContext) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Consumer = defineComponent({
      setup() {
        readContext()
        return () => null
      },
    })

    try {
      expect(() => render(Consumer)).toThrowError(
        new RegExp(`\\\`${name}\\\` must be used within`),
      )
    } finally {
      warning.mockRestore()
    }
  })
})
