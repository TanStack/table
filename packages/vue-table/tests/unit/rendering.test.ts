import { describe, expect, test, vi } from 'vitest'
import { createRenderer, defineComponent, h, isVNode } from 'vue'
import { stockFeatures } from '@tanstack/table-core'
import { FlexRender, flexRender } from '../../src/FlexRender'
import { createTableHook } from '../../src/createTableHook'
import type { Component } from 'vue'

interface HostNode {
  type: string
  text: string
  children: Array<HostNode>
  parent: HostNode | null
  props: Record<string, unknown>
}

function createHostNode(type: string, text = ''): HostNode {
  return {
    type,
    text,
    children: [],
    parent: null,
    props: {},
  }
}

function insertHostNode(
  child: HostNode,
  parent: HostNode,
  anchor: HostNode | null = null,
) {
  child.parent = parent
  const anchorIndex = anchor ? parent.children.indexOf(anchor) : -1

  if (anchorIndex === -1) {
    parent.children.push(child)
  } else {
    parent.children.splice(anchorIndex, 0, child)
  }
}

const memoryRenderer = createRenderer<HostNode, HostNode>({
  patchProp(element, key, _previousValue, nextValue) {
    element.props[key] = nextValue
  },
  insert: insertHostNode,
  remove(child) {
    if (!child.parent) {
      return
    }

    const index = child.parent.children.indexOf(child)
    if (index !== -1) {
      child.parent.children.splice(index, 1)
    }
    child.parent = null
  },
  createElement(type) {
    return createHostNode(type)
  },
  createText(text) {
    return createHostNode('#text', text)
  },
  createComment(text) {
    return createHostNode('#comment', text)
  },
  setText(node, text) {
    node.text = text
  },
  setElementText(node, text) {
    node.text = text
    node.children = []
  },
  parentNode(node) {
    return node.parent
  },
  nextSibling(node) {
    if (!node.parent) {
      return null
    }

    const index = node.parent.children.indexOf(node)
    return node.parent.children[index + 1] ?? null
  },
  querySelector() {
    return null
  },
  setScopeId() {},
  cloneNode(node) {
    return {
      ...node,
      children: [...node.children],
      parent: null,
      props: { ...node.props },
    }
  },
  insertStaticContent(content, parent, anchor) {
    const node = createHostNode('#static', content)
    insertHostNode(node, parent, anchor)
    return [node, node]
  },
})

function mount(component: Component) {
  const root = createHostNode('#root')
  const app = memoryRenderer.createApp(component)
  app.mount(root)

  return {
    root,
    unmount: () => app.unmount(),
  }
}

function readText(node: HostNode): string {
  return node.text + node.children.map(readText).join('')
}

describe('FlexRender', () => {
  test('renders primitives, callbacks, VNodes, and component objects', () => {
    const props = { value: 'Ada' }
    const renderCallback = vi.fn(
      (context: typeof props) => `Hello ${context.value}`,
    )

    expect(flexRender('Plain text', props)).toBe('Plain text')
    expect(flexRender(renderCallback, props)).toBe('Hello Ada')
    expect(renderCallback).toHaveBeenCalledWith(props)

    const existingVNode = h('strong', 'Existing')
    expect(flexRender(() => existingVNode, props)).toBe(existingVNode)

    const NameComponent = defineComponent({
      props: {
        value: {
          type: String,
          required: true,
        },
      },
      setup(componentProps) {
        return () => h('span', `Name: ${componentProps.value}`)
      },
    })
    const componentVNode = flexRender(NameComponent, props)

    expect(isVNode(componentVNode)).toBe(true)
    expect(componentVNode.type).toBe(NameComponent)
    expect(componentVNode.props).toMatchObject(props)
  })

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
          h('section', [
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

    const mounted = mount(Root)

    expect(readText(mounted.root)).toBe(
      'cell:Normalsum:Aggregatedheader:Titlefooter:Totallegacy:Legacy',
    )
    expect(normalCellRenderer).toHaveBeenCalledOnce()
    expect(normalCellRenderer).toHaveBeenCalledWith(normalContext)
    expect(aggregatedCellRenderer).toHaveBeenCalledWith(aggregatedContext)
    expect(placeholderRenderer).not.toHaveBeenCalled()
    expect(headerRenderer).toHaveBeenCalledWith(headerContext)
    expect(footerRenderer).toHaveBeenCalledWith(footerContext)

    mounted.unmount()
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

        return () =>
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
          })
      },
    })

    const mounted = mount(Root)

    expect(hook.appFeatures).toBe(stockFeatures)
    expect(tableContextCaptor).toHaveBeenCalledWith(createdTable)
    expect(cellContextCaptor).toHaveBeenCalledWith(originalCell)
    expect(headerContextCaptor).toHaveBeenCalledWith(originalHeader)
    expect(footerContextCaptor).toHaveBeenCalledWith(originalFooter)
    expect(readText(mounted.root)).toBe(
      'table-componentcell-componentcell:First' +
        'header-componentheader:titlefooter:title',
    )

    mounted.unmount()
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

    expect(() => mount(Consumer)).toThrowError(
      new RegExp(`\\\`${name}\\\` must be used within`),
    )
    warning.mockRestore()
  })
})
