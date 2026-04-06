import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createMemo } from 'solid-js'
import { z } from 'zod'
import { makeData } from './makeData'
import { useAppForm } from './form'
import type { Column, Table } from '@tanstack/solid-table'
import type { Person } from './makeData'

// Define table features
const _features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
})

// Create column helper with features and Person type
const columnHelper = createColumnHelper<typeof _features, Person>()

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

// Form data schema
const formSchema = z.object({
  data: z.array(personSchema),
})

type FormData = z.infer<typeof formSchema>

function App() {
  // Initialize form with makeData
  const form = useAppForm(() => ({
    defaultValues: {
      data: makeData(100),
    } as FormData,
    onSubmit: ({ value }: { value: FormData }) => {
      alert(
        `Submitted ${value.data.length} records!\n\nFirst record: ${JSON.stringify(value.data[0], null, 2)}`,
      )
    },
    validators: {
      onChange: formSchema,
    },
  }))

  // Create columns with form fields for editing
  // Use createMemo since columns depend on `form` (which is reactive)
  const columns = createMemo(() =>
    columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: 'First Name',
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].firstName`}
            validators={{
              onChange: z.string().min(1, 'Required'),
            }}
          >
            {(field) => <field.TextField />}
          </form.AppField>
        ),
      }),
      columnHelper.accessor('lastName', {
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].lastName`}
            validators={{
              onChange: z.string().min(1, 'Required'),
            }}
          >
            {(field) => <field.TextField />}
          </form.AppField>
        ),
      }),
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].age`}
            validators={{
              onChange: z.number().min(0, 'Must be positive'),
            }}
          >
            {(field) => <field.NumberField />}
          </form.AppField>
        ),
      }),
      columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].visits`}
            validators={{
              onChange: z.number().min(0, 'Must be positive'),
            }}
          >
            {(field) => <field.NumberField />}
          </form.AppField>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField name={`data[${row.index}].status`}>
            {(field) => <field.SelectField />}
          </form.AppField>
        ),
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: (props) => props.column.id,
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].progress`}
            validators={{
              onChange: z.number().min(0).max(100, 'Must be 0-100'),
            }}
          >
            {(field) => <field.NumberField />}
          </form.AppField>
        ),
      }),
    ]),
  )

  // Create table using form state as data source
  const table = createTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    get columns() {
      return columns()
    },
    get data() {
      return form.state.values.data
    },
    debugTable: true,
  })

  const refreshData = () => {
    form.reset({ data: makeData(100) })
  }

  const addRow = () => {
    form.pushFieldValue('data', {
      firstName: '',
      lastName: '',
      age: 0,
      visits: 0,
      progress: 0,
      status: 'single',
    })
  }

  return (
    <div class="p-2">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        {/* Form state indicators */}
        <div class="mb-4 flex items-center gap-4">
          <form.AppForm>
            <form.FormStateIndicator />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton label="Save All Changes" />
          </form.AppForm>
          <button
            type="button"
            onClick={addRow}
            class="border rounded px-4 py-2 bg-green-500 text-white"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={refreshData}
            class="border rounded px-4 py-2 bg-gray-500 text-white"
          >
            Reset Data
          </button>
        </div>

        {/* Table */}
        <div>
          <div class="h-2" />
          <table>
            <thead>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          <Show when={!header.isPlaceholder}>
                            <div>
                              <table.FlexRender header={header} />
                              <Show when={header.column.getCanFilter()}>
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              </Show>
                            </div>
                          </Show>
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr>
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <td>
                          <table.FlexRender cell={cell} />
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>

          {/* Pagination controls */}
          <div class="h-2" />
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              type="button"
              class="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              type="button"
              class="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              type="button"
              class="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span class="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.store.state.pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span class="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                value={table.store.state.pagination.pageIndex + 1}
                onInput={(e) => {
                  const page = e.currentTarget.value
                    ? Number(e.currentTarget.value) - 1
                    : 0
                  table.setPageIndex(page)
                }}
                class="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.store.state.pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.currentTarget.value))
              }}
            >
              <For each={[10, 20, 30, 40, 50]}>
                {(pageSize) => (
                  <option value={pageSize}>Show {pageSize}</option>
                )}
              </For>
            </select>
          </div>
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </div>
        </div>
      </form>
    </div>
  )
}

function Filter(props: {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  const firstValue = () =>
    props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id)

  const columnFilterValue = () => props.column.getFilterValue()

  return (
    <Show
      when={typeof firstValue() === 'number'}
      fallback={
        <input
          type="text"
          value={(columnFilterValue() ?? '') as string}
          onInput={(e) => props.column.setFilterValue(e.currentTarget.value)}
          placeholder="Search..."
          class="w-36 border shadow rounded"
        />
      }
    >
      <div class="flex space-x-2">
        <input
          type="number"
          value={
            (columnFilterValue() as [number, number] | undefined)?.[0] ?? ''
          }
          onInput={(e) =>
            props.column.setFilterValue((old: [number, number]) => [
              e.currentTarget.value,
              old?.[1],
            ])
          }
          placeholder="Min"
          class="w-24 border shadow rounded"
        />
        <input
          type="number"
          value={
            (columnFilterValue() as [number, number] | undefined)?.[1] ?? ''
          }
          onInput={(e) =>
            props.column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.currentTarget.value,
            ])
          }
          placeholder="Max"
          class="w-24 border shadow rounded"
        />
      </div>
    </Show>
  )
}

export default App
