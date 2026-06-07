import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { injectTableContext } from '../table'

@Component({
  selector: 'app-table-toolbar',
  template: `
    <div class="table-toolbar">
      <h2>{{ title() }}</h2>
      <div class="table-toolbar-actions">
        @if (onRefresh(); as onRefresh) {
          <button (click)="onRefresh()">Regenerate Data</button>
        }
        @if (onStressTest(); as onStressTest) {
          <button (click)="onStressTest()">Stress Test (200k rows)</button>
        }
        <button (click)="table().resetColumnFilters()">Clear Filters</button>
        <button (click)="table().resetSorting()">Clear Sorting</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbar {
  readonly title = input.required<string>()
  readonly onRefresh = input<() => void>()
  readonly onStressTest = input<() => void>()

  readonly table = injectTableContext()

  constructor() {
    this.table().resetColumnFilters()
  }
}

@Component({
  selector: 'app-row-count',
  template: `
    <div class="row-count">Showing {{ length() }} of {{ rowCount() }} rows</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowCount {
  readonly table = injectTableContext()

  readonly length = computed(() =>
    this.table().getRowModel().rows.length.toLocaleString(),
  )

  readonly rowCount = computed(() =>
    this.table().getRowCount().toLocaleString(),
  )
}

/**
 * Pagination controls for the table
 */
@Component({
  selector: 'app-pagination-controls',
  template: `
    <div class="pagination">
      <button (click)="table().firstPage()" [disabled]="!canPreviousPage()">
        &lt;&lt;
      </button>
      <button (click)="table().previousPage()" [disabled]="!canPreviousPage()">
        &lt;
      </button>
      <button (click)="table().nextPage()" [disabled]="!canNextPage()">
        &gt;
      </button>
      <button (click)="table().lastPage()" [disabled]="!canNextPage()">
        &gt;&gt;
      </button>
      <span>
        Page
        <strong>
          {{ (table().atoms.pagination.get().pageIndex + 1).toLocaleString() }}
          of
          {{ pageCount() }}
        </strong>
      </span>
      <span>
        | Go to page:
        <input
          type="number"
          min="1"
          [max]="table().getPageCount()"
          [value]="table().atoms.pagination.get().pageIndex + 1"
          (change)="onPageChange($event)"
        />
      </span>
      <select
        [value]="table().atoms.pagination.get().pageSize"
        (change)="onPageSizeChange($event)"
      >
        @for (size of pageSizes; track size) {
          <option [value]="size">Show {{ size }}</option>
        }
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControls {
  readonly table = injectTableContext()

  readonly pageSizes = [10, 20, 30, 40, 50]

  readonly canPreviousPage = computed(() => this.table().getCanPreviousPage())
  readonly canNextPage = computed(() => this.table().getCanNextPage())
  readonly pageCount = computed(() =>
    this.table().getPageCount().toLocaleString(),
  )

  onPageChange(event: Event) {
    const target = event.target as HTMLInputElement
    const page = target.value ? Number(target.value) - 1 : 0
    this.table().setPageIndex(page)
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement
    this.table().setPageSize(Number(target.value))
  }
}
