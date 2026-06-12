import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectForm, injectStore } from '@tanstack/angular-form'
import { z } from 'zod'
import { makeData } from './makeData'
import type { Person } from './makeData'

// Define table features
const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

// Zod validation schema for a person
const personSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z
    .number()
    .min(0, 'Age must be positive')
    .max(150, 'Age must be realistic'),
  visits: z.number().min(0, 'Visits must be positive'),
  progress: z
    .number()
    .min(0, 'Progress must be 0-100')
    .max(100, 'Progress must be 0-100'),
  status: z.enum(['relationship', 'complicated', 'single']),
})

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Create table using form state as data source.
  readonly data = signal(makeData(100))
  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    debugTable: true,
  }))
  readonly validation = computed(() =>
    z.array(personSchema).safeParse(this.data()),
  )
  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  update(rowIndex: number, key: keyof Person, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value
    this.data.update((rows) =>
      rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]:
                key === 'age' || key === 'visits' || key === 'progress'
                  ? Number(value)
                  : value,
            }
          : row,
      ),
    )
  }
  addRow() {
    this.data.update((rows) => [
      ...rows,
      {
        firstName: '',
        lastName: '',
        age: 0,
        visits: 0,
        progress: 0,
        status: 'single',
      },
    ])
  }
  refreshData = () => this.data.set(makeData(100))
  stressTest = () => this.data.set(makeData(200_000))
  submit() {
    alert(`Submitted ${this.data().length} records!`)
  }
}
