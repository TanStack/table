import { describe, expect, test, vi } from 'vitest'
import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  createStore,
  flush,
} from 'solid-js'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import type { ColumnDef, RowSelectionState } from '@tanstack/table-core'

describe('Solid adapter lifecycle and option ownership', () => {
  type Data = { id: string; title: string }
  const idColumn: ColumnDef<typeof stockFeatures, Data> = {
    id: 'id',
    accessorKey: 'id',
  }
  const titleColumn: ColumnDef<typeof stockFeatures, Data> = {
    id: 'title',
    accessorKey: 'title',
  }

  function createEffectTestRoot<T>(setup: () => T) {
    let dispose!: () => void
    const value = createRoot((rootDispose) => {
      dispose = rootDispose
      return setup()
    })
    return { dispose, value }
  }

  test('disposing the owner unsubscribes external atoms and stops reactions', () => {
    const sourceAtom = createAtom<RowSelectionState>({})
    const subscribeSpy = vi.spyOn(sourceAtom, 'subscribe')

    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTable({
        data: [{ id: '1', title: 'Title' }],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
        atoms: {
          rowSelection: sourceAtom,
        },
      })
      const stateCaptor = vi.fn<(state: RowSelectionState) => void>()

      createEffect(
        () => table.atoms.rowSelection.get(),
        (state) => stateCaptor(state),
      )

      return { stateCaptor, table }
    })
    const { stateCaptor, table } = value
    flush()

    expect(subscribeSpy).toHaveBeenCalledTimes(1)

    const subscription = subscribeSpy.mock.results[0]!.value
    const unsubscribeSpy = vi.spyOn(subscription, 'unsubscribe')

    sourceAtom.set({ 1: true })
    flush()
    expect(stateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])

    dispose()

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)

    sourceAtom.set({ 2: true })
    flush()

    expect(sourceAtom.get()).toEqual({ 2: true })
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })
    expect(stateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])

    table.setRowSelection({ 3: true })
    flush()

    expect(sourceAtom.get()).toEqual({ 2: true })
  })

  test('controlled state can release and reacquire ownership without losing the latest value', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [controlledState, setControlledState] = createSignal<{
        rowSelection?: RowSelectionState
      }>({ rowSelection: { 1: true } })
      const table = createTable({
        data: [
          { id: '1', title: 'One' },
          { id: '2', title: 'Two' },
        ],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
        get state() {
          return controlledState()
        },
      })
      const stateCaptor = vi.fn<(state: RowSelectionState) => void>()

      createEffect(
        () => table.atoms.rowSelection.get(),
        (state) => stateCaptor(state),
      )

      return { setControlledState, stateCaptor, table }
    })
    const { setControlledState, stateCaptor, table } = value
    flush()

    try {
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      setControlledState({})
      flush()
      expect(table.options.state).toEqual({})
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      table.setRowSelection({ 2: true })
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      setControlledState({ rowSelection: { 1: true, 2: true } })
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({
        1: true,
        2: true,
      })

      table.setRowSelection({})
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({
        1: true,
        2: true,
      })

      setControlledState({})
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({})
      expect(stateCaptor.mock.calls).toEqual([
        [{ 1: true }],
        [{ 2: true }],
        [{ 1: true, 2: true }],
        [{}],
      ])
    } finally {
      dispose()
    }
  })

  test('an external atom takes precedence over controlled state and receives table writes', () => {
    const externalAtom = createAtom<RowSelectionState>({ 2: true })
    const { dispose, value } = createEffectTestRoot(() => {
      const [controlledSelection, setControlledSelection] =
        createSignal<RowSelectionState>({ 1: true })
      const table = createTable({
        data: [
          { id: '1', title: 'One' },
          { id: '2', title: 'Two' },
        ],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
        state: {
          get rowSelection() {
            return controlledSelection()
          },
        },
        atoms: {
          rowSelection: externalAtom,
        },
      })
      const stateCaptor = vi.fn<(state: RowSelectionState) => void>()
      const isSelectedCaptor = vi.fn<(selected: boolean) => void>()
      const isSelected = createMemo(() => table.getRow('1').getIsSelected())

      createEffect(
        () => table.atoms.rowSelection.get(),
        (state) => stateCaptor(state),
      )
      createEffect(isSelected, (selected) => isSelectedCaptor(selected))

      return { isSelectedCaptor, setControlledSelection, stateCaptor, table }
    })
    const { isSelectedCaptor, setControlledSelection, stateCaptor, table } =
      value

    try {
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      setControlledSelection({ 1: true, 2: true })
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      externalAtom.set({ 1: true })
      flush()
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      table.setRowSelection({ 2: true })
      flush()
      expect(externalAtom.get()).toEqual({ 2: true })
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })
      expect(stateCaptor.mock.calls).toEqual([
        [{ 2: true }],
        [{ 1: true }],
        [{ 2: true }],
      ])
      expect(isSelectedCaptor.mock.calls).toEqual([[false], [true], [false]])
    } finally {
      dispose()
    }
  })

  test('rapid batched option updates publish only the final data, columns, and option values', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [data, setData] = createSignal<Array<Data>>([
        { id: '1', title: 'Initial' },
      ])
      const [columns, setColumns] = createSignal<
        Array<ColumnDef<typeof stockFeatures, Data>>
      >([idColumn])
      const [enableRowSelection, setEnableRowSelection] = createSignal(true)
      const table = createTable({
        features: stockFeatures,
        get data() {
          return data()
        },
        get columns() {
          return columns()
        },
        get enableRowSelection() {
          return enableRowSelection()
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

      createEffect(
        () => {
          const row = table.getRowModel().rows[0]!
          return {
            canSelect: row.getCanSelect(),
            columnIds: table.getAllLeafColumns().map((column) => column.id),
            values: row.getAllCells().map((cell) => cell.getValue()),
          }
        },
        (snapshot) => snapshotCaptor(snapshot),
      )

      return {
        setColumns,
        setData,
        setEnableRowSelection,
        snapshotCaptor,
      }
    })
    const { setColumns, setData, setEnableRowSelection, snapshotCaptor } = value
    flush()

    try {
      // Solid 2 batches these writes until the flush.
      setData([{ id: '2', title: 'Intermediate' }])
      setColumns([idColumn, titleColumn])
      setEnableRowSelection(false)
      setData([{ id: '3', title: 'Final' }])
      setColumns([titleColumn])
      flush()

      expect(snapshotCaptor.mock.calls).toEqual([
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
    } finally {
      dispose()
    }
  })

  test('table APIs use the latest signal-backed option callback', () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()
    const [onRowSelectionChange, setOnRowSelectionChange] =
      createSignal(firstHandler)
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        data: [{ id: '1', title: 'Title' }],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
        get onRowSelectionChange() {
          return onRowSelectionChange()
        },
      })
      return { dispose, table }
    })

    table.toggleAllRowsSelected(true)
    flush()
    expect(firstHandler).toHaveBeenCalledTimes(1)
    expect(secondHandler).not.toHaveBeenCalled()

    setOnRowSelectionChange(() => secondHandler)
    flush()
    table.toggleAllRowsSelected(false)
    flush()

    expect(firstHandler).toHaveBeenCalledTimes(1)
    expect(secondHandler).toHaveBeenCalledTimes(1)
    dispose()
  })

  test('back-to-back setOptions calls in one tick both apply', () => {
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        data: [{ id: '1', title: 'Title' }],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      return { dispose, table }
    })

    table.setOptions((prev) => ({ ...prev, enableRowSelection: false }))
    table.setOptions((prev) => ({ ...prev, enableSorting: false }))
    flush()

    expect(table.options.enableRowSelection).toBe(false)
    expect(table.options.enableSorting).toBe(false)
    dispose()
  })

  test('two toggles of the same row in one tick compose', () => {
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        data: [
          { id: '1', title: 'One' },
          { id: '2', title: 'Two' },
        ],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      return { dispose, table }
    })

    table.getRow('1').toggleSelected(true)
    table.getRow('2').toggleSelected(true)
    // Reads show the committed state until Solid flushes.
    expect(table.atoms.rowSelection.get()).toEqual({})
    flush()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true, 2: true })
    dispose()
  })

  test('two nextPage calls in one tick move forward two pages', () => {
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        data: Array.from({ length: 30 }, (_, i) => ({
          id: String(i),
          title: `Row ${i}`,
        })),
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
      })
      return { dispose, table }
    })

    table.nextPage()
    table.nextPage()
    expect(table.atoms.pagination.get().pageIndex).toBe(0)
    flush()
    expect(table.atoms.pagination.get().pageIndex).toBe(2)
    dispose()
  })

  test('a store array passed as data updates the table when changed in place', () => {
    const [rows, setRows] = createStore<Array<Data>>([
      { id: '1', title: 'One' },
    ])
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        get data() {
          return rows
        },
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      return { dispose, table }
    })

    flush()
    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1'])
    setRows((draft) => {
      draft.push({ id: '2', title: 'Two' })
    })
    flush()
    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1', '2'])
    dispose()
  })

  test('table state can be written from inside an effect', () => {
    const [data, setData] = createSignal<Array<Data>>([
      { id: '1', title: 'One' },
    ])
    const { dispose, table } = createRoot((dispose) => {
      const table = createTable({
        get data() {
          return data()
        },
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      // Select every new row as it arrives.
      createEffect(
        () => data().map((row) => row.id),
        (ids) => {
          table.setRowSelection(
            Object.fromEntries(ids.map((id) => [id, true as const])),
          )
        },
      )
      return { dispose, table }
    })

    flush()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })
    setData([
      { id: '1', title: 'One' },
      { id: '2', title: 'Two' },
    ])
    flush()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true, 2: true })
    expect(table.getSelectedRowModel().rows.map((row) => row.id)).toEqual([
      '1',
      '2',
    ])
    dispose()
  })
})
