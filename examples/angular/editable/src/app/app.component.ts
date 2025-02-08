import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  createPaginatedRowModel,
  flexRenderComponent,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { EditableCell } from './editable-cell'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { ColumnDef, RowData, TableFeatures } from '@tanstack/angular-table'

declare module '@tanstack/angular-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const _features = tableFeatures({
  rowPaginationFeature,
})

const defaultColumn: Partial<ColumnDef<typeof _features, Person>> = {
  cell: ({ getValue, row, column, table }) => {
    const initialValue = getValue()

    return flexRenderComponent(EditableCell, {
      inputs: {
        value: initialValue,
      },
      outputs: {
        blur: (value) => {
          if (table.options.meta?.updateData) {
            table.options.meta.updateData(row.index, column.id, value)
          }
        },
      },
    })
  },
}

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => `<span>Last Name</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => `<span>Visits</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRenderDirective],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(10_000))
  readonly injector = inject(Injector)

  readonly autoResetPageIndex = signal(true)

  readonly table = injectTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel() as any,
    },
    defaultColumn: defaultColumn,
    debugTable: true,
    autoResetPageIndex: this.autoResetPageIndex(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        this.autoResetPageIndex.set(false)

        this.data.update((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          }),
        )

        afterNextRender(() => this.autoResetPageIndex.set(true), {
          injector: this.injector,
        })
      },
    },
  }))

  refresh() {
    this.data.set(makeData(10_000))
  }
}
