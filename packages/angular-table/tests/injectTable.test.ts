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
import { By } from '@angular/platform-browser'
import {
  ColumnDef,
  createPaginatedRowModel,
  stockFeatures,
} from '@tanstack/table-core'
import { injectTable } from '../src'
import type { PaginationState } from '../src'

describe('injectTable', () => {
  test('evaluates options once while constructing the table', () => {
    const options = vi.fn(() => ({
      data: [],
      features: stockFeatures,
      columns: [],
    }))
    const table = TestBed.runInInjectionContext(() => injectTable(options))

    expect(options).not.toHaveBeenCalled()

    void table.options

    expect(options).toHaveBeenCalledTimes(1)
  })

  test('should support required signal inputs', async () => {
    type Data = { id: string; title: string }

    @Component({
      selector: 'app-table',
      template: `{{ table.getRowModel().rows.length }}`,
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TableComponent {
      data = input.required<Array<Data>>()

      table = injectTable(() => ({
        data: this.data(),
        features: stockFeatures,
        columns: [],
        getRowId: (row) => row.id,
      }))
    }

    @Component({
      selector: 'app-root',
      imports: [TableComponent],
      template: `<app-table [data]="data()" />`,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class RootComponent {
      readonly data = signal<Array<Data>>([{ id: '1', title: 'First' }])
    }

    const fixture = TestBed.createComponent(RootComponent)
    fixture.detectChanges()
    await fixture.whenRenderingDone()

    const tableComponent = fixture.debugElement.query(
      By.directive(TableComponent),
    ).componentInstance as TableComponent

    expect(fixture.nativeElement.textContent.trim()).toBe('1')
    expect(
      tableComponent.table.getRowModel().rows.map((row) => row.original),
    ).toEqual([{ id: '1', title: 'First' }])
    TestBed.tick()

    fixture.componentInstance.data.set([
      { id: '1', title: 'Updated' },
      { id: '2', title: 'Second' },
    ])
    fixture.detectChanges()
    TestBed.tick()
    await fixture.whenRenderingDone()

    expect(fixture.nativeElement.textContent.trim()).toBe('2')
    expect(
      tableComponent.table.getRowModel().rows.map((row) => row.original),
    ).toEqual([
      { id: '1', title: 'Updated' },
      { id: '2', title: 'Second' },
    ])
  })

  test('should not initialize when destroyed before the first effect', () => {
    @Component({ standalone: true, template: `` })
    class TableComponent {
      readonly data = input.required<Array<{ id: string }>>()
      readonly table = injectTable(() => ({
        data: this.data(),
        features: stockFeatures,
        columns: [],
      }))
    }

    const fixture = TestBed.createComponent(TableComponent)

    expect(() => fixture.destroy()).not.toThrow()
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
        features: stockFeatures,
        columns: columns,
        getRowId: (row) => row.id,
      })),
    )

    test('exposes a table instance through the proxy', () => {
      expect(isProxy(table)).toBe(true)
      expect(table).toBeDefined()
      expect(typeof table).toBe('object')
      expect(typeof table.getRowModel).toBe('function')
    })

    test('supports "in" operator', () => {
      expect('atoms' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
    })

    test('supports "Object.keys"', () => {
      const keys = Object.keys(table)
      expect(keys).toEqual(expect.arrayContaining(['options', 'getRowModel']))
    })

    test('Row model is reactive', () => {
      const rowCounts = vi.fn<(count: number) => void>()
      const pagination = signal<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
      })
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        title: `Title ${i}`,
      }))

      TestBed.runInInjectionContext(() => {
        const table = injectTable<typeof stockFeatures, Data>(() => ({
          data,
          columns: columns,
          features: {
            ...stockFeatures,
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

        const initialCoreRowModel = table.getCoreRowModel()
        effect(() => rowCounts(table.getRowModel().rows.length))

        TestBed.tick()

        pagination.set({ pageIndex: 0, pageSize: 3 })

        TestBed.tick()

        expect(rowCounts.mock.calls).toEqual([[5], [3]])
        expect(table.getCoreRowModel()).toBe(initialCoreRowModel)
      })
    })
  })

  // Fixes https://github.com/TanStack/table/issues/6530
  test('does not drop an options update before the effect first runs', () => {
    type Data = { id: string }

    const initialData: Array<Data> = []
    const updatedData: Array<Data> = [{ id: '1' }]
    const data = signal(initialData)

    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data: data(),
        columns: [],
        features: stockFeatures,
        getRowId: (row) => row.id,
      })),
    )

    expect(table.options.data).toBe(initialData)

    data.set(updatedData)
    TestBed.tick()

    expect(table.options.data).toBe(updatedData)
  })
})
