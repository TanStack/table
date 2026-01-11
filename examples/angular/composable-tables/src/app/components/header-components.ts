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
import { injectTableHeaderContext } from '../table'

// @Component({
//   selector: 'app-sort-indicator',
//   host: {
//     class: 'sort-indicator',
//   },
//   template: ` {{ sorted === 'asc' ? '🔼' : '🔽' }} `,
// })
// export class SortIndicator {
//   readonly context = injectTableHeaderContext()
// }

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
