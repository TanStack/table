import { describe, expect, test, vi } from 'vitest'
import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  flush,
  getOwner,
} from 'solid-js'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import { solidReactivity } from '../../src/reactivity'
import type { ColumnDef, RowSelectionState } from '@tanstack/table-core'

describe('solidReactivity', () => {
  test('readonly atoms update when wrapped external TanStack Store atoms update', () => {
    const external = createAtom(1)
    const { dispose, doubled } = createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
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
      return { dispose, doubled }
    })

    expect(doubled.get()).toBe(2)

    external.set(2)
    flush()

    expect(doubled.get()).toBe(4)
    dispose()
  })

  test('readonly atoms preserve TanStack Store dependency tracking through .get()', () => {
    const { base, dispose, store } = createRoot((dispose) => {
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
      return { base, dispose, store }
    })

    expect(store.get()).toEqual({ slice: 1 })

    base.set(2)
    flush()

    expect(store.get()).toEqual({ slice: 2 })
    dispose()
  })

  test('writable atoms hand updaters the pending value before a flush', () => {
    const { atom, dispose } = createRoot((dispose) => {
      const reactivity = solidReactivity(getOwner()!)
      return { atom: reactivity.createWritableAtom(1), dispose }
    })

    atom.set((value) => value + 1)
    atom.set((value) => value + 1)
    // Reads show the committed value until Solid flushes.
    expect(atom.get()).toBe(1)
    flush()
    expect(atom.get()).toBe(3)
    dispose()
  })

  test('writable atoms store function values as values', () => {
    const { atom, dispose } = createRoot((dispose) => {
      const reactivity = solidReactivity(getOwner()!)
      const fn = () => 'first'
      return { atom: reactivity.createWritableAtom<() => string>(fn), dispose }
    })

    expect(atom.get()()).toBe('first')
    const next = () => 'second'
    atom.set(() => next)
    flush()
    expect(atom.get()).toBe(next)
    dispose()
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

  test('effects respond to the table inputs they read', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const [data, setData] = createSignal<Array<Data>>(initialData)
      const table = createTestTable(data)
      const captors = {
        isSelectedRow1: vi.fn<(value: boolean) => void>(),
        titleValue: vi.fn<(value: unknown) => void>(),
        columnIsVisible: vi.fn<(value: boolean) => void>(),
      }
      const row = createMemo(() => table.getRowModel().rows[0]!)
      const titleCell = createMemo(() => row().getAllCells()[1]!)

      createEffect(
        () => row().getIsSelected(),
        (selected) => captors.isSelectedRow1(selected),
      )
      createEffect(
        () => titleCell().getValue(),
        (title) => captors.titleValue(title),
      )
      createEffect(
        () => table.getColumn('id')!.getIsVisible(),
        (visible) => captors.columnIsVisible(visible),
      )

      return { captors, setData, table }
    })
    const { captors, setData, table } = value
    flush()

    try {
      expect(captors.isSelectedRow1.mock.calls).toEqual([[false]])
      expect(captors.titleValue.mock.calls).toEqual([['Title']])
      expect(captors.columnIsVisible.mock.calls).toEqual([[true]])

      Object.values(captors).forEach((captor) => captor.mockClear())
      table.getRow('1').toggleSelected(true)
      flush()

      expect(captors.isSelectedRow1.mock.calls).toEqual([[true]])
      expect(captors.titleValue).not.toHaveBeenCalled()
      expect(captors.columnIsVisible).not.toHaveBeenCalled()

      Object.values(captors).forEach((captor) => captor.mockClear())
      setData([{ id: '1', title: 'Title 3' }])
      flush()

      expect(captors.titleValue.mock.lastCall).toEqual(['Title 3'])

      Object.values(captors).forEach((captor) => captor.mockClear())
      table.getColumn('id')!.toggleVisibility(false)
      flush()

      expect(captors.columnIsVisible.mock.calls).toEqual([[false]])
      expect(captors.isSelectedRow1).not.toHaveBeenCalled()
      expect(captors.titleValue).not.toHaveBeenCalled()
    } finally {
      dispose()
    }
  })

  test('table store can be subscribed from another reactive effect', () => {
    const { dispose, value } = createEffectTestRoot(() => {
      const table = createTestTable()
      const tableStateCaptor =
        vi.fn<(state: ReturnType<typeof table.store.get>) => void>()

      createEffect(
        () => {},
        () => {
          const subscription = table.store.subscribe(() => {
            tableStateCaptor(table.store.get())
          })
          return () => subscription.unsubscribe()
        },
      )

      return { table, tableStateCaptor }
    })
    const { table, tableStateCaptor } = value
    flush()

    try {
      table.toggleAllRowsSelected(true)
      flush()

      // Like a TanStack Store subscription, it reports changes only.
      expect(tableStateCaptor).toHaveBeenCalledTimes(1)
      expect(
        tableStateCaptor.mock.calls.map(([state]) => state.rowSelection),
      ).toEqual([{ 1: true }])
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

      createEffect(
        () => table.atoms.rowSelection.get(),
        (state) => tableStateCaptor(state),
      )

      return { setRowSelection, tableStateCaptor }
    })
    const { setRowSelection, tableStateCaptor } = value
    flush()

    try {
      setRowSelection({ 1: true })
      flush()
      setRowSelection({ 1: true, 2: true })
      flush()
      setRowSelection({ 2: true })
      flush()

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
      const storePageSizeCaptor = vi.fn<(value: number) => void>()

      createEffect(
        () => table.atoms.pagination.get().pageSize,
        (pageSize) => pageSizeCaptor(pageSize),
      )
      createEffect(
        () => table.store.get().pagination.pageSize,
        (pageSize) => storePageSizeCaptor(pageSize),
      )

      return { pageSizeCaptor, storePageSizeCaptor, table }
    })
    const { pageSizeCaptor, storePageSizeCaptor, table } = value
    flush()

    try {
      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(storePageSizeCaptor.mock.calls).toEqual([[20]])

      table.setPageSize(50)
      flush()
      table.setPageSize(100)
      flush()

      expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
      expect(storePageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
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

      createEffect(
        () => table.atoms.pagination.get().pageSize,
        (pageSize) => pageSizeCaptor(pageSize),
      )
      createEffect(
        () => JSON.stringify(table.store.get(), null, 2),
        (json) => stateJsonCaptor(json),
      )

      return { pageSizeCaptor, stateJsonCaptor, table }
    })
    const { pageSizeCaptor, stateJsonCaptor, table } = value
    flush()

    try {
      table.toggleAllRowsSelected(true)
      flush()

      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(stateJsonCaptor).toHaveBeenCalledTimes(2)
      expect(
        JSON.parse(stateJsonCaptor.mock.calls.at(-1)![0]).rowSelection,
      ).toEqual({ 1: true })
    } finally {
      dispose()
    }
  })
})
