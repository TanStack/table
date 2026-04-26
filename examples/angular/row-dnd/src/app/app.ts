import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnSizingFeature,
  columnVisibilityFeature,
  flexRenderComponent,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'
import { JsonPipe } from '@angular/common'
import { DragHandleCell } from './drag-handle-cell/drag-handle-cell'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { CdkDragDrop } from '@angular/cdk/drag-drop'
import type { ColumnDef } from '@tanstack/angular-table'

const _tableFeatures = tableFeatures({
  rowPaginationFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const defaultColumns: Array<ColumnDef<typeof _tableFeatures, Person>> = [
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
  imports: [FlexRender, CdkDropList, CdkDrag, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(1_000))

  readonly table = injectTable(() => {
    return {
      _features: _tableFeatures,
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

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(100_000))
}
