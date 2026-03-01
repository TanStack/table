import { describe, expect, test, vi } from 'vitest'
import { computed, effect, isSignal, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { injectTable, stockFeatures } from '../src'
import { getFnReactiveCache, testShouldBeComputedProperty } from './test-utils'
import type { WritableSignal } from '@angular/core'
import type { ColumnDef } from '../src'

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
  const tablePropertyKeys = Object.keys(table)

  describe.skip('Table property reactivity', () => {
    test.each(
      tablePropertyKeys.map((property) => [
        property,
        testShouldBeComputedProperty(table, property),
      ]),
    )('property (%s) is computed -> (%s)', (name, expected) => {
      const tableProperty = table[name as keyof typeof table]
      expect(isSignal(tableProperty)).toEqual(expected)
    })

    describe('will create a computed for non detectable computed properties', () => {
      test('getIsSomeRowsPinned', () => {
        table.getIsSomeRowsPinned('top')
        table.getIsSomeRowsPinned('bottom')
        table.getIsSomeRowsPinned()

        expect(getFnReactiveCache(table.getIsSomeRowsPinned)).toHaveProperty(
          '["top"]',
        )
        expect(getFnReactiveCache(table.getIsSomeRowsPinned)).toHaveProperty(
          '["bottom"]',
        )
        expect(getFnReactiveCache(table.getIsSomeRowsPinned)).toHaveProperty(
          '[]',
        )
      })
    })
  })

  describe.skip('Header property reactivity', () => {
    const headers = table.getHeaderGroups()
    headers.forEach((headerGroup, index) => {
      const headerPropertyKeys = Object.keys(headerGroup)
      test.each(
        headerPropertyKeys.map((property) => [
          property,
          testShouldBeComputedProperty(headerGroup, property),
        ]),
      )(
        `HeaderGroup ${headerGroup.id} (${index}) - property (%s) is computed -> (%s)`,
        (name, expected) => {
          const tableProperty = headerGroup[name as keyof typeof headerGroup]
          expect(isSignal(tableProperty)).toEqual(expected)
        },
      )

      const headers = headerGroup.headers
      headers.forEach((header, cellIndex) => {
        const headerPropertyKeys = Object.keys(header).concat(
          Object.getOwnPropertyNames(Object.getPrototypeOf(header)),
        )
        test.each(
          headerPropertyKeys.map((property) => [
            property,
            testShouldBeComputedProperty(header, property),
          ]),
        )(
          `HeaderGroup ${headerGroup.id} (${index}) / Header ${header.id} - property (%s) is computed -> (%s)`,
          (name, expected) => {
            const tableProperty = header[name as keyof typeof header]
            expect(isSignal(tableProperty)).toEqual(expected)
          },
        )
      })
    })
  })

  describe.skip('Column property reactivity', () => {
    const columns = table.getAllColumns()
    columns.forEach((column, index) => {
      const columnPropertyKeys = Object.keys(column).concat(
        Object.getOwnPropertyNames(Object.getPrototypeOf(column)),
      )
      test.each(
        columnPropertyKeys.map((property) => [
          property,
          testShouldBeComputedProperty(column, property),
        ]),
      )(
        `Column ${column.id} (${index}) - property (%s) is computed -> (%s)`,
        (name, expected) => {
          const tableProperty = column[name as keyof typeof column]
          expect(isSignal(tableProperty)).toEqual(expected)
        },
      )
    })
  })

  describe.skip('Row and cells property reactivity', () => {
    const flatRows = table.getRowModel().flatRows
    flatRows.forEach((row, index) => {
      const rowsPropertyKeys = Object.keys(row).concat(
        Object.getOwnPropertyNames(Object.getPrototypeOf(row)),
      )
      test.each(
        rowsPropertyKeys.map((property) => [
          property,
          testShouldBeComputedProperty(row, property),
        ]),
      )(
        `Row ${row.id} (${index}) - property (%s) is computed -> (%s)`,
        (name, expected) => {
          const tableProperty = row[name as keyof typeof row]
          expect(isSignal(tableProperty)).toEqual(expected)
        },
      )

      const cells = row.getAllCells()
      cells.forEach((cell, cellIndex) => {
        const cellPropertyKeys = Object.keys(cell).concat(
          Object.getOwnPropertyNames(Object.getPrototypeOf(cell)),
        )
        test.each(
          cellPropertyKeys.map((property) => [
            property,
            testShouldBeComputedProperty(cell, property),
          ]),
        )(
          `Row ${row.id} (${index}) / Cell ${cell.id} - property (%s) is computed -> (%s)`,
          (name, expected) => {
            const tableProperty = cell[name as keyof typeof cell]
            expect(isSignal(tableProperty)).toEqual(expected)
          },
        )
      })
    })
  })

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
