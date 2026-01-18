import { Component, signal } from '@angular/core'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  injectTable,
  isFunction,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { densityPlugin } from './density/density-feature'
import { makeData } from './makeData'
import type { DensityState } from './density/density-feature'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowPaginationFeature,
  densityPlugin, // pass in our plugin just like any other stock feature
})
const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly data = signal(makeData(1000))
  readonly density = signal<DensityState>('md')

  readonly table = injectTable(() => ({
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel<typeof _features, Person>(),
    },
    columns,
    data: this.data(),
    debugTable: true,
    state: {
      // passing the density state to the table, TS is still happy :)
      density: this.density(),
    },
    // using the new onDensityChange option, TS is still happy :)
    onDensityChange: (updater) =>
      isFunction(updater)
        ? this.density.update(updater)
        : this.density.set(updater),
  }))
}
