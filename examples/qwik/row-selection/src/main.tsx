import '@builder.io/qwik/qwikloader.js'
import { $, component$, render, useSignal } from '@builder.io/qwik'
import './index.css'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/qwik-table'
import type { ColumnDef } from '@tanstack/qwik-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Array<Person> = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'Anxhi',
    lastName: 'Rroshi',
    age: 21,
    visits: 1,
    status: 'Unknown',
    progress: 99,
  },
]

const _features = tableFeatures({
  columnFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns: Array<ColumnDef<typeof _features, Person>> =
  columnHelper.columns([
    {
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange$={$(() => {
            console.log('toggleAllRowsSelected')
            table.toggleAllRowsSelected()
          })}
        />
      ),
      cell: ({ row, table }) => {
        const { id } = row
        return (
          <div class="px-1">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              // onChange: row.getToggleSelectedHandler(),
              onChange$={$(() => {
                // TODO: getting row instance from table works, but how can we call getToggleSelectedHandler() without getting qwik qrl error?
                const row = table.getRow(id)
                row.toggleSelected()
              })}
            />
          </div>
        )
      },
    },
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
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
  ])

const App = component$(() => {
  const rowSelection = useSignal({})

  const table = useTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      filteredRowModel: createFilteredRowModel(filterFns),
    },
    columns,
    data: defaultData,
    enableSorting: true,
    onRowSelectionChange: (updater) => {
      rowSelection.value =
        updater instanceof Function ? updater(rowSelection.value) : updater
    },
    state: {
      rowSelection: rowSelection.value,
    },
    enableRowSelection: true,
  })

  return (
    <div>
      <table class="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { column } = header
                const id = column.id
                return (
                  <th
                    key={id}
                    onClick$={$(() => {
                      const thisCol = table.getColumn(id)! // avoid serialization error
                      thisCol.toggleSorting()
                    })}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div class="h-2" />
      <br />
      <div>
        {Object.keys(rowSelection).length} of{' '}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
      <hr />
      <br />
      <div>
        <button
          class="border rounded p-2 mb-2"
          onClick$={() =>
            console.info(
              'table.getSelectedRowModel().flatRows',
              table.getSelectedRowModel().flatRows,
            )
          }
        >
          Log table.getSelectedRowModel().flatRows
        </button>
      </div>
      <div>
        <label>Row Selection State:</label>
        <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
      </div>
    </div>
  )
})

const IndeterminateCheckbox = component$<{
  indeterminate?: boolean
}>(({ indeterminate, ...rest }) => {
  const inputSig = useSignal<Element | undefined>()

  return <input type="checkbox" ref={inputSig} {...rest} />
})

render(document.getElementById('app') as HTMLElement, <App />)
