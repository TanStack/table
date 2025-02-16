import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  createExpandedRowModel,
  createPaginatedRowModel,
  createTableHelper,
  flexRenderComponent,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { ReactiveFormsModule } from '@angular/forms'
import { makeData } from './makeData'
import { ExpandableCell, ExpandableHeaderCell } from './expandable-cell'
import type { Person } from './makeData'
import type { ColumnDef, ExpandedState } from '@tanstack/angular-table'

const _features = tableFeatures({
  rowExpandingFeature: rowExpandingFeature,
  rowPaginationFeature: rowPaginationFeature,
  rowSelectionFeature: rowSelectionFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: () =>
      flexRenderComponent(ExpandableHeaderCell, {
        inputs: {
          label: 'First name',
        },
      }),
    cell: () => flexRenderComponent(ExpandableCell),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => `Visits`,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRenderDirective, ReactiveFormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(100, 5, 3))
  readonly expanded = signal<ExpandedState>({})

  readonly tableHelper = createTableHelper({
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
      expandedRowModel: createExpandedRowModel(),
    },
  })

  readonly table = this.tableHelper.injectTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    state: {
      expanded: this.expanded(),
    },
    onExpandedChange: (updater) =>
      typeof updater === 'function'
        ? this.expanded.update(updater)
        : this.expanded.set(updater),
    getSubRows: (row) => row.subRows,
    // filterFromLeafRows: true,
    // maxLeafRowFilterDepth: 0,
    debugTable: true,
  }))

  readonly rawExpandedState = computed(() =>
    JSON.stringify(this.expanded(), undefined, 2),
  )

  readonly rawRowSelectionState = computed(() =>
    JSON.stringify(this.table.getState().rowSelection, undefined, 2),
  )

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }
}
