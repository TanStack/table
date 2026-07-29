import { describe, expect, test, vi } from 'vitest'
import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  getOwner,
  onCleanup,
} from 'solid-js'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import { solidReactivity } from '../../src/reactivity'
import type { ColumnDef, RowSelectionState } from '@tanstack/table-core'

describe('solidReactivity', () => {
  test('readonly atoms update when wrapped external TanStack Store atoms update', () => {
    createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
      const external = createAtom(1)
      const wrapped = reactivity.createWritableAtom(external.get(), {
        debugName: 'wrapped',
      })
      reactivity.addSubscription(
        external.subscribe((value) => {
          wrapped.set(value)
        }),
      )
      const doubled = reactivity.createReadonlyAtom(() => wrapped.get() * 2, {
        debugName: 'doubled',
      })

      expect(doubled.get()).toBe(2)

      external.set(2)

      expect(doubled.get()).toBe(4)
      dispose()
    })
  })

  test('readonly atoms preserve TanStack Store dependency tracking through .get()', () => {
    createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
      const base = reactivity.createWritableAtom(1)
      const slice = reactivity.createReadonlyAtom(() => base.get(), {
        debugName: 'slice',
      })
      const store = reactivity.createReadonlyAtom(
        () => ({
          slice: slice.get(),
        }),
        { debugName: 'store' },
      )

      expect(store.get()).toEqual({ slice: 1 })

      base.set(2)

      expect(store.get()).toEqual({ slice: 2 })
      dispose()
    })
  })
})

describe('table.Subscribe', () => {
  type Data = { id: string }
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'id',
      accessorKey: 'id',
    },
  ]

  test('passes table atoms to children', () => {
    createRoot((dispose) => {
      const table = createTable({
        data: [{ id: '1' }],
        columns,
        features: stockFeatures,
      })
      let received: unknown

      table.Subscribe({
        children: (atoms) => {
          received = atoms
          return null
        },
      })

      expect(received).toBe(table.atoms)
      dispose()
    })
  })
})

