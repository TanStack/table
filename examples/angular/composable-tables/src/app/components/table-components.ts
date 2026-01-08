import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectTableContext } from '../table'

@Component({
  template: `
    <div class="table-toolbar">
      <h2>{{ title() }}</h2>
      <button (click)="table().resetColumnFilters()">Clear filters</button>
      <button (click)="table().resetSorting()">Clear sorting</button>

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

  readonly table = injectTableContext()

  constructor() {
    this.table().resetColumnFilters()
  }
}
