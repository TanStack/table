import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useStore } from '@tanstack/react-form'
import { z } from 'zod'
import { makeData } from './makeData'
import { useAppForm } from './form'
import type { Column, Table } from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

/**
 * `Person` includes optional recursive `subRows`; the form is a flat list only. Without `Omit`,
 * TanStack Form's `DeepKeys` chases that recursion and TypeScript reports TS2589.
 */
type FormRow = Omit<Person, 'subRows'>

// Define table features
const _features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
})

// Create column helper with features and row type
const columnHelper = createColumnHelper<typeof _features, FormRow>()

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

function App() {
  // Keep `data` typed as FormRow[] (not Person[]) so form field paths do not carry recursive `subRows` (TS2589).
  const initialData: Array<FormRow> = makeData(100)

  const form = useAppForm({
    defaultValues: {
      data: initialData,
    },
    onSubmit: ({ value }) => {
      alert(
        `Submitted ${value.data.length} records!\n\nFirst record: ${JSON.stringify(value.data[0], null, 2)}`,
      )
    },
    validators: {
      onChange: formSchema,
    },
  })

  // Create columns with form fields for editing
  const columns = React.useMemo(
    () =>
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
    [form],
  )

  // Subscribe only to array length to trigger re-renders when rows are added/removed
  // This avoids infinite loops from subscribing to the entire data array
  const dataLength = useStore(form.store, (state) => state.values.data.length)
  void dataLength // Used to trigger re-renders, value not needed

  // Create table using form state as data source
  // The table gets fresh data on each render, cells handle their own field state
  const table = useTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data: form.state.values.data,
    debugTable: true,
  })

  const refreshData = () => {
    const data: Array<FormRow> = makeData(100)
    form.reset({ data })
  }

  const stressTest = () => {
    const data: Array<FormRow> = makeData(200_000)
    form.reset({ data })
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
    <div className="demo-root">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {/* Form state indicators */}
        <div className="form-actions">
          <form.AppForm>
            <form.FormStateIndicator />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton label="Save All Changes" />
          </form.AppForm>
          <button
            type="button"
            onClick={addRow}
            className="demo-button success-action"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={refreshData}
            className="demo-button secondary-action"
          >
            Regenerate Data
          </button>
          <button
            type="button"
            onClick={stressTest}
            className="demo-button secondary-action"
          >
            Stress Test (200k rows)
          </button>
        </div>

        {/* Table */}
        <table.Subscribe
          selector={(state) => ({
            pagination: state.pagination,
            columnFilters: state.columnFilters,
          })}
        >
          {(tableState) => (
            <>
              <div className="spacer-sm" />
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <div>
                                <table.FlexRender header={header} />
                                {header.column.getCanFilter() ? (
                                  <div>
                                    <Filter
                                      column={header.column}
                                      table={table}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getAllCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              <table.FlexRender cell={cell} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="spacer-sm" />
              <div className="controls">
                <button
                  type="button"
                  className="demo-button demo-button-sm"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </button>
                <button
                  type="button"
                  className="demo-button demo-button-sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </button>
                <button
                  type="button"
                  className="demo-button demo-button-sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </button>
                <button
                  type="button"
                  className="demo-button demo-button-sm"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </button>
                <span className="inline-controls">
                  <div>Page</div>
                  <strong>
                    {(tableState.pagination.pageIndex + 1).toLocaleString()} of{' '}
                    {table.getPageCount().toLocaleString()}
                  </strong>
                </span>
                <span className="inline-controls">
                  | Go to page:
                  <input
                    type="number"
                    min="1"
                    max={table.getPageCount()}
                    defaultValue={tableState.pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0
                      table.setPageIndex(page)
                    }}
                    className="page-size-input"
                  />
                </span>
                <select
                  value={tableState.pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                {table.getRowCount().toLocaleString()} Rows
              </div>
            </>
          )}
        </table.Subscribe>
      </form>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, FormRow>
  table: Table<typeof _features, FormRow>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="filter-row">
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min`}
        className="filter-input"
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max`}
        className="filter-input"
      />
    </div>
  ) : (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="filter-select"
    />
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
