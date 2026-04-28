import { Component, computed, signal } from '@angular/core'
import {
  FlexRender,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { faker } from '@faker-js/faker'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type {
  Column,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const defaultColumns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('lastName', {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
})
export class App {
  readonly columns = signal([...defaultColumns])
  readonly data = signal<Array<Person>>(makeData(20))
  readonly columnVisibility = signal<ColumnVisibilityState>({})
  readonly columnOrder = signal<ColumnOrderState>([])
  readonly columnPinning = signal<ColumnPinningState>({
    left: [],
    right: [],
  })
  readonly split = signal(false)

  table = injectTable(() => ({
    _features,
    columns: this.columns(),
    data: this.data(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange' as const,
  }))

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.state().columnPinning)
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

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
}
