import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
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
  readonly data = signal(makeData(1_000))
  readonly grouping = signal<GroupingState>([])

  readonly table = injectTable(() => ({
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
    // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
    // enableGrouping: false, // disable grouping for every column; default true
    // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
    // manualGrouping: true, // pass rows that are already grouped and aggregated, for example from a server
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(1_000_000))
}
