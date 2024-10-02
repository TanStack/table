import { Component, computed, signal } from '@angular/core'
import {
  type Column,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnVisibilityState,
  FlexRenderDirective,
  createCoreRowModel,
  injectTable,
} from '@tanstack/angular-table'
import { faker } from '@faker-js/faker'
import { NgStyle, NgTemplateOutlet, SlicePipe } from '@angular/common'
import { makeData } from './makeData'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultColumns: Array<ColumnDef<any, Person>> = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  },
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRenderDirective, SlicePipe, NgTemplateOutlet, NgStyle],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly columns = signal([...defaultColumns])
  readonly data = signal<Array<Person>>(makeData(30))
  readonly columnVisibility = signal<ColumnVisibilityState>({})
  readonly columnOrder = signal<ColumnOrderState>([])
  readonly columnPinning = signal<ColumnPinningState>({})
  readonly split = signal(false)

  table = injectTable(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: createCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange',
  }))

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.getState().columnPinning)
  })

  readonly getCommonPinningStyles = (
    column: Column<any, Person>,
  ): Record<string, any> => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px gray inset'
          : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: `${column.getSize()}px`,
      zIndex: isPinned ? 1 : 0,
    }
  }

  randomizeColumns() {
    this.table.setColumnOrder(
      faker.helpers.shuffle(this.table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  rerender() {
    this.data.set(makeData(5000))
  }
}
