import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createTableHelper,
  flexRenderComponent,
  rowPaginationFeature,
} from '@tanstack/angular-table'
import { CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'
import { JsonPipe } from '@angular/common'
import { DragHandleCell } from './drag-handle-cell'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { CdkDragDrop } from '@angular/cdk/drag-drop'
import type { ColumnDef } from '@tanstack/angular-table'

const defaultColumns: Array<
  ColumnDef<
    {
      rowPaginationFeature: typeof rowPaginationFeature
      columnSizingFeature: typeof columnSizingFeature,
      columnVisibilityFeature: typeof columnVisibilityFeature,
    },
    Person
  >
> = [
  {
    id: 'drag-handle',
    header: 'Move',
    cell: () => flexRenderComponent(DragHandleCell),
    size: 60,
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => `Last Name`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
  {
    accessorKey: 'visits',
    header: () => `Visits`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRenderDirective, CdkDropList, CdkDrag, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(20))

  readonly tableHelper = createTableHelper({
    _features: {
      rowPaginationFeature,
      columnSizingFeature,
      columnVisibilityFeature
    },
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
    },
  })

  readonly table = this.tableHelper.injectTable(() => {
    return {
      data: this.data(),
      columns: defaultColumns,
      getRowId: (row) => row.userId,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    }
  })

  readonly sortedIds = computed(() => this.data().map((data) => data.userId))

  drop(event: CdkDragDrop<Array<Person>>) {
    const data = [...this.data()]
    moveItemInArray(data, event.previousIndex, event.currentIndex)
    this.data.set(data)
  }
}
