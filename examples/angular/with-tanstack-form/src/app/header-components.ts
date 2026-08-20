import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { flexRenderComponent } from '@tanstack/angular-table'
import { injectTableHeaderContext } from './table'
import type { FlexRenderComponent } from '@tanstack/angular-table'

export function SortIndicator(): string | null {
  const header = injectTableHeaderContext()
  const sorted = header().column.getIsSorted()
  if (!sorted) return null

  return `<span class="sort-indicator">${sorted === 'asc' ? '🔼' : '🔽'}</span>`
}

export function ColumnFilter(): FlexRenderComponent | null {
  const header = injectTableHeaderContext()
  if (!header().column.getCanFilter()) return null

  return flexRenderComponent(_ColumnFilter)
}

@Component({
  template: `
    <div (click)="$event.stopPropagation()">
      @if (isNumberColumn()) {
        <div class="filter-row">
          <input
            class="filter-input"
            type="number"
            [ngModel]="numberFilterValue()?.[0] ?? ''"
            (ngModelChange)="setMin($event)"
            placeholder="Min"
          />
          <input
            class="filter-input"
            type="number"
            [ngModel]="numberFilterValue()?.[1] ?? ''"
            (ngModelChange)="setMax($event)"
            placeholder="Max"
          />
        </div>
      } @else {
        <input
          class="filter-select"
          type="text"
          [ngModel]="textFilterValue()"
          (ngModelChange)="header().column.setFilterValue($event)"
          placeholder="Search..."
        />
      }
    </div>
  `,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class _ColumnFilter {
  readonly header = injectTableHeaderContext()
  readonly table = computed(() => this.header().getContext().table)
  readonly firstValue = computed(() =>
    this.table()
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.header().column.id),
  )
  readonly isNumberColumn = computed(
    () => typeof this.firstValue() === 'number',
  )
  readonly filterValue = computed(() => this.header().column.getFilterValue())
  readonly numberFilterValue = computed(
    () => this.filterValue() as [number, number] | undefined,
  )
  readonly textFilterValue = computed(
    () => (this.filterValue() ?? '') as string,
  )

  setMin(value: string | number) {
    this.header().column.setFilterValue((old: [number, number] | undefined) => [
      value,
      old?.[1],
    ])
  }

  setMax(value: string | number) {
    this.header().column.setFilterValue((old: [number, number] | undefined) => [
      old?.[0],
      value,
    ])
  }
}
