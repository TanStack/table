import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { computed, effectScope, nextTick, ref, watchEffect } from 'vue'
import { createAtom } from '@tanstack/store'
import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
import { useTable } from '../../src/useTable'
import type {
  ColumnDef,
  PaginationState,
  RowModel,
  RowSelectionState,
} from '@tanstack/table-core'
import type { EffectScope, Ref } from 'vue'

describe('useTable', () => {
  type Data = { id: string; title: string }

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

  let scope: EffectScope

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  function runInScope<T>(fn: () => T): T {
    return scope.run(fn)!
  }

  function createTestTable(
    data: Ref<ReadonlyArray<Data>> = ref([{ id: '1', title: 'Title' }]),
  ) {
    return useTable<typeof stockFeatures, Data>({
      data,
      features: { ...stockFeatures },
      columns,
      getRowId: (row) => row.id,
    })
  }

  test('accepts reactive data and updates the row model', async () => {
    const data = ref<ReadonlyArray<Data>>([{ id: '1', title: 'Title' }])
    const table = runInScope(() => createTestTable(data))

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1'])

    data.value = [
      { id: '1', title: 'Updated title' },
      { id: '2', title: 'Second title' },
    ]
    await nextTick()

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1', '2'])
    expect(table.getRow('1').getValue('title')).toBe('Updated title')
  })

  describe('table object', () => {
    test('supports the "in" operator', () => {
      const table = runInScope(() => createTestTable())

      expect('_features' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
    })

    test('exposes table APIs through enumerable keys', () => {
      const table = runInScope(() => createTestTable())

      expect(Object.keys(table)).toEqual(
        expect.arrayContaining(['atoms', 'getRowModel', 'options', 'store']),
      )
    })

    test('row models react to controlled pagination changes', async () => {
      const features = {
        ...stockFeatures,
        paginatedRowModel: createPaginatedRowModel(),
      }
      const paginatedColumns: Array<ColumnDef<typeof features, Data>> = [
        { id: 'id', accessorKey: 'id' },
        { id: 'title', accessorKey: 'title' },
      ]
      const coreRowModelCaptor =
        vi.fn<(model: RowModel<typeof features, Data>) => void>()
      const rowModelCaptor =
        vi.fn<(model: RowModel<typeof features, Data>) => void>()
      const pagination = ref<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
      const state = computed(() => ({ pagination: pagination.value }))
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        title: `Title ${i}`,
      }))

      runInScope(() => {
        const table = useTable<typeof features, Data>({
          data,
          columns: paginatedColumns,
          features,
          getRowId: (row) => row.id,
          state,
          onPaginationChange: (updater) => {
            pagination.value =
              typeof updater === 'function'
                ? updater(pagination.value)
                : updater
          },
        })

        watchEffect(() => coreRowModelCaptor(table.getCoreRowModel()))
        watchEffect(() => rowModelCaptor(table.getRowModel()))
      })

      pagination.value = { pageIndex: 0, pageSize: 3 }
      await nextTick()

      expect(coreRowModelCaptor).toHaveBeenCalledTimes(2)
      expect(coreRowModelCaptor.mock.calls[0]![0].rows).toHaveLength(10)
      expect(coreRowModelCaptor.mock.calls[1]![0].rows).toHaveLength(10)
      expect(rowModelCaptor).toHaveBeenCalledTimes(2)
      expect(rowModelCaptor.mock.calls[0]![0].rows).toHaveLength(5)
      expect(rowModelCaptor.mock.calls[1]![0].rows).toHaveLength(3)
    })
  })

  describe('reactivity integration', () => {
    test('table methods in effects react only to their dependencies', async () => {
      const data = ref<ReadonlyArray<Data>>([{ id: '1', title: 'Title' }])
      const isSelectedRow1Captor = vi.fn<(value: boolean) => void>()
      const cellGetValueCaptor = vi.fn<(value: unknown) => void>()
      const cellGetValueMemoizedCaptor = vi.fn<(value: unknown) => void>()
      const columnIsVisibleCaptor = vi.fn<(value: boolean) => void>()

      const { cell, table } = runInScope(() => {
        const table = createTestTable(data)
        const cell = computed(
          () => table.getRowModel().rows[0]!.getAllCells()[0]!,
        )
        const cellGetValue = computed(() => cell.value.getValue())

        watchEffect(
          () => isSelectedRow1Captor(cell.value.row.getIsSelected()),
          { flush: 'sync' },
        )
        watchEffect(() => cellGetValueCaptor(cell.value.getValue()), {
          flush: 'sync',
        })
        watchEffect(() => cellGetValueMemoizedCaptor(cellGetValue.value), {
          flush: 'sync',
        })
        watchEffect(
          () => columnIsVisibleCaptor(cell.value.column.getIsVisible()),
          { flush: 'sync' },
        )

        return { cell, table }
      })

      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(1)
      expect(cellGetValueMemoizedCaptor).toHaveBeenCalledTimes(1)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(1)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(1)

      cell.value.row.toggleSelected(true)
      await nextTick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(2)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(1)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(1)

      data.value = [{ id: '1', title: 'Title 3' }]
      await nextTick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(3)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(2)

      table.getColumn('id')!.toggleVisibility(false)
      await nextTick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(3)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(3)

      expect(isSelectedRow1Captor.mock.calls).toEqual([[false], [true], [true]])
      expect(cellGetValueCaptor.mock.calls).toEqual([['1'], ['1']])
      expect(cellGetValueMemoizedCaptor.mock.calls).toEqual([['1']])
      expect(columnIsVisibleCaptor.mock.calls).toEqual([
        [true],
        [true],
        [false],
      ])
    })

    test('table methods and atoms react to external atom changes', async () => {
      const rowSelectionAtom = createAtom<RowSelectionState>({})
      const isSelectedRow1Captor = vi.fn<(value: boolean) => void>()
      const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

      runInScope(() => {
        const table = useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
          features: { ...stockFeatures },
          columns,
          getRowId: (row) => row.id,
          atoms: {
            rowSelection: rowSelectionAtom,
          },
        })

        watchEffect(
          () => isSelectedRow1Captor(table.getRow('1').getIsSelected()),
          { flush: 'sync' },
        )
        watchEffect(() => tableStateCaptor(table.atoms.rowSelection.get()), {
          flush: 'sync',
        })
      })

      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(1)
      expect(tableStateCaptor).toHaveBeenCalledTimes(1)

      rowSelectionAtom.set({ 1: true })
      await nextTick()

      expect(isSelectedRow1Captor.mock.calls).toEqual([[false], [true]])
      expect(tableStateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    })

    test('table store can be subscribed from a Vue effect', async () => {
      const tableStateCaptor = vi.fn()
      const table = runInScope(() => {
        const table = createTestTable()

        watchEffect((onCleanup) => {
          const subscription = table.store.subscribe(() => {
            tableStateCaptor(table.store.get())
          })

          onCleanup(() => subscription.unsubscribe())
        })

        return table
      })

      table.toggleAllRowsSelected(true)
      await nextTick()

      expect(tableStateCaptor).toHaveBeenCalledTimes(1)
      expect(tableStateCaptor.mock.calls[0]![0].rowSelection).toEqual({
        1: true,
      })
    })

    test('table state reacts to every external ref state update', async () => {
      const rowSelection = ref<RowSelectionState>({})
      const state = computed(() => ({ rowSelection: rowSelection.value }))
      const tableStateCaptor = vi.fn<(value: RowSelectionState) => void>()

      runInScope(() => {
        const table = useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
          features: { ...stockFeatures },
          columns,
          getRowId: (row) => row.id,
          state,
        })

        watchEffect(() => tableStateCaptor(table.atoms.rowSelection.get()), {
          flush: 'sync',
        })
      })

      rowSelection.value = { 1: true }
      await nextTick()
      rowSelection.value = { 1: true, 2: true }
      await nextTick()
      rowSelection.value = { 2: true }
      await nextTick()

      expect(tableStateCaptor.mock.calls).toEqual([
        [{}],
        [{ 1: true }],
        [{ 1: true, 2: true }],
        [{ 2: true }],
      ])
    })

    test('table state exposes initial state on the first read', () => {
      const table = runInScope(() =>
        useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
          features: { ...stockFeatures },
          columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        }),
      )

      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(JSON.stringify(table.store.get(), null, 2)).toContain(
        '"pageSize": 20',
      )
    })

    test('table state reacts to internal table state updates', async () => {
      const pageSizeCaptor = vi.fn<(value: number) => void>()
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      const table = runInScope(() => {
        const table = useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
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

        watchEffect(
          () => pageSizeCaptor(table.atoms.pagination.get().pageSize),
          { flush: 'sync' },
        )
        watchEffect(
          () => stateJsonCaptor(JSON.stringify(table.store.get(), null, 2)),
          { flush: 'sync' },
        )

        return table
      })

      table.setPageSize(50)
      await nextTick()
      table.setPageSize(100)
      await nextTick()

      expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain(
        '"pageSize": 100',
      )
    })

    test('table state property reads track only the accessed slice', async () => {
      const pageSizeCaptor = vi.fn<(value: number) => void>()
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      const table = runInScope(() => {
        const table = useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
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

        watchEffect(
          () => pageSizeCaptor(table.atoms.pagination.get().pageSize),
          { flush: 'sync' },
        )
        watchEffect(
          () => stateJsonCaptor(JSON.stringify(table.store.get(), null, 2)),
          { flush: 'sync' },
        )

        return table
      })

      table.toggleAllRowsSelected(true)
      await nextTick()

      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(stateJsonCaptor).toHaveBeenCalledTimes(2)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"rowSelection"')
    })

    test('stock features expose full initial state and update JSON state', async () => {
      const stateJsonCaptor = vi.fn<(value: string) => void>()

      const table = runInScope(() => {
        const table = useTable<typeof stockFeatures, Data>({
          data: [{ id: '1', title: 'Title' }],
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

        watchEffect(
          () => stateJsonCaptor(JSON.stringify(table.store.get(), null, 2)),
          { flush: 'sync' },
        )

        return table
      })

      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(table.atoms.columnOrder.get()).toEqual(['id', 'title'])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 20')

      table.setPageSize(50)
      await nextTick()

      expect(table.atoms.pagination.get().pageSize).toBe(50)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 50')
    })
  })
})
