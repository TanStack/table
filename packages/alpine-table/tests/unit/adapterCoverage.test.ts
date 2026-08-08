// @vitest-environment jsdom
import Alpine from 'alpinejs'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/dom'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import { createTableHook } from '../../src/createTableHook'
import type { Cell, ColumnDef, RowSelectionState } from '@tanstack/table-core'

type Data = { id: string; title: string }

const idColumn: ColumnDef<typeof stockFeatures, Data> = {
  id: 'id',
  accessorKey: 'id',
  header: 'Identifier',
  footer: 'Identifier footer',
  cell: (context) => `<strong>${context.getValue()}</strong>`,
  aggregatedCell: (context) => `<em>Aggregate ${context.getValue()}</em>`,
}

const titleColumn: ColumnDef<typeof stockFeatures, Data> = {
  id: 'title',
  accessorKey: 'title',
}

const mountedRoots: Array<{
  root: HTMLElement
  removeScope: () => void
}> = []

function flushEffects() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}

function mountAlpine(
  markup: string,
  scope: Record<string, unknown>,
): HTMLElement {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  const root = template.content.firstElementChild as HTMLElement
  document.body.append(root)

  const removeScope = Alpine.addScopeToNode(root, scope)
  mountedRoots.push({ root, removeScope })
  Alpine.initTree(root)

  return root
}

function destroyRoot(root: HTMLElement, remove = true) {
  const mounted = mountedRoots.find((entry) => entry.root === root)
  if (!mounted) return

  Alpine.destroyTree(root)
  mounted.removeScope()
  if (remove) root.remove()
  mountedRoots.splice(mountedRoots.indexOf(mounted), 1)
}

