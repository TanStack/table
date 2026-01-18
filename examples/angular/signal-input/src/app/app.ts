import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { makeData } from './makeData'
import { PersonTable } from './person-table/person-table'
import type { PaginationState } from '@tanstack/angular-table'

@Component({
  selector: 'app-root',
  imports: [PersonTable],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  data = signal(makeData(10000))
  pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  refreshData() {
    this.data.set(makeData(10000))
  }

  previousPage(): void {
    this.pagination.update((pagination) => ({
      ...pagination,
      pageIndex: pagination.pageIndex - 1,
    }))
  }

  nextPage(): void {
    this.pagination.update((pagination) => ({
      ...pagination,
      pageIndex: pagination.pageIndex + 1,
    }))
  }
}
