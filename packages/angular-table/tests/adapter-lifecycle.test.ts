import { Component, effect, signal } from '@angular/core'
import { By } from '@angular/platform-browser'
import { TestBed } from '@angular/core/testing'
import { createAtom } from '@tanstack/angular-store'
import { describe, expect, test, vi } from 'vitest'
import {
  TanStackTable,
  TanStackTableCell,
  TanStackTableHeader,
  createTableHook,
  injectTable,
  stockFeatures,
} from '../src'
import type { ColumnDef, RowSelectionState, TableOptions } from '../src'

describe('Angular adapter lifecycle and option ownership', () => {
  type Data = { id: string; title: string }

  const data: Array<Data> = [{ id: '1', title: 'Title' }]
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'id',
      accessorKey: 'id',
    },
    {
      id: 'title',
      accessorKey: 'title',
    },
  ]

  test('unsubscribes wrapped external atoms when the host is destroyed', () => {
    const rowSelectionAtom = createAtom<RowSelectionState>({})
    const subscribeSpy = vi.spyOn(rowSelectionAtom, 'subscribe')

    @Component({
      standalone: true,
      template: ``,
    })
    class HostComponent {
      readonly table = injectTable(() => ({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        atoms: {
          rowSelection: rowSelectionAtom,
        },
      }))
    }

    const fixture = TestBed.createComponent(HostComponent)
    const table = fixture.componentInstance.table

    expect(table.atoms.rowSelection.get()).toEqual({})
    expect(subscribeSpy).toHaveBeenCalledTimes(1)

    const subscription = subscribeSpy.mock.results[0]!.value
    const unsubscribeSpy = vi.spyOn(subscription, 'unsubscribe')

    rowSelectionAtom.set({ 1: true })
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    fixture.destroy()

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)

    rowSelectionAtom.set({})
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })
  })

  test('preserves the last controlled value when ownership is released', () => {
    const controlledState = signal<
      { rowSelection: RowSelectionState } | undefined
    >({
      rowSelection: { 1: true },
    })
    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        state: controlledState(),
      })),
    )

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })
    TestBed.tick()

    controlledState.set(undefined)
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    table.getRow('1').toggleSelected(false)
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({})

    controlledState.set({ rowSelection: { 1: true } })
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    table.getRow('1').toggleSelected(false)
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    controlledState.set(undefined)
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({})
  })

  test('gives an external atom precedence over controlled state', () => {
    const rowSelectionAtom = createAtom<RowSelectionState>({ 2: true })
    const controlledState = signal<RowSelectionState>({ 1: true })
    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        atoms: {
          rowSelection: rowSelectionAtom,
        },
        state: {
          rowSelection: controlledState(),
        },
      })),
    )

    expect(table.atoms.rowSelection.get()).toEqual({ 2: true })
    TestBed.tick()

    controlledState.set({ 3: true })
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

    rowSelectionAtom.set({ 1: true, 2: true })
    TestBed.tick()
    expect(table.atoms.rowSelection.get()).toEqual({
      1: true,
      2: true,
    })
  })

  test('coalesces rapid controlled updates into one reactive publication', () => {
    const controlledState = signal<RowSelectionState>({})
    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        state: {
          rowSelection: controlledState(),
        },
      })),
    )
    const stateCaptor = vi.fn<(state: RowSelectionState) => void>()

    TestBed.runInInjectionContext(() => {
      effect(() => stateCaptor(table.atoms.rowSelection.get()))
    })

    TestBed.tick()

    controlledState.set({ 1: true })
    controlledState.set({ 1: true, 2: true })
    controlledState.set({ 2: true })
    TestBed.tick()

    expect(stateCaptor.mock.calls).toEqual([[{}], [{ 2: true }]])
  })

  test('synchronizes dynamic columns, callbacks, and metadata', () => {
    const dynamicColumns = signal(columns)
    const getRowId = signal<(row: Data) => string>((row) => row.id)
    const meta = signal({ label: 'initial' })
    const table = TestBed.runInInjectionContext(() =>
      injectTable(() => ({
        data,
        columns: dynamicColumns(),
        features: stockFeatures,
        getRowId: getRowId(),
        meta: meta(),
      })),
    )

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      'id',
      'title',
    ])
    expect(table.getRowId(data[0]!, 0)).toBe('1')
    expect(table.options.meta).toEqual({ label: 'initial' })
    TestBed.tick()

    dynamicColumns.set([columns[1]!])
    getRowId.set((row) => `row-${row.id}`)
    meta.set({ label: 'updated' })
    TestBed.tick()

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      'title',
    ])
    expect(table.getRowId(data[0]!, 0)).toBe('row-1')
    expect(table.options.meta).toEqual({ label: 'updated' })
  })

  test('attaches createTableHook components to the matching table objects', () => {
    const TableToolbar = () => 'table toolbar'
    const CellBadge = () => 'cell badge'
    const HeaderBadge = () => 'header badge'
    const { injectAppTable } = createTableHook({
      features: stockFeatures,
      tableComponents: { TableToolbar },
      cellComponents: { CellBadge },
      headerComponents: { HeaderBadge },
    })
    const table = TestBed.runInInjectionContext(() =>
      injectAppTable(
        () =>
          ({
            data,
            columns,
            getRowId: (row) => row.id,
          }) satisfies Omit<
            TableOptions<typeof stockFeatures, Data>,
            'features'
          >,
      ),
    )

    const cell = table.getRow('1').getAllCells()[0]!
    const header = table.getFlatHeaders()[0]!

    expect(table.TableToolbar).toBe(TableToolbar)
    expect(table.appCell(cell)).toBe(cell)
    expect(table.appCell(cell).CellBadge).toBe(CellBadge)
    expect(table.appHeader(header)).toBe(header)
    expect(table.appHeader(header).HeaderBadge).toBe(HeaderBadge)
    expect(table.appFooter(header)).toBe(header)
    expect(table.appFooter(header).HeaderBadge).toBe(HeaderBadge)
  })

  test('provides createTableHook table, cell, and header contexts through DI', () => {
    const TableToolbar = () => 'table toolbar'
    const CellBadge = () => 'cell badge'
    const HeaderBadge = () => 'header badge'
    const {
      injectAppTable,
      injectTableContext,
      injectTableCellContext,
      injectTableHeaderContext,
    } = createTableHook({
      features: stockFeatures,
      tableComponents: { TableToolbar },
      cellComponents: { CellBadge },
      headerComponents: { HeaderBadge },
    })

    @Component({
      selector: 'app-table-context-consumer',
      standalone: true,
      template: ``,
    })
    class TableContextConsumer {
      readonly table = injectTableContext<Data>()
    }

    @Component({
      selector: 'app-cell-context-consumer',
      standalone: true,
      template: ``,
    })
    class CellContextConsumer {
      readonly cell = injectTableCellContext<unknown, Data>()
    }

    @Component({
      selector: 'app-header-context-consumer',
      standalone: true,
      template: ``,
    })
    class HeaderContextConsumer {
      readonly header = injectTableHeaderContext<unknown, Data>()
    }

    @Component({
      standalone: true,
      imports: [
        TanStackTable,
        TanStackTableCell,
        TanStackTableHeader,
        TableContextConsumer,
        CellContextConsumer,
        HeaderContextConsumer,
      ],
      template: `
        <div [tanStackTable]="table">
          <app-table-context-consumer />
        </div>
        <div [tanStackTableCell]="cell">
          <app-cell-context-consumer />
        </div>
        <div [tanStackTableHeader]="header">
          <app-header-context-consumer />
        </div>
      `,
    })
    class HostComponent {
      readonly table = injectAppTable(
        () =>
          ({
            data,
            columns,
            getRowId: (row) => row.id,
          }) satisfies Omit<
            TableOptions<typeof stockFeatures, Data>,
            'features'
          >,
      )

      get cell() {
        return this.table.getRow('1').getAllCells()[0]!
      }

      get header() {
        return this.table.getFlatHeaders()[0]!
      }
    }

    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()

    const tableConsumer = fixture.debugElement.query(
      By.directive(TableContextConsumer),
    ).componentInstance as TableContextConsumer
    const cellConsumer = fixture.debugElement.query(
      By.directive(CellContextConsumer),
    ).componentInstance as CellContextConsumer
    const headerConsumer = fixture.debugElement.query(
      By.directive(HeaderContextConsumer),
    ).componentInstance as HeaderContextConsumer

    expect(tableConsumer.table()).toBe(fixture.componentInstance.table)
    expect(tableConsumer.table().TableToolbar).toBe(TableToolbar)
    expect(cellConsumer.cell()).toBe(fixture.componentInstance.cell)
    expect(cellConsumer.cell().CellBadge).toBe(CellBadge)
    expect(headerConsumer.header()).toBe(fixture.componentInstance.header)
    expect(headerConsumer.header().HeaderBadge).toBe(HeaderBadge)
  })
})
