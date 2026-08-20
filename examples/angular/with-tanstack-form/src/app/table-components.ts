import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { injectTableContext } from './table'

@Component({
  selector: 'app-pagination-controls',
  template: `
    <div class="controls">
      <button
        type="button"
        class="demo-button demo-button-sm"
        (click)="table().firstPage()"
        [disabled]="!canPreviousPage()"
      >
        &lt;&lt;
      </button>
      <button
        type="button"
        class="demo-button demo-button-sm"
        (click)="table().previousPage()"
        [disabled]="!canPreviousPage()"
      >
        &lt;
      </button>
      <button
        type="button"
        class="demo-button demo-button-sm"
        (click)="table().nextPage()"
        [disabled]="!canNextPage()"
      >
        &gt;
      </button>
      <button
        type="button"
        class="demo-button demo-button-sm"
        (click)="table().lastPage()"
        [disabled]="!canLastPage()"
      >
        &gt;&gt;
      </button>
      <span class="inline-controls">
        <div>Page</div>
        <strong>
          {{ (table().atoms.pagination.get().pageIndex + 1).toLocaleString() }}
          of
          {{ pageCount() }}
        </strong>
      </span>
      <span class="inline-controls">
        | Go to page:
        <input
          class="page-size-input"
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
  readonly canLastPage = computed(() => this.table().getCanLastPage())
  readonly pageCount = computed(() =>
    this.table().getPageCount().toLocaleString(),
  )

  onPageChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    const page = value ? Number(value) - 1 : 0
    this.table().setPageIndex(page)
  }

  onPageSizeChange(event: Event) {
    this.table().setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}

@Component({
  selector: 'app-row-count',
  template: `
    <div class="row-count">Showing {{ length() }} of {{ rowCount() }} Rows</div>
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
