import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectTableContext } from '../table'

@Component({
  template: `
    <div class="table-toolbar">
      <h2>{{ title() }}</h2>
      <button (click)="context.table().resetColumnFilters()">
        Clear filters
      </button>
      <button (click)="context.table().resetSorting()">Clear sorting</button>

      @if (onRefresh(); as onRefresh) {
        <button (click)="onRefresh()">Refresh data</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbar {
  readonly title = input.required<string>()
  readonly onRefresh = input<() => void>()

  readonly context = injectTableContext()

  constructor() {
    this.context.table().resetColumnFilters()
  }
}