describe('Solid table reactivity integration', () => {
  type Data = { id: string; title: string }
  const initialData: Array<Data> = [{ id: '1', title: 'Title' }]
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'id',
      header: 'Id',
      accessorKey: 'id',
      cell: (context) => context.getValue(),
    },
    {
      id: 'title',
      header: 'Title',
      accessorKey: 'title',
      cell: (context) => context.getValue(),
    },
  ]

  function createTestTable(data: () => Array<Data> = () => initialData) {
    return createTable({
      features: { ...stockFeatures },
      columns,
      get data() {
        return data()
      },
      getRowId: (row) => row.id,
    })
  }

  function createEffectTestRoot<T>(setup: () => T) {
    let dispose!: () => void
    const value = createRoot((rootDispose) => {
      dispose = rootDispose
      return setup()
    })
    return { dispose, value }
  }

  test('methods within effects react only to relevant option and state changes', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [data, setData] = createSignal<Array<Data>>(initialData)
      const table = createTestTable(data)
      const captors = {
        isSelectedRow1: vi.fn<(value: boolean) => void>(),
        cellGetValue: vi.fn<(value: unknown) => void>(),
        cellGetValueMemoized: vi.fn<(value: unknown) => void>(),
        columnIsVisible: vi.fn<(value: boolean) => void>(),
      }
      const cell = createMemo(
        () => table.getRowModel().rows[0]!.getAllCells()[0]!,
      )
      const cellGetValue = createMemo(() => cell().getValue())

      createEffect(() => captors.isSelectedRow1(cell().row.getIsSelected()))
      createEffect(() => captors.cellGetValue(cell().getValue()))
      createEffect(() => captors.cellGetValueMemoized(cellGetValue()))
      createEffect(() => captors.columnIsVisible(cell().column.getIsVisible()))

      return { captors, cell, setData }
    })
    const { captors, cell, setData } = value

    try {
      expect(captors.isSelectedRow1).toHaveBeenCalledTimes(1)
      expect(captors.cellGetValueMemoized).toHaveBeenCalledTimes(1)
      expect(captors.cellGetValue).toHaveBeenCalledTimes(1)
      expect(captors.columnIsVisible).toHaveBeenCalledTimes(1)

      cell().row.toggleSelected(true)

      expect(captors.isSelectedRow1).toHaveBeenCalledTimes(2)
      expect(captors.cellGetValue).toHaveBeenCalledTimes(1)
      expect(captors.columnIsVisible).toHaveBeenCalledTimes(1)

      setData([{ id: '1', title: 'Title 3' }])

      expect(captors.isSelectedRow1).toHaveBeenCalledTimes(3)
      expect(captors.cellGetValue).toHaveBeenCalledTimes(2)
      expect(captors.columnIsVisible).toHaveBeenCalledTimes(2)

      cell().column.toggleVisibility(false)

      expect(captors.isSelectedRow1).toHaveBeenCalledTimes(3)
      expect(captors.cellGetValue).toHaveBeenCalledTimes(2)
      expect(captors.columnIsVisible).toHaveBeenCalledTimes(3)
      expect(captors.isSelectedRow1.mock.calls).toEqual([
        [false],
        [true],
        [true],
      ])
      expect(captors.cellGetValue.mock.calls).toEqual([['1'], ['1']])
      expect(captors.cellGetValueMemoized.mock.calls).toEqual([['1']])
      expect(captors.columnIsVisible.mock.calls).toEqual([
        [true],
        [true],
        [false],
      ])
    } finally {
      dispose()
    }
  })

  test('methods within effects react to external atom changes', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const rowSelectionAtom = createAtom<RowSelectionState>({})
      const table = createTable({
        data: initialData,
        features: { ...stockFeatures },
        columns,
        getRowId: (row) => row.id,
        atoms: {
          rowSelection: rowSelectionAtom,
        },
      })
      const isSelectedRow1Captor = vi.fn<(value: boolean) => void>()
      const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

      createEffect(() => {
        isSelectedRow1Captor(table.getRow('1').getIsSelected())
      })
      createEffect(() => {
        tableStateCaptor(table.atoms.rowSelection.get())
      })

      return { isSelectedRow1Captor, rowSelectionAtom, tableStateCaptor }
    })
    const { isSelectedRow1Captor, rowSelectionAtom, tableStateCaptor } = value

    try {
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(1)
      expect(tableStateCaptor).toHaveBeenCalledTimes(1)

      rowSelectionAtom.set({ 1: true })

      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(2)
      expect(tableStateCaptor).toHaveBeenCalledTimes(2)
      expect(isSelectedRow1Captor.mock.calls).toEqual([[false], [true]])
      expect(tableStateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    } finally {
      dispose()
    }
  })

  test('table store can be subscribed from another reactive effect', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTestTable()
      const tableStateCaptor =
        vi.fn<(state: ReturnType<typeof table.store.get>) => void>()

      createEffect(() => {
        const subscription = table.store.subscribe(() => {
          tableStateCaptor(table.store.get())
        })
        onCleanup(() => subscription.unsubscribe())
      })

      return { table, tableStateCaptor }
    })
    const { table, tableStateCaptor } = value

    try {
      table.toggleAllRowsSelected(true)

      expect(tableStateCaptor).toHaveBeenCalledTimes(2)
      expect(
        tableStateCaptor.mock.calls.map(([state]) => state.rowSelection),
      ).toEqual([{}, { 1: true }])
    } finally {
      dispose()
    }
  })

  test('table state reacts to every external signal state update', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [rowSelection, setRowSelection] = createSignal<RowSelectionState>(
        {},
      )
      const table = createTable({
        data: initialData,
        features: { ...stockFeatures },
        columns,
        getRowId: (row) => row.id,
        state: {
          get rowSelection() {
            return rowSelection()
          },
        },
      })
      const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

      createEffect(() => {
        tableStateCaptor(table.atoms.rowSelection.get())
      })

      return { setRowSelection, tableStateCaptor }
    })
    const { setRowSelection, tableStateCaptor } = value

    try {
      setRowSelection({ 1: true })
      setRowSelection({ 1: true, 2: true })
      setRowSelection({ 2: true })

      expect(tableStateCaptor.mock.calls).toEqual([
        [{}],
        [{ 1: true }],
        [{ 1: true, 2: true }],
        [{ 2: true }],
      ])
    } finally {
      dispose()
    }
  })

  test('table state exposes initial state on its first read', () => {
    createRoot((dispose) => {
      const table = createTable({
        data: initialData,
        features: { ...stockFeatures },
        columns,
        getRowId: (row) => row.id,
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        },
      })

      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(JSON.stringify(table.store.get(), null, 2)).toContain(
        '"pageSize": 20',
      )
      dispose()
    })
  })

  test('table state reacts to internal table state updates', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTable({
        data: initialData,
        features: { ...stockFeatures },
        columns,
        getRowId: (row) => row.id,
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        },
      })
      const pageSizeCaptor = vi.fn<(value: number) => void>()
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      createEffect(() => {
        pageSizeCaptor(table.atoms.pagination.get().pageSize)
      })
      createEffect(() => {
        stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
      })

      return { pageSizeCaptor, stateJsonCaptor, table }
    })
    const { pageSizeCaptor, stateJsonCaptor, table } = value

    try {
      table.setPageSize(50)
      table.setPageSize(100)

      expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain(
        '"pageSize": 100',
      )
    } finally {
      dispose()
    }
  })

  test('table state property reads only track the accessed slice', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTable({
        data: initialData,
        features: { ...stockFeatures },
        columns,
        getRowId: (row) => row.id,
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        },
      })
      const pageSizeCaptor = vi.fn<(value: number) => void>()
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      createEffect(() => {
        pageSizeCaptor(table.atoms.pagination.get().pageSize)
      })
      createEffect(() => {
        stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
      })

      return { pageSizeCaptor, stateJsonCaptor, table }
    })
    const { pageSizeCaptor, stateJsonCaptor, table } = value

    try {
      table.toggleAllRowsSelected(true)

      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(stateJsonCaptor).toHaveBeenCalledTimes(2)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"rowSelection"')
    } finally {
      dispose()
    }
  })

  test('stock feature table exposes full initial state and updates json state', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTable({
        data: initialData,
        features: stockFeatures,
        columns,
        getRowId: (row) => row.id,
        initialState: {
          columnOrder: columns.map((column) => column.id!),
          columnPinning: { start: ['id'], end: [] },
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        },
      })
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      createEffect(() => {
        stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
      })

      return { stateJsonCaptor, table }
    })
    const { stateJsonCaptor, table } = value

    try {
      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(table.atoms.columnOrder.get()).toEqual(['id', 'title'])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 20')

      table.setPageSize(50)

      expect(table.atoms.pagination.get().pageSize).toBe(50)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 50')
    } finally {
      dispose()
    }
  })
})
