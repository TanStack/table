import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  input,
  inputBinding,
  output,
  outputBinding,
  signal,
} from '@angular/core'
import {
  ColumnDef,
  createCoreRowModel,
  stockFeatures,
} from '@tanstack/table-core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, test, vi } from 'vitest'
import { By } from '@angular/platform-browser'
import {
  FlexRender,
  flexRenderComponent,
  injectFlexRenderContext,
  injectTable,
} from '../../src'
import type { FlexRenderContent } from '../../src'
import type {
  CellContext,
  ExpandedState,
  TableOptions,
} from '@tanstack/table-core'
import type { TemplateRef } from '@angular/core'

const defaultData: Array<TestData> = [
  { id: '1', title: 'My title' },
] as Array<TestData>

const defaultColumns: Array<ColumnDef<typeof stockFeatures, TestData>> = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    cell: (props) => props.renderValue(),
  },
]

describe('FlexRenderDirective', () => {
  test.each([null, undefined])('Render %s as empty', (value) => {
    const { fixture, dom } = createTestTable(defaultData, [
      { id: 'first_cell', header: 'header', cell: () => value },
    ])
    const row = dom.getBodyRow(0)!
    const firstCell = row.querySelector('td')

    expect(firstCell!.matches(':empty')).toBe(true)
  })

  test.each([
    ['String column via function', () => 'My string'],
    ['String column', () => 'My string'],
    ['Number column via function', () => 0],
    ['Number column', 0],
  ])('Render primitive (%s)', (columnName, columnValue) => {
    const { fixture, dom } = createTestTable(defaultData, [
      { id: 'first_cell', header: columnName, cell: columnValue as any },
    ])
    const row = dom.getBodyRow(0)!
    const firstCell = row.querySelector('td')

    expectPrimitiveValueIs(
      firstCell,
      String(typeof columnValue === 'function' ? columnValue() : columnValue),
    )
  })

  test('Render TemplateRef', () => {
    @Component({
      template: `
        <!-- prettier-ignore -->
        <ng-template #template let-context>Cell id: {{ context.cell.id }}</ng-template>
      `,
      standalone: true,
    })
    class FakeTemplateRefComponent {
      @ViewChild('template', { static: true })
      templateRef!: TemplateRef<any>
    }

    const templateRef = TestBed.createComponent(FakeTemplateRefComponent)
      .componentInstance.templateRef

    const { dom } = createTestTable(defaultData, [
      { id: 'first_cell', header: 'Header', cell: () => templateRef },
    ])

    const row = dom.getBodyRow(0)!
    const firstCell = row.querySelector('td')
    expect(firstCell!.textContent).toEqual('Cell id: 0_first_cell')
  })

  test('Render component with FlexRenderComponent', async () => {
    const status = signal<string>('Initial status')

    const { dom, fixture } = createTestTable(defaultData, [
      {
        id: 'first_cell',
        header: 'Status',
        cell: () => {
          return flexRenderComponent(TestBadgeComponent, {
            inputs: {
              status: status(),
            },
          })
        },
      },
    ])

    const row = dom.getBodyRow(0)!
    const firstCell = row.querySelector('td')
    expect(firstCell!.textContent).toEqual('Initial status')

    status.set('Updated status')
    await fixture.whenStable()

    expect(firstCell!.textContent).toEqual('Updated status')
  })

  test('Render content reactively based on signal value', async () => {
    const statusComponent = signal<FlexRenderContent<any>>('Initial status')

    const { dom, fixture } = createTestTable(defaultData, [
      {
        id: 'first_cell',
        header: 'Status',
        cell: () => {
          return statusComponent()
        },
      },
    ])

    const row = dom.getBodyRow(0)!
    const firstCell = row.querySelector('td')

    expect(firstCell!.textContent).toEqual('Initial status')

    statusComponent.set(null)
    await fixture.whenRenderingDone()
    expect(firstCell!.matches(':empty')).toBe(true)

    statusComponent.set(
      flexRenderComponent(TestBadgeComponent, {
        inputs: { status: 'Updated status' },
      }),
    )
    await fixture.whenRenderingDone()

    const el = firstCell!.firstElementChild as HTMLElement
    expect(el.tagName).toEqual('APP-TEST-BADGE')
    expect(el.textContent).toEqual('Updated status')
  })

  test('Cell content always get the latest context value', async () => {
    const contextCaptor = vi.fn()

    @Component({
      template: ``,
    })
    class EmptyCell {}

    const { dom, fixture } = createTestTable(defaultData, [
      {
        id: 'cell',
        header: 'Header',
        cell: (context) => {
          contextCaptor(context)
          return flexRenderComponent(EmptyCell)
        },
      },
    ])

    const latestCall = () =>
      contextCaptor.mock.lastCall![0] as CellContext<
        typeof stockFeatures,
        TestData,
        any
      >

    expect(contextCaptor).toHaveBeenCalledTimes(1)
    expect(latestCall().row.getIsExpanded()).toEqual(false)

    const table = fixture.componentInstance.table
    table.getRow('0').toggleSelected(true)
    await fixture.whenStable()

    expect(contextCaptor).toHaveBeenCalledTimes(1)
    expect(latestCall().row.getIsSelected()).toEqual(true)

    table.getRow('0').toggleSelected(false)
    table.getRow('0').toggleExpanded(true)
    await fixture.whenStable()

    expect(contextCaptor).toHaveBeenCalledTimes(1)
    expect(latestCall().row.getIsSelected()).toEqual(false)
    expect(latestCall().row.getIsExpanded()).toEqual(true)
  })

  test('Support cell with component output', async () => {
    const callExpandRender = vi.fn<(val: boolean) => void>()

    const columns = [
      {
        id: 'expand',
        header: 'Expand',
        cell: ({ row }: any) => {
          callExpandRender(row.getIsExpanded())
          return flexRenderComponent(ExpandCell, {
            inputs: { expanded: row.getIsExpanded() },
            outputs: { toggleExpand: () => row.toggleExpanded() },
          })
        },
      },
    ] satisfies Array<ColumnDef<typeof stockFeatures, TestData>>

    @Component({
      selector: 'expand-cell',
      template: `
        <button (click)="toggleExpand.emit()">
          {{ expanded() ? 'Expanded' : 'Not expanded' }}
        </button>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
    })
    class ExpandCell {
      readonly expanded = input(false)
      readonly toggleExpand = output<void>()
    }

    @Component({
      template: `
        <table>
          <tbody>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td>
                    <ng-container
                      *flexRender="
                        cell.column.columnDef.cell;
                        props: cell.getContext();
                        let cell
                      "
                    >
                      <span [innerHTML]="cell"></span>
                    </ng-container>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      selector: 'app-table-test',
      imports: [FlexRender],
    })
    class TestComponent {
      readonly expandState = signal<ExpandedState>({})

      readonly table = injectTable(() => {
        return {
          columns: columns,
          data: defaultData,
          _features: stockFeatures,
          _rowModels: {
            coreRowModel: createCoreRowModel(),
          },
          state: { expanded: this.expandState() },
          onExpandedChange: (updaterOrValue) => {
            typeof updaterOrValue === 'function'
              ? this.expandState.update(updaterOrValue)
              : this.expandState.set(updaterOrValue)
          },
        } as TableOptions<typeof stockFeatures, TestData>
      })
    }

    const fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    const expandCell = fixture.debugElement.query(By.directive(ExpandCell))
    expect(fixture.componentInstance.expandState()).toEqual({})
    expect(expandCell.componentInstance.expanded()).toEqual(false)

    const buttonEl = expandCell.query(By.css('button'))
    expect(buttonEl.nativeElement.innerHTML).toEqual(' Not expanded ')
    buttonEl.triggerEventHandler('click')

    expect(fixture.componentInstance.expandState()).toEqual({
      '0': true,
    })
    await fixture.whenStable()

    expect(callExpandRender).toHaveBeenCalledTimes(2)
    expect(callExpandRender).toHaveBeenNthCalledWith(1, false)
    expect(callExpandRender).toHaveBeenNthCalledWith(2, true)

    expect(buttonEl.nativeElement.innerHTML).toEqual(' Expanded ')
  })

  test('Support cell with component input/output binding', async () => {
    const callExpandRender = vi.fn<() => void>()

    const columns = [
      {
        id: 'expand',
        header: 'Expand',
        cell: ({ row }: any) => {
          callExpandRender()
          return flexRenderComponent(ExpandCell, {
            bindings: [
              inputBinding('expanded', () => row.getIsExpanded()),
              outputBinding('toggleExpand', () => row.toggleExpanded()),
            ],
          })
        },
      },
    ] satisfies Array<ColumnDef<typeof stockFeatures, TestData>>

    @Component({
      selector: 'expand-cell',
      template: `
        <button (click)="toggleExpand.emit()">
          {{ expanded() ? 'Expanded' : 'Not expanded' }}
        </button>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
    })
    class ExpandCell {
      readonly expanded = input(false)
      readonly toggleExpand = output<void>()
    }

    @Component({
      template: `
        <table>
          <tbody>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td>
                    <ng-container *flexRenderCell="cell; let cell">
                      <span [innerHTML]="cell"></span>
                    </ng-container>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      selector: 'app-table-test',
      imports: [FlexRender],
    })
    class TestComponent {
      readonly expandState = signal<ExpandedState>({})

      readonly table = injectTable(() => {
        return {
          columns: columns,
          data: defaultData,
          _features: stockFeatures,
          _rowModels: {
            coreRowModel: createCoreRowModel(),
          },
          state: { expanded: this.expandState() },
          onExpandedChange: (updaterOrValue) => {
            typeof updaterOrValue === 'function'
              ? this.expandState.update(updaterOrValue)
              : this.expandState.set(updaterOrValue)
          },
        } as TableOptions<typeof stockFeatures, TestData>
      })
    }

    const fixture = TestBed.createComponent(TestComponent)
    await fixture.whenStable()

    const expandCell = fixture.debugElement.query(By.directive(ExpandCell))
    expect(fixture.componentInstance.expandState()).toEqual({})
    expect(expandCell.componentInstance.expanded()).toEqual(false)

    const buttonEl = expandCell.query(By.css('button'))
    expect(buttonEl.nativeElement.innerHTML).toEqual(' Not expanded ')
    buttonEl.triggerEventHandler('click')

    expect(fixture.componentInstance.expandState()).toEqual({
      '0': true,
    })
    await fixture.whenStable()

    expect(callExpandRender).toHaveBeenCalledTimes(1)
    expect(buttonEl.nativeElement.innerHTML).toEqual(' Expanded ')
  })
})

