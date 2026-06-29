import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { useTanStackTableDevtools } from '@tanstack/solid-table-devtools'
import { z } from 'zod'
import { makeData } from './makeData'
import { useAppForm } from './form'
import { createAppColumnHelper, createAppTable } from './table'
import type { appFeatures } from './table'
import type { Row } from '@tanstack/solid-table'
import type { Person } from './makeData'

type FormRow = Omit<Person, 'subRows'>

const columnHelper = createAppColumnHelper<FormRow>()

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

const formSchema = z.object({
  data: z.array(personSchema),
})

type FormData = z.infer<typeof formSchema>

function App() {
  return (
    <div class="demo-root">
      <FullTableFormExample />
      <div class="spacer-md" />
      <RowSubmitFormExample />
    </div>
  )
}

function FullTableFormExample() {
  const [data, setData] = createSignal<Array<FormRow>>(makeData(100))

  const form = useAppForm(() => ({
    defaultValues: {
      data: data(),
    },
    onSubmit: ({ value }: { value: FormData }) => {
      alert(
        `Submitted ${value.data.length} records!\n\nFirst record: ${JSON.stringify(value.data[0], null, 2)}`,
      )
    },
    validators: {
      onChange: formSchema,
    },
  }))

  createEffect(() => {
    form.reset({ data: data() })
  })

  const columns = createMemo(() =>
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
  )

  const table = createAppTable({
    key: 'with-tanstack-form-full-table',
    get columns() {
      return columns()
    },
    get data() {
      return data()
    },
    debugTable: true,
  })

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
    <section class="example-section">
      <h2 class="section-title">Single form around the table</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <div class="form-actions">
          <form.AppForm>
            <form.FormStateIndicator />
            <form.SubmitButton label="Save All Changes" />
          </form.AppForm>
          <button
            type="button"
            onClick={addRow}
            class="demo-button success-action"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={refreshData}
            class="demo-button secondary-action"
          >
            Regenerate Data
          </button>
          <button
            type="button"
            onClick={stressTest}
            class="demo-button secondary-action"
          >
            Stress Test (1M rows)
          </button>
        </div>

        <table.AppTable>
          <div class="spacer-sm" />
          <div class="scroll-container">
            <table>
              <thead>
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <table.AppHeader header={header}>
                            {(appHeader) => (
                              <th colSpan={appHeader.colSpan}>
                                <Show when={!appHeader.isPlaceholder}>
                                  <div
                                    class={
                                      appHeader.column.getCanSort()
                                        ? 'sortable-header'
                                        : undefined
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
                                </Show>
                              </th>
                            )}
                          </table.AppHeader>
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
          </div>

          <table.PaginationControls />
          <table.RowCount />
        </table.AppTable>
      </form>
    </section>
  )
}

function RowSubmitFormExample() {
  const [data, setData] = createSignal<Array<FormRow>>(makeData(100))

  const columns = createMemo(() =>
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
  )

  const table = createAppTable({
    key: 'with-tanstack-form-row-submit',
    get columns() {
      return columns()
    },
    get data() {
      return data()
    },
    debugTable: true,
  })

  useTanStackTableDevtools(table)

  const refreshData = () => {
    setData(makeData(100))
  }

  const saveRow = (originalRow: FormRow, value: FormRow) => {
    setData((old) =>
      old.map((row) => {
        return row === originalRow ? value : row
      }),
    )
  }

  return (
    <section class="example-section">
      <h2 class="section-title">Form submission per row</h2>
      <div class="form-actions">
        <button
          type="button"
          onClick={refreshData}
          class="demo-button secondary-action"
        >
          Regenerate Data
        </button>
      </div>

      <table.AppTable>
        <div class="spacer-sm" />
        <div class="scroll-container">
          <table>
            <thead>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <table.AppHeader header={header}>
                          {(appHeader) => (
                            <th colSpan={appHeader.colSpan}>
                              <Show when={!appHeader.isPlaceholder}>
                                <div
                                  class={
                                    appHeader.column.getCanSort()
                                      ? 'sortable-header'
                                      : undefined
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
                              </Show>
                            </th>
                          )}
                        </table.AppHeader>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => <RowSubmitTableRow row={row} onSave={saveRow} />}
              </For>
            </tbody>
          </table>
        </div>

        <table.PaginationControls />
        <table.RowCount />
      </table.AppTable>
    </section>
  )
}

function RowSubmitTableRow(props: {
  row: Row<typeof appFeatures, FormRow>
  onSave: (originalRow: FormRow, value: FormRow) => void
}) {
  const form = useAppForm(() => ({
    defaultValues: props.row.original,
    onSubmit: ({ value }: { value: FormRow }) => {
      props.onSave(props.row.original, value)
      form.reset(value)
    },
    validators: {
      onChange: personSchema,
    },
  }))

  createEffect(() => {
    form.reset(props.row.original)
  })

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
          <div class="row-action-cell">
            <Show when={form.state.isDirty}>
              <button
                type="button"
                disabled={!form.state.canSubmit || form.state.isSubmitting}
                onClick={() => void form.handleSubmit()}
                class="demo-button demo-button-sm primary-action"
              >
                {form.state.isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </Show>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <tr>
      <For each={props.row.getAllCells()}>
        {(cell) => <td>{renderCell(cell.column.id)}</td>}
      </For>
    </tr>
  )
}

export default App
