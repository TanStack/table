// export function SortIndicator() {
//   const header = useHeaderContext()
//   const sorted = header.column.getIsSorted()
//
//   if (!sorted) return null
//
//   return (
//     <span className="sort-indicator">{sorted === 'asc' ? '🔼' : '🔽'}</span>
// )
// }

import { Component, computed } from '@angular/core'
import { flexRenderComponent } from '@tanstack/angular-table'
import { FormsModule } from '@angular/forms'
import { injectTableHeaderContext } from '../table'
import type { FlexRenderComponent } from '@tanstack/angular-table'

export function SortIndicator(): string | null {
  const header = injectTableHeaderContext()
  const sorted = header().column.getIsSorted()
  if (!sorted) {
    return null
  }
  return `<span class="sort-indicator">${sorted === 'asc' ? '🔼' : '🔽'}</span>`
}

export function ColumnFilter(): FlexRenderComponent | null {
  const header = injectTableHeaderContext()
  if (!header().column.getCanFilter()) return null
  return flexRenderComponent(_ColumnFilter)
}

@Component({
  template: `
    <div class="column-filter" (click)="$event.stopPropagation()">
      <input
        type="text"
        [ngModel]="filterValue()"
        (ngModelChange)="header().column.setFilterValue($event)"
        [placeholder]="placeholder()"
      />
    </div>
  `,
  imports: [FormsModule],
})
export class _ColumnFilter {
  readonly header = injectTableHeaderContext()
  readonly filterValue = computed(() => this.header().column.getFilterValue())
  readonly placeholder = computed(() => `Filter ${this.header().column.id}...`)
}

@Component({
  selector: 'span',
  host: {
    'tanstack-footer-column-id': '',
    class: 'footer-column-id',
  },
  template: `{{ header().column.id }}`,
})
export class FooterColumnId {
  readonly header = injectTableHeaderContext()
}

@Component({
  selector: 'span',
  host: {
    'tanstack-footer-sum': '',
    class: 'footer-sum',
  },
  template: `{{ sum() > 0 ? sum().toLocaleString() : '—' }}`,
})
export class FooterSum {
  readonly header = injectTableHeaderContext()

  readonly table = computed(() => this.header().getContext().table)
  readonly rows = computed(() => this.table().getFilteredRowModel().rows)

  readonly sum = computed(() =>
    this.rows().reduce((acc, row) => {
      const value = row.getValue(this.header().column.id)
      return acc + (typeof value === 'number' ? value : 0)
    }, 0),
  )
}
