import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  TanStackTable,
  TanStackTableHeader,
} from '@tanstack/angular-table'
import { NgComponentOutlet } from '@angular/common'
import { createAppColumnHelper, injectAppTable } from './table'
import { makeData } from './makeData'
import type { Person, Product } from './makeData'

// Create column helpers with TFeatures already bound - only need TData!
const personColumnHelper = createAppColumnHelper<Person>()
const productColumnHelper = createAppColumnHelper<Product>()

@Component({
  selector: 'app-root',
  imports: [FlexRender, TanStackTableHeader, NgComponentOutlet, TanStackTable],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal(makeData(5000))

  readonly columns = personColumnHelper.columns([
    personColumnHelper.accessor('firstName', {
      header: 'First Name',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.TextCell />,
    }),
    personColumnHelper.accessor('lastName', {
      header: 'Last Name',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.TextCell />,
    }),
    personColumnHelper.accessor('age', {
      header: 'Age',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.NumberCell />,
    }),
    personColumnHelper.accessor('visits', {
      header: 'Visits',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.NumberCell />,
    }),
    personColumnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.StatusCell />,
    }),
    personColumnHelper.accessor('progress', {
      header: 'Progress',
      footer: (props) => props.column.id,
      // cell: ({ cell }) => <cell.ProgressCell />,
    }),
    personColumnHelper.display({
      id: 'actions',
      header: 'Actions',
      // cell: ({ cell }) => <cell.RowActionsCell />,
    }),
  ])

  table = injectAppTable(() => ({
    columns: this.columns,
    data: this.data(),
    debugTable: true,
    // more table options
  }))

  onRefresh = () => {
    this.data.set([...makeData(5000)])
  }

  constructor() {}

  rerender() {}
}
