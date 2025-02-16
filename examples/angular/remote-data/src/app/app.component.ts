import { HttpParams } from '@angular/common/http'
import {
  ChangeDetectionStrategy,
  Component,
  ResourceStatus,
  linkedSignal,
  resource,
  signal,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  FlexRenderDirective,
  createTableHelper,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table'
import type { WritableSignal } from '@angular/core'

export type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

const _features = tableFeatures({
  rowPaginationFeature,
  globalFilteringFeature,
  rowSortingFeature,
})

const tableHelper = createTableHelper({
  _features,
  TData: {} as Todo,
})

const columnHelper = tableHelper.createColumnHelper<Todo>()

type TodoResponse = { items: Array<Todo>; totalCount: number }

@Component({
  selector: 'app-root',
  imports: [FlexRenderDirective, ReactiveFormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly pagination = signal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  })

  readonly sorting = signal<SortingState>([{ id: 'id', desc: false }])
  readonly globalFilter = signal<string | null>(null)
  readonly data = resource({
    request: () => ({
      page: this.pagination(),
      globalFilter: this.globalFilter(),
      sorting: this.sorting(),
    }),
    loader: ({ request: { page, globalFilter, sorting }, abortSignal }) => {
      let httpParams = new HttpParams({
        fromObject: {
          _page: page.pageIndex + 1,
          _limit: page.pageSize,
        },
      })
      if (globalFilter) {
        httpParams = httpParams.set('title_like', globalFilter)
      }
      if (sorting.length) {
        const keys: Array<string> = []
        const orders: Array<string> = []
        for (const sort of sorting) {
          keys.push(sort.id)
          orders.push(sort.desc ? 'desc' : 'asc')
        }
        httpParams = httpParams
          .set('_sort', keys.join(','))
          .set('_order', orders.join(','))
      }

      return fetch(
        `https://jsonplaceholder.typicode.com/todos?${httpParams.toString()}`,
      ).then(async (res) => {
        const items: Array<Todo> = await res.json()
        return {
          items,
          totalCount: Number(res.headers.get('X-Total-Count')),
        } satisfies TodoResponse
      }) as Promise<TodoResponse>
    },
  })

  readonly columns = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: (info) => info.getValue(),
      header: () => 'Id',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('title', {
      id: 'title',
      cell: (info) => info.getValue(),
      header: () => 'Title',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('completed', {
      id: 'completed',
      cell: (info) => (info.getValue() ? `✅` : `❌`),
      header: () => 'Completed',
      footer: (props) => props.column.id,
    }),
  ] as Array<ColumnDef<typeof _features, Todo>>

  // Keep previous value
  readonly dataWithLatest: WritableSignal<TodoResponse> = linkedSignal({
    source: () => ({
      value: this.data.value(),
      status: this.data.status(),
    }),
    computation: (source, previous) => {
      if (previous && source.status === ResourceStatus.Loading)
        return previous.value
      return source.value ?? { items: [], totalCount: 0 }
    },
  })

  readonly table = tableHelper.injectTable(() => {
    const data = this.dataWithLatest()
    return {
      data: data.items,
      columns: this.columns,
      state: {
        pagination: this.pagination(),
        globalFilter: this.globalFilter(),
        sorting: this.sorting(),
      },
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      rowCount: data.totalCount,
      onPaginationChange: (updater) =>
        typeof updater === 'function'
          ? this.pagination.update(updater)
          : this.pagination.set(updater),
      onSortingChange: (updater) => {
        typeof updater === 'function'
          ? this.sorting.update(updater)
          : this.sorting.set(updater)
      },
      onGlobalFilterChange: (updater) => {
        typeof updater === 'function'
          ? this.globalFilter.update(updater)
          : this.globalFilter.set(updater)
        this.pagination.update((page) => ({
          ...page,
          pageIndex: 0,
        }))
      },
    }
  })

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }
}
