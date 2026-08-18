import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { bench, describe } from 'vitest'
import {
  FlexRender,
  flexRenderComponent,
  injectTable,
  stockFeatures,
} from '../../src'
import type { ColumnDef } from '../../src'

const benchmarkOptions = { time: 2_000, warmupTime: 500 }

@Component({
  template: `
    {{ tick() }}
    @for (item of items; track item) {
      <ng-container *flexRender="render; props: context; let value">
        {{ value }}
      </ng-container>
    }
  `,
  imports: [FlexRender],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PrimitiveTable {
  readonly items = Array.from({ length: 500 }, (_, index) => index)
  readonly value = signal('value')
  readonly tick = signal(0)
  readonly context = {}
  readonly render = () => this.value()
}

@Component({
  template: ``,
})
class RenderedComponent {}

describe('flexRender hot paths', () => {
  const fixture = TestBed.createComponent(PrimitiveTable)
  fixture.detectChanges()

  bench(
    'unrelated change detection for 500 primitive cells',
    () => {
      fixture.componentInstance.tick.update((value) => value + 1)
      fixture.detectChanges()
    },
    benchmarkOptions,
  )

  bench(
    'create 500 component render descriptors',
    () => {
      for (let index = 0; index < 500; index++) {
        flexRenderComponent(RenderedComponent)
      }
    },
    benchmarkOptions,
  )
})

interface BenchmarkRow {
  id: string
  values: Array<string>
}

const rowCount = 100
const columnCount = 12
const largeTableData: Array<BenchmarkRow> = Array.from(
  { length: rowCount },
  (_, rowIndex) => ({
    id: `row-${rowIndex}`,
    values: Array.from(
      { length: columnCount },
      (_, columnIndex) => `${rowIndex}:${columnIndex}`,
    ),
  }),
)
const handleActivate = () => {}

@Component({
  selector: 'benchmark-cell-a',
  template: `<button (click)="activate.emit()">
    A {{ value() }}:{{ version() }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BenchmarkCellA {
  readonly value = input.required<string>()
  readonly version = input.required<number>()
  readonly activate = output<void>()
}

@Component({
  selector: 'benchmark-cell-b',
  template: `<button (click)="activate.emit()">
    B {{ value() }}:{{ version() }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BenchmarkCellB {
  readonly value = input.required<string>()
  readonly version = input.required<number>()
  readonly activate = output<void>()
}

@Component({
  template: `
    <span data-host-tick>{{ hostTick() }}</span>
    <table>
      <tbody>
        @for (row of table.getRowModel().rows; track row.id) {
          <tr>
            @for (cell of row.getVisibleCells(); track cell.id) {
              <td>
                <ng-container *flexRenderCell="cell; let value">
                  {{ value }}
                </ng-container>
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  imports: [FlexRender],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LargeMixedTable {
  readonly hostTick = signal(0)
  readonly valueVersion = signal(0)
  readonly componentKind = signal<'a' | 'b'>('a')
  readonly contentKind = signal<'primitive' | 'component'>('primitive')

  readonly columns: Array<ColumnDef<typeof stockFeatures, BenchmarkRow, any>> =
    Array.from({ length: columnCount }, (_, columnIndex) => ({
      id: `column-${columnIndex}`,
      accessorFn: (row) => row.values[columnIndex]!,
      cell: (context) => {
        const value = context.getValue()

        // Four primitive columns whose values change in place.
        if (columnIndex < 4) {
          return `${value}:${this.valueVersion()}`
        }

        // Four stable component columns whose inputs change frequently.
        if (columnIndex < 8) {
          const component =
            columnIndex % 2 === 0 ? BenchmarkCellA : BenchmarkCellB
          return flexRenderComponent(component, {
            inputs: { value, version: this.valueVersion() },
            outputs: { activate: handleActivate },
          })
        }

        // Two columns that intentionally replace component A with component B.
        if (columnIndex < 10) {
          const component =
            this.componentKind() === 'a' ? BenchmarkCellA : BenchmarkCellB
          return flexRenderComponent(component, {
            inputs: { value, version: 0 },
            outputs: { activate: handleActivate },
          })
        }

        // Two columns that cross the primitive/component view boundary.
        return this.contentKind() === 'primitive'
          ? value
          : flexRenderComponent(BenchmarkCellA, {
              inputs: { value, version: 0 },
              outputs: { activate: handleActivate },
            })
      },
    }))

  readonly table = injectTable(() => ({
    data: largeTableData,
    columns: this.columns,
    features: stockFeatures,
    getRowId: (row) => row.id,
  }))
}

describe('flexRender large mixed table', () => {
  const fixture = TestBed.createComponent(LargeMixedTable)
  fixture.detectChanges()

  const instance = fixture.componentInstance
  const renderedCellCount = fixture.nativeElement.querySelectorAll('td').length
  if (renderedCellCount !== rowCount * columnCount) {
    throw new Error(`Expected 1,200 cells, rendered ${renderedCellCount}`)
  }

  bench(
    'unrelated host change with 1,200 mounted cells',
    () => {
      instance.hostTick.update((value) => value + 1)
      fixture.detectChanges()
    },
    benchmarkOptions,
  )

  bench(
    'update 400 primitives and 400 stable component inputs',
    () => {
      instance.valueVersion.update((value) => value + 1)
      fixture.detectChanges()
    },
    benchmarkOptions,
  )

  bench(
    'replace 200 component A/B cell views',
    () => {
      instance.componentKind.update((value) => (value === 'a' ? 'b' : 'a'))
      fixture.detectChanges()
    },
    benchmarkOptions,
  )

  bench(
    'switch 200 cells between primitive and component views',
    () => {
      instance.contentKind.update((value) =>
        value === 'primitive' ? 'component' : 'primitive',
      )
      fixture.detectChanges()
    },
    benchmarkOptions,
  )
})
