import { describe, expect, test, vi } from 'vitest'
import { createEffect, createRoot, createSignal } from 'solid-js'
import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import type { ColumnDef, PaginationState } from '@tanstack/table-core'

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

  test('row models react to controlled pagination changes', () => {
    let dispose!: () => void
    let setPageSize!: (size: number) => void
    const rowIdsCaptor = vi.fn<(ids: Array<string>) => void>()

    createRoot((rootDispose) => {
      dispose = rootDispose
      const [pagination, setPaginationSignal] = createSignal<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
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

      setPageSize = table.setPageSize
      createEffect(() =>
        rowIdsCaptor(table.getRowModel().rows.map((row) => row.id)),
      )
    })

    try {
      expect(rowIdsCaptor.mock.calls).toEqual([[['0', '1', '2', '3', '4']]])

      setPageSize(3)

      expect(rowIdsCaptor.mock.calls).toEqual([
        [['0', '1', '2', '3', '4']],
        [['0', '1', '2']],
      ])
    } finally {
      dispose()
    }
  })
})
