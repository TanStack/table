import { describe, expect, test, vi } from 'vitest'
import { computed, effect, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { createAtom } from '@tanstack/angular-store'
import { injectTable, stockFeatures } from '../src'
import type { ColumnDef, RowSelectionState } from '../src'
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
        features: { ...stockFeatures },
        columns: columns,
        getRowId: (row) => row.id,
      })),
    )
  }

  const table = createTestTable()

  describe('Integration', () => {
    // TODO this switches between 1 and 2 calls on every other run, so it's not a reliable test
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
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(1)

      data.set([{ id: '1', title: 'Title 3' }])
      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(3)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(2)

      cell().column.toggleVisibility(false)
      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(3)
      expect(cellGetValueCaptor).toHaveBeenCalledTimes(2)
      expect(columnIsVisibleCaptor).toHaveBeenCalledTimes(3)

      expect(isSelectedRow1Captor.mock.calls).toEqual([[false], [true], [true]])
      expect(cellGetValueCaptor.mock.calls).toEqual([['1'], ['1']])
      expect(columnIsVisibleCaptor.mock.calls).toEqual([
        [true],
        [true],
        [false],
      ])
    })

    test('methods within effect react to external atom changes', () => {
      const rowSelectionAtom = createAtom<RowSelectionState>({})
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: { ...stockFeatures },
          columns: columns,
          getRowId: (row) => row.id,
          atoms: {
            rowSelection: rowSelectionAtom,
          },
        })),
      )
      const isSelectedRow1Captor = vi.fn<(val: boolean) => void>()
      const tableStateCaptor = vi.fn<(val: RowSelectionState) => void>()

      TestBed.runInInjectionContext(() => {
        effect(() => {
          isSelectedRow1Captor(table.getRow('1').getIsSelected())
        })
        effect(() => {
          tableStateCaptor(table.atoms.rowSelection.get())
        })
      })

      TestBed.tick()
      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(1)
      expect(tableStateCaptor).toHaveBeenCalledTimes(1)

      rowSelectionAtom.set({ 1: true })
      TestBed.tick()

      expect(isSelectedRow1Captor).toHaveBeenCalledTimes(2)
      expect(tableStateCaptor).toHaveBeenCalledTimes(2)
      expect(isSelectedRow1Captor.mock.calls).toEqual([[false], [true]])
      expect(tableStateCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    })

    test('table store can be subscribed from another reactive effect', () => {
      const table = createTestTable()
      const tableStateCaptor = vi.fn()

      TestBed.runInInjectionContext(() => {
        effect((onCleanup) => {
          const subscription = table.store.subscribe(() => {
            tableStateCaptor(table.store.get())
          })

          onCleanup(() => subscription.unsubscribe())
        })
      })

      expect(() => TestBed.tick()).not.toThrow()
    })

    test('table state reacts to every external signal state update', () => {
      const rowSelection = signal<RowSelectionState>({})
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: { ...stockFeatures },
          columns: columns,
          getRowId: (row) => row.id,
          state: {
            rowSelection: rowSelection(),
          },
        })),
      )
      const tableStateCaptor = vi.fn<(val: RowSelectionState) => void>()

      TestBed.runInInjectionContext(() => {
        effect(() => {
          tableStateCaptor(table.atoms.rowSelection.get())
        })
      })

      TestBed.tick()
      rowSelection.set({ 1: true })
      TestBed.tick()
      rowSelection.set({ 1: true, 2: true })
      TestBed.tick()
      rowSelection.set({ 2: true })
      TestBed.tick()

      expect(tableStateCaptor.mock.calls).toEqual([
        [{}],
        [{ 1: true }],
        [{ 1: true, 2: true }],
        [{ 2: true }],
      ])
    })

    test('table state exposes initial state on first render read', () => {
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: { ...stockFeatures },
          columns: columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })),
      )

      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(JSON.stringify(table.store.get(), null, 2)).toContain(
        '"pageSize": 20',
      )
    })

    test('table state reacts to internal table state updates', () => {
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: { ...stockFeatures },
          columns: columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })),
      )
      const pageSizeCaptor = vi.fn<(val: number) => void>()
      const stateJsonCaptor = vi.fn<(val: string) => void>()

      TestBed.runInInjectionContext(() => {
        effect(() => {
          pageSizeCaptor(table.atoms.pagination.get().pageSize)
        })
        effect(() => {
          stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
        })
      })

      TestBed.tick()
      table.setPageSize(50)
      TestBed.tick()
      table.setPageSize(100)
      TestBed.tick()

      expect(pageSizeCaptor.mock.calls).toEqual([[20], [50], [100]])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain(
        '"pageSize": 100',
      )
    })

    test('table state property reads only track the accessed slice', () => {
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: { ...stockFeatures },
          columns: columns,
          getRowId: (row) => row.id,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })),
      )
      const pageSizeCaptor = vi.fn<(val: number) => void>()
      const stateJsonCaptor = vi.fn<(val: string) => void>()

      TestBed.runInInjectionContext(() => {
        effect(() => {
          pageSizeCaptor(table.atoms.pagination.get().pageSize)
        })
        effect(() => {
          stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
        })
      })

      TestBed.tick()
      table.toggleAllRowsSelected(true)
      TestBed.tick()

      expect(pageSizeCaptor.mock.calls).toEqual([[20]])
      expect(stateJsonCaptor).toHaveBeenCalledTimes(2)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"rowSelection"')
    })

    test('stock feature table exposes full initial state and updates json state', () => {
      const table = TestBed.runInInjectionContext(() =>
        injectTable(() => ({
          data: data(),
          features: stockFeatures,
          columns: columns,
          getRowId: (row) => row.id,
          initialState: {
            columnOrder: columns.map((column) => column.id!),
            columnPinning: { left: ['id'], right: [] },
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })),
      )
      const stateJsonCaptor = vi.fn<(val: string) => void>()

      TestBed.runInInjectionContext(() => {
        effect(() => {
          stateJsonCaptor(JSON.stringify(table.store.get(), null, 2))
        })
      })

      TestBed.tick()
      expect(table.atoms.pagination.get().pageSize).toBe(20)
      expect(table.atoms.columnOrder.get()).toEqual(['id', 'title'])
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 20')

      table.setPageSize(50)
      TestBed.tick()

      expect(table.atoms.pagination.get().pageSize).toBe(50)
      expect(stateJsonCaptor.mock.calls.at(-1)?.[0]).toContain('"pageSize": 50')
    })
  })
})
