import { describe, expect, test, vi } from 'vitest'
import {
  batch,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from 'solid-js'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import type { Observer } from '@tanstack/store'
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
    const originalSubscribe = sourceAtom.subscribe.bind(sourceAtom)
    const unsubscribeCaptor = vi.fn()
    sourceAtom.subscribe = ((observer: Observer<RowSelectionState>) => {
      const subscription = originalSubscribe(observer)
      return {
        unsubscribe: () => {
          unsubscribeCaptor()
          subscription.unsubscribe()
        },
      }
    }) as typeof sourceAtom.subscribe

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

      createEffect(() => stateCaptor(table.atoms.rowSelection.get()))

      return { stateCaptor, table }
    })
    const { stateCaptor, table } = value

    sourceAtom.set({ 1: true })
    expect(stateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])

    dispose()

    expect(unsubscribeCaptor).toHaveBeenCalledTimes(1)

    sourceAtom.set({ 2: true })

    expect(sourceAtom.get()).toEqual({ 2: true })
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })
    expect(stateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])

    table.setRowSelection({ 3: true })

    expect(sourceAtom.get()).toEqual({ 2: true })
  })

  test('controlled state can release and reacquire ownership without losing the latest value', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [controlledState, setControlledState] = createSignal<
        { rowSelection?: RowSelectionState } | undefined
      >({ rowSelection: { 1: true } })
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

      createEffect(() => stateCaptor(table.atoms.rowSelection.get()))

      return { setControlledState, stateCaptor, table }
    })
    const { setControlledState, stateCaptor, table } = value

    try {
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      setControlledState({})
      expect(table.options.state).toEqual({})
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      table.setRowSelection({ 2: true })
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      setControlledState({ rowSelection: { 1: true, 2: true } })
      expect(table.atoms.rowSelection.get()).toEqual({
        1: true,
        2: true,
      })

      table.setRowSelection({})
      expect(table.atoms.rowSelection.get()).toEqual({
        1: true,
        2: true,
      })

      setControlledState(undefined)
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

      createEffect(() => stateCaptor(table.atoms.rowSelection.get()))
      createEffect(() => isSelectedCaptor(isSelected()))

      return { isSelectedCaptor, setControlledSelection, stateCaptor, table }
    })
    const { isSelectedCaptor, setControlledSelection, stateCaptor, table } =
      value

    try {
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      setControlledSelection({ 1: true, 2: true })
      expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

      externalAtom.set({ 1: true })
      expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

      table.setRowSelection({ 2: true })
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

      createEffect(() => {
        const row = table.getRowModel().rows[0]!
        snapshotCaptor({
          canSelect: row.getCanSelect(),
          columnIds: table.getAllLeafColumns().map((column) => column.id),
          values: row.getAllCells().map((cell) => cell.getValue()),
        })
      })

      return {
        setColumns,
        setData,
        setEnableRowSelection,
        snapshotCaptor,
      }
    })
    const { setColumns, setData, setEnableRowSelection, snapshotCaptor } = value

    try {
      batch(() => {
        setData([{ id: '2', title: 'Intermediate' }])
        setColumns([idColumn, titleColumn])
        setEnableRowSelection(false)
        setData([{ id: '3', title: 'Final' }])
        setColumns([titleColumn])
      })

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
    createRoot((dispose) => {
      const firstHandler = vi.fn()
      const secondHandler = vi.fn()
      const [onRowSelectionChange, setOnRowSelectionChange] =
        createSignal(firstHandler)
      const table = createTable({
        data: [{ id: '1', title: 'Title' }],
        columns: [idColumn, titleColumn],
        features: stockFeatures,
        getRowId: (row) => row.id,
        get onRowSelectionChange() {
          return onRowSelectionChange()
        },
      })

      table.toggleAllRowsSelected(true)
      expect(firstHandler).toHaveBeenCalledTimes(1)
      expect(secondHandler).not.toHaveBeenCalled()

      setOnRowSelectionChange(() => secondHandler)
      table.toggleAllRowsSelected(false)

      expect(firstHandler).toHaveBeenCalledTimes(1)
      expect(secondHandler).toHaveBeenCalledTimes(1)
      dispose()
    })
  })
})
