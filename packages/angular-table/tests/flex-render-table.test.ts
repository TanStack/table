import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  signal,
  type TemplateRef,
  ViewChild,
} from '@angular/core'
import {
  type CellContext,
  ColumnDef,
  getCoreRowModel,
} from '@tanstack/table-core'
import {
  createAngularTable,
  FlexRenderComponent,
  type FlexRenderContent,
  FlexRenderDirective,
  injectFlexRenderContext,
} from '../src'
import { TestBed } from '@angular/core/testing'
import { describe, expect, test } from 'vitest'
import { By } from '@angular/platform-browser'

const defaultData: TestData[] = [{ id: '1', title: 'My title' }] as TestData[]

const defaultColumns: ColumnDef<TestData>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    cell: props => props.renderValue(),
  },
]

describe('FlexRenderDirective', () => {
  test.each([null, undefined])('Render %s as empty', value => {
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
      String(typeof columnValue === 'function' ? columnValue() : columnValue)
    )
  })

  test('Render TemplateRef', () => {
    @Component({
      template: `
        <ng-template #template let-context
          >Cell id: {{ context.cell.id }}</ng-template
        >
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

    const { dom } = createTestTable(defaultData, [
      {
        id: 'first_cell',
        header: 'Status',
        cell: () => {
          return new FlexRenderComponent(TestBadgeComponent, {
            status: status(),
          })
        },
      },
    ])

    let row = dom.getBodyRow(0)!
    let firstCell = row.querySelector('td')
    expect(firstCell!.textContent).toEqual('Initial status')

    status.set('Updated status')
    dom.clickTriggerCdButton()

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

    let row = dom.getBodyRow(0)!
    let firstCell = row.querySelector('td')

    expect(firstCell!.textContent).toEqual('Initial status')

    statusComponent.set(null)
    fixture.detectChanges()
    expect(firstCell!.matches(':empty')).toBe(true)

    statusComponent.set(
      new FlexRenderComponent(TestBadgeComponent, { status: 'Updated status' })
    )
    fixture.detectChanges()
    const el = firstCell!.firstElementChild as HTMLElement
    expect(el!.tagName).toEqual('APP-TEST-BADGE')
    expect(el.textContent).toEqual('Updated status')
  })
})

function expectPrimitiveValueIs(
  cell: HTMLTableCellElement | null,
  value: unknown
) {
  expect(cell).not.toBeNull()
  expect(cell!.matches(':empty')).toBe(false)
  const span = cell!.querySelector('span')!
  expect(span).toBeDefined()
  expect(span.innerHTML).toEqual(value)
}

type TestData = { id: string; title: string }

export function createTestTable(
  data: TestData[],
  columns: ColumnDef<TestData, any>[]
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
    imports: [FlexRenderDirective],
  })
  class TestComponent {
    readonly columns = input<ColumnDef<TestData>[]>(columns)
    readonly data = input<TestData[]>(data)

    readonly count = signal(0)

    readonly table = createAngularTable(() => {
      return {
        columns: this.columns(),
        data: this.data(),
        getCoreRowModel: getCoreRowModel(),
      }
    })
  }

  const fixture = TestBed.createComponent(TestComponent)

  fixture.detectChanges()

  return {
    fixture,
    dom: {
      clickTriggerCdButton() {
        const btn = fixture.debugElement.query(By.css('button'))
        btn.triggerEventHandler('click', null)
        fixture.detectChanges()
      },
      clickTriggerCdButton2() {
        const btn = fixture.debugElement.queryAll(By.css('button'))[1]!
        btn.triggerEventHandler('click', null)
        fixture.detectChanges()
      },
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
  readonly context = injectFlexRenderContext<CellContext<TestData, any>>()

  readonly status = input.required<string>()
}