function expectPrimitiveValueIs(
  cell: HTMLTableCellElement | null,
  value: unknown,
) {
  expect(cell).not.toBeNull()
  expect(cell!.matches(':empty')).toBe(false)
  const span = cell!.querySelector('span')!
  expect(span).toBeDefined()
  expect(span.innerHTML).toEqual(value)
}

type TestData = { id: string; title: string }

export function createTestTable(
  data: Array<TestData>,
  columns: Array<ColumnDef<typeof stockFeatures, TestData, any>>,
  optionsFn?: () => Partial<TableOptions<typeof stockFeatures, TestData>>,
) {
  @Component({
    template: `
      <table>
        <thead data-testid="thead">
          @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
            <tr
              data-testid="thead_row"
              [attr.data-testid]="'thead_headergroup_' + headerGroup.id"
            >
              @for (header of headerGroup.headers; track header.id) {
                @if (!header.isPlaceholder) {
                  <th
                    [attr.data-testid]="
                      'thead_headergroup_' + headerGroup.id + '_' + header.id
                    "
                  >
                    <ng-container
                      *flexRender="
                        header.column.columnDef.header;
                        props: header.getContext();
                        let header
                      "
                    >
                      <span [innerHTML]="header"></span>
                    </ng-container>
                  </th>
                }
              }
            </tr>
          }
        </thead>
        <tbody>
          @for (row of table.getRowModel().rows; track row.id) {
            <tr [attr.data-testid]="'row_' + row.id">
              @for (cell of row.getVisibleCells(); track cell.id) {
                <td [attr.data-testid]="'row_' + row.id + '_cell_' + cell.id">
                  <ng-container
                    *flexRender="
                      cell.column.columnDef.cell;
                      props: cell.getContext();
                      let cell
                    "
                  >
                    <span [innerHTML]="cell"></span>
                  </ng-container>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>

      <button (click)="(0)">Trigger CD</button>

      <button (click)="count.set(count() + 1)">Trigger CD 2</button>

      {{ count() }}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    selector: 'app-table-test',
    imports: [FlexRender],
  })
  class TestComponent {
    readonly columns =
      input<Array<ColumnDef<typeof stockFeatures, TestData>>>(columns)
    readonly data = input<Array<TestData>>(data)

    readonly count = signal(0)

    readonly table = injectTable(() => {
      return {
        ...(optionsFn?.() ?? {}),
        _features: stockFeatures,
        _rowModels: {
          coreRowModel: createCoreRowModel(),
        },
        columns: this.columns(),
        data: this.data(),
      } as TableOptions<typeof stockFeatures, TestData>
    })
  }

  const fixture = TestBed.createComponent(TestComponent)

  fixture.detectChanges()

  return {
    fixture,
    dom: {
      getTable() {
        return fixture.nativeElement.querySelector('table') as HTMLTableElement
      },
      getHeader() {
        return this.getTable().querySelector('thead') as HTMLTableSectionElement
      },
      getHeaderRow() {
        return this.getHeader().querySelector('tr') as HTMLTableRowElement
      },
      getBody() {
        return this.getTable().querySelector('tbody') as HTMLTableSectionElement
      },
      getBodyRow(index: number) {
        return this.getBody().rows.item(index)
      },
    },
  }
}

@Component({
  selector: 'app-test-badge',
  template: `<span>{{ status() }}</span> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestBadgeComponent {
  readonly context =
    injectFlexRenderContext<CellContext<typeof stockFeatures, TestData, any>>()

  readonly status = input.required<string>()
}