afterEach(() => {
  for (const { root } of [...mountedRoots]) {
    destroyRoot(root)
  }
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('Alpine adapter reactivity', () => {
  test('releases and reacquires controlled ownership one state slice at a time', async () => {
    const options = Alpine.reactive<{
      state: { rowSelection?: RowSelectionState }
    }>({
      state: { rowSelection: { 1: true } },
    })
    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [idColumn, titleColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
      get state() {
        return options.state
      },
    })

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    table.toggleAllRowsSelected(false)
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    options.state = {}
    await flushEffects()
    expect(table.atoms.rowSelection.get()).toEqual({})

    table.toggleAllRowsSelected(true)
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    options.state = { rowSelection: {} }
    await flushEffects()
    expect(table.atoms.rowSelection.get()).toEqual({})
  })

  test('gives an external atom precedence and routes table writes back to it', async () => {
    const options = Alpine.reactive<{ rowSelection: RowSelectionState }>({
      rowSelection: { 2: true },
    })
    const externalSelection = createAtom<RowSelectionState>({ 1: true })
    const table = createTable({
      data: [
        { id: '1', title: 'First' },
        { id: '2', title: 'Second' },
      ],
      columns: [idColumn, titleColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
      state: {
        get rowSelection() {
          return options.rowSelection
        },
      },
      atoms: {
        rowSelection: externalSelection,
      },
    })

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    options.rowSelection = { 1: true, 2: true }
    await flushEffects()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    externalSelection.set({ 2: true })
    expect(table.getRow('1').getIsSelected()).toBe(false)
    expect(table.getRow('2').getIsSelected()).toBe(true)

    table.toggleAllRowsSelected(true)
    expect(externalSelection.get()).toEqual({ 1: true, 2: true })
  })

  test('never exposes partial snapshots during rapid option changes', async () => {
    const options = Alpine.reactive<{
      columns: Array<ColumnDef<typeof stockFeatures, Data>>
      data: Array<Data>
      enableRowSelection: boolean
    }>({
      columns: [idColumn],
      data: [{ id: '1', title: 'Initial' }],
      enableRowSelection: true,
    })
    const table = createTable({
      features: stockFeatures,
      get columns() {
        return options.columns
      },
      get data() {
        return options.data
      },
      get enableRowSelection() {
        return options.enableRowSelection
      },
      getRowId: (row) => row.id,
    })
    const snapshotCaptor =
      vi.fn<
        (snapshot: {
          canSelect: boolean
          columnIds: Array<string>
          values: Array<unknown>
        }) => void
      >()

    Alpine.effect(() => {
      const row = table.getRowModel().rows[0]!
      snapshotCaptor({
        canSelect: row.getCanSelect(),
        columnIds: table.getAllLeafColumns().map((column) => column.id),
        values: row.getAllCells().map((cell) => cell.getValue()),
      })
    })

    options.data = [{ id: '2', title: 'Intermediate' }]
    options.columns = [idColumn, titleColumn]
    options.enableRowSelection = false
    options.data = [{ id: '3', title: 'Final' }]
    options.columns = [titleColumn]
    await flushEffects()

    expect(snapshotCaptor.mock.calls[0]).toEqual([
      {
        canSelect: true,
        columnIds: ['id'],
        values: ['1'],
      },
    ])
    expect(snapshotCaptor.mock.calls.slice(1)).not.toHaveLength(0)
    expect(
      snapshotCaptor.mock.calls.slice(1).every(([snapshot]) => {
        return (
          snapshot.canSelect === false &&
          snapshot.columnIds.length === 1 &&
          snapshot.columnIds[0] === 'title' &&
          snapshot.values.length === 1 &&
          snapshot.values[0] === 'Final'
        )
      }),
    ).toBe(true)
  })

  test('uses the latest reactive option callback', async () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()
    const options = Alpine.reactive({
      onRowSelectionChange: firstHandler,
    })
    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [idColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
      get onRowSelectionChange() {
        return options.onRowSelectionChange
      },
    })

    table.toggleAllRowsSelected(true)
    expect(firstHandler).toHaveBeenCalledTimes(1)

    options.onRowSelectionChange = secondHandler
    await flushEffects()
    // The mock handlers never write state back, so selection is still empty;
    // select-all stays a real change while deselect-all would be a no-op.
    table.toggleAllRowsSelected(true)

    expect(firstHandler).toHaveBeenCalledTimes(1)
    expect(secondHandler).toHaveBeenCalledTimes(1)
  })

  test('stops Alpine DOM bindings when their tree is destroyed', async () => {
    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [idColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const root = mountAlpine(
      `<div role="status" aria-label="selection" x-text="table.getRow('1').getIsSelected() ? 'selected' : 'clear'"></div>`,
      { table },
    )

    expect(screen.getByRole('status', { name: 'selection' }).textContent).toBe(
      'clear',
    )

    destroyRoot(root, false)
    table.setRowSelection({ 1: true })
    await flushEffects()

    expect(screen.getByRole('status', { name: 'selection' }).textContent).toBe(
      'clear',
    )
  })
})

describe('Alpine rendering and application hook', () => {
  function createCell() {
    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [idColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    return table.getRowModel().rows[0]!.getAllCells()[0]!
  }

  function setCellMode(
    cell: Cell<typeof stockFeatures, Data, unknown>,
    mode: 'normal' | 'aggregate' | 'placeholder',
  ) {
    vi.spyOn(cell, 'getIsAggregated').mockReturnValue(mode === 'aggregate')
    vi.spyOn(cell, 'getIsPlaceholder').mockReturnValue(mode === 'placeholder')
  }

  test('renders normal, aggregate, placeholder, header, and footer content', () => {
    const normalCell = createCell()
    const aggregateCell = createCell()
    const placeholderCell = createCell()
    setCellMode(normalCell, 'normal')
    setCellMode(aggregateCell, 'aggregate')
    setCellMode(placeholderCell, 'placeholder')

    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [idColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!

    mountAlpine(
      `<section aria-label="render results">
        <div role="status" aria-label="normal" x-html="table.FlexRender({ cell: normalCell })"></div>
        <div role="status" aria-label="aggregate" x-html="table.FlexRender({ cell: aggregateCell })"></div>
        <div role="status" aria-label="placeholder" x-html="table.FlexRender({ cell: placeholderCell })"></div>
        <div role="status" aria-label="header" x-html="table.FlexRender({ header })"></div>
        <div role="status" aria-label="footer" x-html="table.FlexRender({ footer: header })"></div>
      </section>`,
      {
        aggregateCell,
        header,
        normalCell,
        placeholderCell,
        table,
      },
    )

    expect(screen.getByRole('status', { name: 'normal' }).textContent).toBe('1')
    expect(screen.getByRole('status', { name: 'aggregate' }).textContent).toBe(
      'Aggregate 1',
    )
    expect(
      screen.getByRole('status', { name: 'placeholder' }).textContent,
    ).toBe('')
    expect(screen.getByRole('status', { name: 'header' }).textContent).toBe(
      'Identifier',
    )
    expect(screen.getByRole('status', { name: 'footer' }).textContent).toBe(
      'Identifier footer',
    )
  })

  test('updates rendered cell content when reactive data replaces its cell', async () => {
    const options = Alpine.reactive({
      data: [{ id: '1', title: 'First' }],
    })
    const table = createTable({
      get data() {
        return options.data
      },
      columns: [titleColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
    })

    mountAlpine(
      '<div role="status" aria-label="cell value" x-text="table.FlexRender({ cell: table.getRowModel().rows[0].getAllCells()[0] })"></div>',
      { table },
    )
    expect(screen.getByRole('status', { name: 'cell value' }).textContent).toBe(
      'First',
    )

    options.data = [{ id: '2', title: 'Second' }]
    await flushEffects()

    expect(screen.getByRole('status', { name: 'cell value' }).textContent).toBe(
      'Second',
    )
  })

  test('updates mounted renderer content for the atom read by the cell', async () => {
    const selectionColumn: ColumnDef<typeof stockFeatures, Data> = {
      id: 'selection',
      cell: (context) =>
        context.table.atoms.rowSelection.get()['1'] ? 'selected' : 'clear',
    }
    const table = createTable({
      data: [{ id: '1', title: 'First' }],
      columns: [selectionColumn],
      features: stockFeatures,
      getRowId: (row) => row.id,
    })

    mountAlpine(
      '<div role="status" aria-label="selection renderer" x-text="table.FlexRender({ cell: table.getRowModel().rows[0].getAllCells()[0] })"></div>',
      { table },
    )
    expect(
      screen.getByRole('status', { name: 'selection renderer' }).textContent,
    ).toBe('clear')

    table.setRowSelection({ 1: true })
    await flushEffects()

    expect(
      screen.getByRole('status', { name: 'selection renderer' }).textContent,
    ).toBe('selected')
  })

  test('binds hook features, defaults, column helpers, and render helpers', () => {
    const hook = createTableHook({
      features: stockFeatures,
      enableRowSelection: false,
    })
    const columnHelper = hook.createAppColumnHelper<Data>()
    const appColumns = columnHelper.columns([
      columnHelper.accessor('title', {}),
    ])
    const table = hook.createAppTable<Data>({
      data: [{ id: '1', title: 'First' }],
      columns: appColumns,
      enableRowSelection: true,
      getRowId: (row) => row.id,
    })

    expect(hook.appFeatures).toBe(stockFeatures)
    expect(table.getRow('1').getCanSelect()).toBe(true)
    expect(table.getRow('1').getValue('title')).toBe('First')
    expect(table.FlexRender).toBeDefined()
    expect(table.flexRender).toBeDefined()
  })
})
