import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRenderDirective,
  columnVisibilityFeature,
  createExpandedRowModel,
  createTableHelper,
  flexRenderComponent,
  rowExpandingFeature,
} from '@tanstack/angular-table'
import { ReactiveFormsModule } from '@angular/forms'
import { JsonPipe, NgTemplateOutlet } from '@angular/common'
import { makeData } from './makeData'
import { ExpandableCell, ExpanderCell } from './expandable-cell'
import type { Person } from './makeData'
import type { ColumnDef, ExpandedState } from '@tanstack/angular-table'

const columns: Array<
  ColumnDef<
    {
      rowExpandingFeature: typeof rowExpandingFeature
      columnVisibilityFeature: typeof columnVisibilityFeature
    },
    Person
  >
> = [
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
  imports: [
    FlexRenderDirective,
    ReactiveFormsModule,
    JsonPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(10))
  readonly expanded = signal<ExpandedState>({})

  tableHelper = createTableHelper({
    _features: {
      rowExpandingFeature: rowExpandingFeature,
      columnVisibilityFeature: columnVisibilityFeature,
    },
    _rowModels: {
      expandedRowModel: createExpandedRowModel(),
    },
  })

  readonly table = this.tableHelper.injectTable(() => ({
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
}
