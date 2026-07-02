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
import type { Person } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'

/**
 * This example implements column resizing with fine-grained signals!
 * All column widths flow through CSS variables computed in ONE signal bound
 * to the <table> element's style, so a resize tick is a single style write
 */

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
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
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(200))

  readonly table = injectTable(() => ({
    data: this.data(),
    features,
    columns: defaultColumns,
    columnResizeMode: 'onChange' as const,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  /**
   * All column widths flow through CSS variables computed in ONE signal and
   * bound to the <table> element's style. The explicit `columnSizing` read
   * establishes the signal dependency; the header walk runs `untracked` so
   * no other reads register. Header and data cells reference the variables,
   * so a resize tick updates only this one style binding.
   */
  readonly tableStyle = computed(() => {
    void this.table.atoms.columnSizing.get()
    return untracked(() => {
      const styles: Record<string, string> = { display: 'grid' }
      for (const header of this.table.getFlatHeaders()) {
        styles[`--header-${header.id}-size`] = `${header.getSize()}`
        styles[`--col-${header.column.id}-size`] = `${header.column.getSize()}`
      }
      styles['width'] = `${this.table.getTotalSize()}px`
      return styles
    })
  })

  readonly stringifiedState = computed(() =>
    JSON.stringify(this.table.store.get(), null, 2),
  )

  refreshData = () => this.data.set(makeData(200))
  stressTest = () => this.data.set(makeData(5_000))
}
