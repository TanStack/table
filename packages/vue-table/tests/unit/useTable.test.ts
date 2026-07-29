import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { computed, effectScope, nextTick, ref, watchEffect } from 'vue'
import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
import { useTable } from '../../src/useTable'
import type {
  ColumnDef,
  PaginationState,
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
    const source = ref<ReadonlyArray<Data>>([{ id: '1', title: 'Title' }])
    const data = computed(() => source.value)
    const table = runInScope(() => createTestTable(data))

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1'])

    source.value = [
      { id: '1', title: 'Updated title' },
      { id: '2', title: 'Second title' },
    ]
    await nextTick()

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1', '2'])
    expect(table.getRow('1').getValue('title')).toBe('Updated title')
  })

  describe('table object', () => {
    test('row models react to controlled pagination changes', async () => {
      const features = {
        ...stockFeatures,
        paginatedRowModel: createPaginatedRowModel(),
      }
      const paginatedColumns: Array<ColumnDef<typeof features, Data>> = [
        { id: 'id', accessorKey: 'id' },
        { id: 'title', accessorKey: 'title' },
      ]
      const pagination = ref<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
      const state = computed(() => ({ pagination: pagination.value }))
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        title: `Title ${i}`,
      }))

      const table = runInScope(() => {
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

        return table
      })

      expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
        '3',
        '4',
      ])

      pagination.value = { pageIndex: 0, pageSize: 3 }
      await nextTick()

      expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
      ])
    })
  })

  describe('reactivity integration', () => {
    test('effects respond to the table inputs they read', async () => {
      const data = ref<ReadonlyArray<Data>>([{ id: '1', title: 'Title' }])
      const captors = {
        isSelectedRow1: vi.fn<(value: boolean) => void>(),
        titleValue: vi.fn<(value: unknown) => void>(),
        columnIsVisible: vi.fn<(value: boolean) => void>(),
      }

      const table = runInScope(() => {
        const table = createTestTable(data)
        const row = computed(() => table.getRowModel().rows[0]!)
        const titleCell = computed(() => row.value.getAllCells()[1]!)

        watchEffect(() => captors.isSelectedRow1(row.value.getIsSelected()), {
          flush: 'sync',
        })
        watchEffect(() => captors.titleValue(titleCell.value.getValue()), {
          flush: 'sync',
        })
        watchEffect(
          () => captors.columnIsVisible(table.getColumn('id')!.getIsVisible()),
          { flush: 'sync' },
        )

        return table
      })

      expect(captors.isSelectedRow1.mock.calls).toEqual([[false]])
      expect(captors.titleValue.mock.calls).toEqual([['Title']])
      expect(captors.columnIsVisible.mock.calls).toEqual([[true]])

      Object.values(captors).forEach((captor) => captor.mockClear())
      table.getRow('1').toggleSelected(true)
      await nextTick()

      expect(captors.isSelectedRow1.mock.calls).toEqual([[true]])
      expect(captors.titleValue).not.toHaveBeenCalled()
      expect(captors.columnIsVisible).not.toHaveBeenCalled()

      Object.values(captors).forEach((captor) => captor.mockClear())
      data.value = [{ id: '1', title: 'Title 3' }]
      await nextTick()

      expect(captors.titleValue.mock.lastCall).toEqual(['Title 3'])

      Object.values(captors).forEach((captor) => captor.mockClear())
      table.getColumn('id')!.toggleVisibility(false)
      await nextTick()

      expect(captors.columnIsVisible.mock.calls).toEqual([[false]])
      expect(captors.isSelectedRow1).not.toHaveBeenCalled()
      expect(captors.titleValue).not.toHaveBeenCalled()
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

    test('tracks controlled slices exposed by getters on a plain state object', async () => {
      const rowSelection = ref<RowSelectionState>({})
      const state = {
        get rowSelection() {
          return rowSelection.value
        },
      }
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

      expect(tableStateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    })

    test('table state reacts to internal table state updates', async () => {
      const pageSizeCaptor = vi.fn<(value: number) => void>()
      const storePageSizeCaptor = vi.fn<(value: number) => void>()

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
          () => storePageSizeCaptor(table.store.get().pagination.pageSize),
          { flush: 'sync' },
        )

        return table
      })

      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(storePageSizeCaptor.mock.calls).toEqual([[20]])

      table.setPageSize(50)
      await nextTick()
      table.setPageSize(100)
      await nextTick()

      expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
      expect(storePageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
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
      expect(
        JSON.parse(stateJsonCaptor.mock.calls.at(-1)![0]).rowSelection,
      ).toEqual({ 1: true })
    })
  })
})
