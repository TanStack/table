import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
} from '@angular/core'
import type { ColumnDef, ColumnResizeMode } from '@tanstack/angular-table'
import {
  columnResizingFeature,
  columnSizingFeature,
  FlexRenderDirective,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import type { Person } from './makeData'
import { makeData } from './makeData'
import { TableResizableCell, TableResizableHeader } from './resizable-cell'

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
  imports: [FlexRenderDirective, TableResizableCell, TableResizableHeader],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(200))

  readonly columnSizing = computed(() => this.table.getState().columnSizing)

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

  readonly columnSizingDebugInfo = computed(() =>
    JSON.stringify(
      {
        columnSizing: this.table.getState().columnSizing,
      },
      null,
      2,
    ),
  )
}
