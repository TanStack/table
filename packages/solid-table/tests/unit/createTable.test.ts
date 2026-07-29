import { describe, expect, test, vi } from 'vitest'
import { createEffect, createRoot, createSignal } from 'solid-js'
import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import type { ColumnDef, PaginationState, RowModel } from '@tanstack/table-core'

describe('createTable', () => {
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
  const paginatedFeatures = {
    ...stockFeatures,
    paginatedRowModel: createPaginatedRowModel(),
  }
  const paginatedColumns = columns as Array<
    ColumnDef<typeof paginatedFeatures, Data>
  >

  test('supports signal-backed required options', () => {
    createRoot((dispose) => {
      const [data, setData] = createSignal<Array<Data>>([
        { id: '1', title: 'Title 1' },
      ])
      const table = createTable({
        features: stockFeatures,
        columns,
        get data() {
          return data()
        },
        getRowId: (row) => row.id,
      })

      expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1'])

      setData([
        { id: '1', title: 'Title 1' },
        { id: '2', title: 'Title 2' },
      ])

      expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1', '2'])
      dispose()
    })
  })

  test('supports property introspection and enumeration', () => {
    createRoot((dispose) => {
      const table = createTable({
        features: stockFeatures,
        columns,
        data: [{ id: '1', title: 'Title' }],
        getRowId: (row) => row.id,
      })

      expect('_features' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
      expect(Object.keys(table)).toEqual(
        expect.arrayContaining(['options', 'getRowModel']),
      )
      dispose()
    })
  })

  test('row models react to controlled pagination changes', () => {
    let dispose!: () => void
    let updatePagination!: (value: PaginationState) => void
    const coreRowModelCaptor =
      vi.fn<(model: RowModel<typeof paginatedFeatures, Data>) => void>()
    const rowModelCaptor =
      vi.fn<(model: RowModel<typeof paginatedFeatures, Data>) => void>()

    createRoot((rootDispose) => {
      dispose = rootDispose
      const [pagination, setPaginationSignal] = createSignal<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
      updatePagination = (value) => {
        setPaginationSignal(value)
      }
      const data = Array.from({ length: 10 }, (_, index) => ({
        id: String(index),
        title: `Title ${index}`,
      }))
      const table = createTable({
        data,
        columns: paginatedColumns,
        features: paginatedFeatures,
        getRowId: (row) => row.id,
        state: {
          get pagination() {
            return pagination()
          },
        },
        onPaginationChange: setPaginationSignal,
      })

      createEffect(() => coreRowModelCaptor(table.getCoreRowModel()))
      createEffect(() => rowModelCaptor(table.getRowModel()))
    })

    try {
      expect(coreRowModelCaptor).toHaveBeenCalledTimes(1)
      expect(rowModelCaptor).toHaveBeenCalledTimes(1)
      expect(coreRowModelCaptor.mock.calls[0]![0].rows).toHaveLength(10)
      expect(rowModelCaptor.mock.calls[0]![0].rows).toHaveLength(5)

      updatePagination({ pageIndex: 0, pageSize: 3 })

      expect(coreRowModelCaptor).toHaveBeenCalledTimes(2)
      expect(coreRowModelCaptor.mock.calls[1]![0].rows).toHaveLength(10)
      expect(rowModelCaptor).toHaveBeenCalledTimes(2)
      expect(rowModelCaptor.mock.calls[1]![0].rows).toHaveLength(3)
    } finally {
      dispose()
    }
  })
})
