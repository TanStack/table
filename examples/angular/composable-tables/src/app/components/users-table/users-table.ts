import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgComponentOutlet } from '@angular/common'
import {
  FlexRender,
  TanStackTable,
  TanStackTableCell,
  TanStackTableHeader,
  flexRenderComponent,
} from '@tanstack/angular-table'
import { makeData } from '../../makeData'
import { createAppColumnHelper, injectAppTable } from '../../table'
import type { Person } from '../../makeData'

export const personColumnHelper = createAppColumnHelper<Person>()

@Component({
  selector: 'users-table',
  templateUrl: './users-table.html',
  imports: [
    NgComponentOutlet,
    FlexRender,
    TanStackTable,
    TanStackTableHeader,
    TanStackTableCell,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTable {
  readonly data = signal(makeData(5000))

  readonly columns = personColumnHelper.columns([
    personColumnHelper.accessor('firstName', {
      header: 'First Name',
      footer: ({ header }) => flexRenderComponent(header.FooterColumnId),
      cell: ({ cell }) => flexRenderComponent(cell.TextCell),
    }),
    personColumnHelper.accessor('lastName', {
      header: 'Last Name',
      footer: ({ header }) => flexRenderComponent(header.FooterColumnId),
      cell: ({ cell }) => flexRenderComponent(cell.TextCell),
    }),
    personColumnHelper.accessor('age', {
      header: 'Age',
      footer: ({ header }) => flexRenderComponent(header.FooterSum),
      cell: ({ cell }) => flexRenderComponent(cell.NumberCell),
    }),
    personColumnHelper.accessor('visits', {
      header: 'Visits',
      footer: ({ header }) => flexRenderComponent(header.FooterSum),
      cell: ({ cell }) => flexRenderComponent(cell.NumberCell),
    }),
    personColumnHelper.accessor('status', {
      header: 'Status',
      footer: ({ header }) => flexRenderComponent(header.FooterColumnId),
      cell: ({ cell }) => flexRenderComponent(cell.StatusCell),
    }),
    personColumnHelper.accessor('progress', {
      header: 'Progress',
      footer: ({ header }) => flexRenderComponent(header.FooterSum),
      cell: ({ cell }) => flexRenderComponent(cell.ProgressCell),
    }),
    personColumnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ cell }) => flexRenderComponent(cell.RowActionsCell),
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
}
