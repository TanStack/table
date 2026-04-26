import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnVisibilityFeature,
  createExpandedRowModel,
  flexRenderComponent,
  injectTable,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { ReactiveFormsModule } from '@angular/forms'
import { JsonPipe } from '@angular/common'
import { makeData } from './makeData'
import { ExpandableCell, ExpanderCell } from './expandable-cell'
import { SubComponent } from './sub-component/sub-component'
import type { Person } from './makeData'
import type { ColumnDef, ExpandedState } from '@tanstack/angular-table'

const _features = tableFeatures({
  rowExpandingFeature,
  columnVisibilityFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          if (!row.getCanExpand()) {
            return '🔵'
          }
          return flexRenderComponent(ExpanderCell, {
            inputs: {
              expanded: row.getIsExpanded(),
            },
            outputs: {
              click: row.getToggleExpandedHandler(),
            },
          })
        },
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: () => flexRenderComponent(ExpandableCell),
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
        header: 'More Info',
        columns: [
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
    ],
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender, ReactiveFormsModule, JsonPipe, SubComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(1_000))
  readonly expanded = signal<ExpandedState>({})

  readonly table = injectTable(() => ({
    debugTable: true,
    _features,
    _rowModels: {
      expandedRowModel: createExpandedRowModel<typeof _features, Person>(),
    },
    data: this.data(),
    columns,
    state: {
      expanded: this.expanded(),
    },
    onExpandedChange: (updater) =>
      typeof updater === 'function'
        ? this.expanded.update(updater)
        : this.expanded.set(updater),
    getRowCanExpand: () => true,
  }))

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(100_000))
}
