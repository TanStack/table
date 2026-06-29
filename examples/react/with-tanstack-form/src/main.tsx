import React from 'react'
import ReactDOM from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import { z } from 'zod'
import { makeData } from './makeData'
import { useAppForm } from './form'
import { createAppColumnHelper, useAppTable } from './table'
import type { appFeatures } from './table'
import type { Row } from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

/**
 * `Person` includes optional recursive `subRows`; the form is a flat list only. Without `Omit`,
 * TanStack Form's `DeepKeys` chases that recursion and TypeScript reports TS2589.
 */
type FormRow = Omit<Person, 'subRows'>

// Create column helper with features and row type
const columnHelper = createAppColumnHelper<FormRow>()

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
  return (
    <div className="demo-root">
      <FullTableFormExample />
      <div className="spacer-md" />
      <RowSubmitFormExample />
    </div>
  )
}

function FullTableFormExample() {
  // Keep `data` typed as FormRow[] (not Person[]) so form field paths do not carry recursive `subRows` (TS2589).
  const [data, setData] = React.useState<Array<FormRow>>(() => makeData(100))

  const form = useAppForm({
    defaultValues: {
      data,
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

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          footer: (props) => props.column.id,
          cell: ({ row }) => (
            <form.AppField name={`data[${row.index}].firstName`}>
              {(field) => <field.TextField />}
            </form.AppField>
          ),
        }),
        columnHelper.accessor('lastName', {
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
          cell: ({ row }) => (
            <form.AppField name={`data[${row.index}].lastName`}>
              {(field) => <field.TextField />}
            </form.AppField>
          ),
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
          cell: ({ row }) => (
            <form.AppField name={`data[${row.index}].age`}>
              {(field) => <field.NumberField />}
            </form.AppField>
          ),
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          footer: (props) => props.column.id,
          cell: ({ row }) => (
            <form.AppField name={`data[${row.index}].visits`}>
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
            <form.AppField name={`data[${row.index}].progress`}>
              {(field) => <field.NumberField />}
            </form.AppField>
          ),
        }),
      ]),
    [form],
  )

  const table = useAppTable(
    {
      key: 'with-tanstack-form-full-table',
      columns,
      data,
      debugTable: true,
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  const refreshData = () => {
    setData(makeData(100))
  }

  const stressTest = () => {
    setData(makeData(1_000_000))
  }

  const addRow = () => {
    setData([
      {
        firstName: '',
        lastName: '',
        age: 0,
        visits: 0,
        progress: 0,
        status: 'single',
      },
      ...form.state.values.data,
    ])
    table.firstPage()
  }

  return (
    <section className="example-section">
      <h2 className="section-title">Single form around the table</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="form-actions">
          <form.AppForm>
            <form.FormStateIndicator />
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
            Stress Test (1M rows)
          </button>
        </div>

        <table.AppTable
          selector={(state) => ({
            columnFilters: state.columnFilters,
            pagination: state.pagination,
            sorting: state.sorting,
          })}
        >
          {() => (
            <>
              <div className="spacer-sm" />
              <div className="scroll-container">
                <table>
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <table.AppHeader header={header} key={header.id}>
                            {(appHeader) => (
                              <th
                                key={appHeader.id}
                                colSpan={appHeader.colSpan}
                              >
                                {appHeader.isPlaceholder ? null : (
                                  <div
                                    className={
                                      appHeader.column.getCanSort()
                                        ? 'sortable-header'
                                        : ''
                                    }
                                    onClick={appHeader.column.getToggleSortingHandler()}
                                    title={
                                      appHeader.column.getCanSort()
                                        ? appHeader.column.getNextSortingOrder() ===
                                          'asc'
                                          ? 'Sort ascending'
                                          : appHeader.column.getNextSortingOrder() ===
                                              'desc'
                                            ? 'Sort descending'
                                            : 'Clear sort'
                                        : undefined
                                    }
                                  >
                                    <appHeader.FlexRender />
                                    <appHeader.SortIndicator />
                                    <appHeader.ColumnFilter />
                                  </div>
                                )}
                              </th>
                            )}
                          </table.AppHeader>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getAllCells().map((cell) => (
                          <td key={cell.id}>
                            <table.FlexRender cell={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <table.PaginationControls />
              <table.RowCount />
            </>
          )}
        </table.AppTable>
      </form>
    </section>
  )
}

function RowSubmitFormExample() {
  const [data, setData] = React.useState<Array<FormRow>>(() => makeData(100))

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('lastName', {
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
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
        columnHelper.display({
          id: 'save',
          header: '',
          cell: () => null,
        }),
      ]),
    [],
  )

  const table = useAppTable(
    {
      key: 'with-tanstack-form-row-submit',
      columns,
      data,
      debugTable: true,
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  const refreshData = () => {
    setData(makeData(100))
  }

  const saveRow = React.useCallback((originalRow: FormRow, value: FormRow) => {
    setData((old) =>
      old.map((row) => {
        return row === originalRow ? value : row
      }),
    )
  }, [])

  return (
    <section className="example-section">
      <h2 className="section-title">Form submission per row</h2>
      <div className="form-actions">
        <button
          type="button"
          onClick={refreshData}
          className="demo-button secondary-action"
        >
          Regenerate Data
        </button>
      </div>
      <table.AppTable
        selector={(state) => ({
          columnFilters: state.columnFilters,
          pagination: state.pagination,
          sorting: state.sorting,
        })}
      >
        {() => (
          <>
            <div className="spacer-sm" />
            <div className="scroll-container">
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <table.AppHeader header={header} key={header.id}>
                          {(appHeader) => (
                            <th key={appHeader.id} colSpan={appHeader.colSpan}>
                              {appHeader.isPlaceholder ? null : (
                                <div
                                  className={
                                    appHeader.column.getCanSort()
                                      ? 'sortable-header'
                                      : ''
                                  }
                                  onClick={appHeader.column.getToggleSortingHandler()}
                                  title={
                                    appHeader.column.getCanSort()
                                      ? appHeader.column.getNextSortingOrder() ===
                                        'asc'
                                        ? 'Sort ascending'
                                        : appHeader.column.getNextSortingOrder() ===
                                            'desc'
                                          ? 'Sort descending'
                                          : 'Clear sort'
                                      : undefined
                                  }
                                >
                                  <appHeader.FlexRender />
                                  <appHeader.SortIndicator />
                                  <appHeader.ColumnFilter />
                                </div>
                              )}
                            </th>
                          )}
                        </table.AppHeader>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <RowSubmitTableRow
                      key={row.id}
                      row={row}
                      onSave={saveRow}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <table.PaginationControls />
            <table.RowCount />
          </>
        )}
      </table.AppTable>
    </section>
  )
}

function RowSubmitTableRow({
  row,
  onSave,
}: {
  row: Row<typeof appFeatures, FormRow>
  onSave: (originalRow: FormRow, value: FormRow) => void
}) {
  const form = useAppForm({
    defaultValues: row.original,
    onSubmit: ({ value }) => {
      onSave(row.original, value)
      form.reset(value)
    },
    validators: {
      onChange: personSchema,
    },
  })

  React.useEffect(() => {
    form.reset(row.original)
  }, [form, row.original])

  const renderCell = (columnId: string) => {
    switch (columnId) {
      case 'firstName':
        return (
          <form.AppField name="firstName">
            {(field) => <field.TextField />}
          </form.AppField>
        )
      case 'lastName':
        return (
          <form.AppField name="lastName">
            {(field) => <field.TextField />}
          </form.AppField>
        )
      case 'age':
        return (
          <form.AppField name="age">
            {(field) => <field.NumberField />}
          </form.AppField>
        )
      case 'visits':
        return (
          <form.AppField name="visits">
            {(field) => <field.NumberField />}
          </form.AppField>
        )
      case 'status':
        return (
          <form.AppField name="status">
            {(field) => <field.SelectField />}
          </form.AppField>
        )
      case 'progress':
        return (
          <form.AppField name="progress">
            {(field) => <field.NumberField />}
          </form.AppField>
        )
      case 'save':
        return (
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isDirty: state.isDirty,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isDirty, isSubmitting }) => (
              <div className="row-action-cell">
                {isDirty ? (
                  <button
                    type="button"
                    disabled={!canSubmit || isSubmitting}
                    onClick={() => form.handleSubmit()}
                    className="demo-button demo-button-sm primary-action"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                ) : null}
              </div>
            )}
          </form.Subscribe>
        )
      default:
        return null
    }
  }

  return (
    <tr>
      {row.getAllCells().map((cell) => (
        <td key={cell.id}>{renderCell(cell.column.id)}</td>
      ))}
    </tr>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin(), formDevtoolsPlugin()]} />
  </React.StrictMode>,
)
