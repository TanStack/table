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

import { Component } from '@angular/core'
import { injectTableHeaderContext } from '@tanstack/angular-table'

@Component({
  selector: 'app-sort-indicator',
  host: {
    class: 'sort-indicator',
  },
  template: ` {{ sorted === 'asc' ? '🔼' : '🔽' }} `,
})
export class SortIndicator {
  readonly context = injectTableHeaderContext()
}
