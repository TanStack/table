import { describe, expect, test, vi } from 'vitest'
import { computed, effect, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { injectTable, stockFeatures } from '../src'
import type { ColumnDef } from '../src'
import type { WritableSignal } from '@angular/core'

describe('angularReactivityFeature', () => {
  type Data = { id: string; title: string }
  const data = signal<Array<Data>>([{ id: '1', title: 'Title' }])
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

  function createTestTable(_data: WritableSignal<Array<Data>> = data) {
    return TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data: _data(),
        _features: { ...stockFeatures },
        columns: columns,
        getRowId: (row) => row.id,
        reactivity: {
          column: true,
          cell: true,
          row: true,
          header: true,
        },
      })),
    )
  }

  const table = createTestTable()

  describe('Integration', () => {
    test('methods within effect will be re-trigger when options/state changes', () => {
      const data = signal<Array<Data>>([{ id: '1', title: 'Title' }])
      const table = createTestTable(data)
      const isSelectedRow1Captor = vi.fn<(val: boolean) => void>()
      const cellGetValueCaptor = vi.fn<(val: unknown) => void>()
      const cellGetValueMemoizedCaptor = vi.fn<(val: unknown) => void>()
      const columnIsVisibleCaptor = vi.fn<(val: boolean) => void>()

      // This will test a case where you put in the effect a single cell property method
      // which will trigger effect reschedule only when the value changes, acting like
      // its a computed value
      const cell = computed(
        () => table.getRowModel().rows[0]!.getAllCells()[0]!,
      )

      const cellGetValue = computed(() => cell().getValue())

      TestBed.runInInjectionContext(() => {
        effect(() => {
          isSelectedRow1Captor(cell().row.getIsSelected())
        })
        effect(() => {
          cellGetValueCaptor(cell().getValue())
        })
        effect(() => {
          cellGetValueMemoizedCaptor(cellGetValue())
        })
        effect(() => {
          columnIsVisibleCaptor(cell().column.getIsVisible())
        })
      })

      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(1)
      expect(cellGetValueMemoizedCaptor).toHaveBeenCalledTimes(1)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(1)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(1)

      cell().row.toggleSelected(true)
      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(2)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(1)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(2)

      data.set([{ id: '1', title: 'Title 3' }])
      TestBed.tick()
      // In this case it will be called twice since `data` will change and
      // the cell instance will be recreated
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(3)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(3)

      cell().column.toggleVisibility(false)
      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(4)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(4)

      expect(isSelectedRow1Captor.mock.calls).toEqual([
        [false],
        [true],
        [true],
        [true],
      ])
      expect(cellGetValueCaptor.mock.calls).toEqual([['1'], ['1']])
      expect(columnIsVisibleCaptor.mock.calls).toEqual([
        [true],
        [true],
        [true],
        [false],
      ])
    })
  })
})
