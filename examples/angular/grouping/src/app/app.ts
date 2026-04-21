import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { FlexRender, isFunction } from '@tanstack/angular-table'
import { columns, injectTable } from './columns'
import { makeData } from './makeData'
import type { GroupingState, Updater } from '@tanstack/angular-table'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData(10000))
  readonly grouping = signal<GroupingState>([])

  readonly stringifiedGrouping = computed(() =>
    JSON.stringify(this.grouping(), null, 2),
  )

  readonly table = injectTable(() => ({
    debugTable: true,
    data: this.data(),
    columns: columns,
    initialState: {
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      grouping: this.grouping(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const groupingState = isFunction(updaterOrValue)
        ? updaterOrValue([...this.grouping()])
        : updaterOrValue
      this.grouping.set(groupingState)
    },
  }))

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData() {
    this.data.set(makeData(10000))
  }
}
