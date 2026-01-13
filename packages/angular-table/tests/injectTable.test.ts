import { isProxy } from 'node:util/types'
import { describe, expect, test, vi } from 'vitest'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  ColumnDef,
  createPaginatedRowModel,
  stockFeatures,
} from '@tanstack/table-core'
import { RowModel, injectTable } from '../src'
import type { PaginationState } from '../src'

describe('injectTable', () => {
  test('should support required signal inputs', () => {
    @Component({
      selector: 'app-table',
      template: ``,
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TableComponent {
      data = input.required<Array<any>>()

      table = injectTable(() => ({
        data: this.data(),
        _features: stockFeatures,
        columns: [],
      }))
    }

    @Component({
      selector: 'app-root',
      imports: [TableComponent],
      template: ` <app-table [data]="[]" /> `,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class RootComponent {}

    const fixture = TestBed.createComponent(RootComponent)
    fixture.detectChanges()

    fixture.whenRenderingDone()
  })

  describe('Proxy table', () => {
    type Data = { id: string; title: string }
    const data = signal<Array<Data>>([{ id: '1', title: 'Title' }])
    const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
      { id: 'id', header: 'Id', cell: (context) => context.getValue() },
      { id: 'title', header: 'Title', cell: (context) => context.getValue() },
    ]
    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data: data(),
        _features: stockFeatures,
        columns: columns,
        getRowId: (row) => row.id,
      })),
    )

    test('table is proxy', () => {
      expect(isProxy(table)).toBe(true)
    })

    test('supports "in" operator', () => {
      expect('_features' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
    })

    test('supports "Object.keys"', () => {
      const keys = Object.keys(table.get()).concat('state')
      expect(Object.keys(table)).toEqual(keys)
    })

    test('Row model is reactive', () => {
      const coreRowModelFn =
        vi.fn<(model: RowModel<typeof stockFeatures, Data>) => void>()
      const rowModelFn =
        vi.fn<(model: RowModel<typeof stockFeatures, Data>) => void>()
      const pagination = signal<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        title: `Title ${i}`,
      }))

      TestBed.runInInjectionContext(() => {
        const table = injectTable(() => ({
          data,
          columns: columns,
          _features: stockFeatures,
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          getRowId: (row) => row.id,
          state: {
            pagination: pagination(),
          },
          onPaginationChange: (updater) => {
            typeof updater === 'function'
              ? pagination.update(updater)
              : pagination.set(updater)
          },
        }))

        effect(() => coreRowModelFn(table.getCoreRowModel()))
        effect(() => rowModelFn(table.getRowModel()))

        TestBed.tick()

        pagination.set({ pageIndex: 0, pageSize: 3 })

        TestBed.tick()

        expect(coreRowModelFn).toHaveBeenCalledOnce()
        expect(coreRowModelFn.mock.calls[0]![0].rows.length).toEqual(10)

        expect(rowModelFn).toHaveBeenCalledTimes(2)
        expect(rowModelFn.mock.calls[0]![0].rows.length).toEqual(5)
        expect(rowModelFn.mock.calls[1]![0].rows.length).toEqual(3)
      })
    })
  })
})
