import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
} from '@angular/core'
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import { TableResizableCells } from './resizable-cell/resizable-cell'
import type { Person } from './makeData'
import type { ColumnDef, ColumnResizeMode } from '@tanstack/angular-table'

const _features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => 'Last Name',
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'visits',
        header: () => 'Visits',
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
    ],
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender, TableResizableCells],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(200))

  readonly table = injectTable(() => ({
    data: this.data(),
    _features,
    columns: defaultColumns,
    columnResizeMode: 'onChange' as ColumnResizeMode,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  readonly columnSizing = this.table.Subscribe({
    selector: (state) => state.columnSizing,
  })

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  readonly columnSizeVars = computed(() => {
    void this.columnSizing()
    const headers = untracked(() => this.table.getFlatHeaders())
    const colSizes: { [key: string]: number } = {}
    let i = headers.length
    while (--i >= 0) {
      const header = headers[i]
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  })

  readonly columnSizingDebugInfo = computed(() =>
    JSON.stringify(
      {
        columnSizing: this.columnSizing(),
      },
      null,
      2,
    ),
  )
}
