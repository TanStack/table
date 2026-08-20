import { ChangeDetectionStrategy, Component, input, model } from '@angular/core'
import {
  FlexRender,
  columnVisibilityFeature,
  createPaginatedRowModel,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import type { ColumnDef, PaginationState } from '@tanstack/angular-table'
import type { Person } from '../makeData'

const features = tableFeatures({
  rowPaginationFeature,
  columnVisibilityFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

@Component({
  selector: 'app-person-table',
  templateUrl: 'person-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlexRender],
})
export class PersonTable {
  readonly data = input.required<Array<Person>>()

  readonly pagination = model.required<PaginationState>()

  readonly columns: Array<ColumnDef<typeof features, Person>> = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'lastName',
      header: () => `Last Name`,
      cell: (info) => info.getValue(),
    },
  ]

  readonly table = injectTable(() => {
    return {
      features,
      data: this.data(),
      columns: this.columns,
      state: {
        pagination: this.pagination(),
      },
      onPaginationChange: (updaterOrValue) => {
        typeof updaterOrValue === 'function'
          ? this.pagination.update(updaterOrValue)
          : this.pagination.set(updaterOrValue)
      },
      debugTable: true,
    }
  })

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }
}
