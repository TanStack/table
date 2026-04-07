<script lang="ts">
  import {
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createTable,
    filterFns,
    FlexRender,
    renderComponent,
    rowPaginationFeature,
    Subscribe,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import type { Column, Table } from '@tanstack/svelte-table'
  import { z } from 'zod'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import { createAppForm } from './form'
  import TextFieldCell from './TextFieldCell.svelte'
  import NumberFieldCell from './NumberFieldCell.svelte'
  import SelectFieldCell from './SelectFieldCell.svelte'
  import './index.css'

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

  // Initialize form with makeData
  const form = createAppForm(() => ({
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
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(TextFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'firstName',
        }),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(TextFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'lastName',
        }),
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(NumberFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'age',
        }),
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(NumberFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'visits',
        }),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(SelectFieldCell, {
          form,
          rowIndex: row.index,
        }),
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
      cell: ({ row }) =>
        renderComponent(NumberFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'progress',
          max: 100,
        }),
    }),
  ])

  // Create table using form state as data source
  const table = createTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns,
      get data() {
        return form.state.values.data
      },
      debugTable: true,
    },
    (state) => state,
  )

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

  function getFilterValue(column: Column<typeof _features, Person>): unknown {
    return column.getFilterValue()
  }

  function getFirstValue(
    tbl: Table<typeof _features, Person>,
    columnId: string,
  ): unknown {
    return tbl.getPreFilteredRowModel().flatRows[0]?.getValue(columnId)
  }
</script>

{#snippet filterSnippet(column: Column<typeof _features, Person>)}
  {@const firstValue = getFirstValue(table, column.id)}
  {@const filterValue = getFilterValue(column)}
  {#if typeof firstValue === 'number'}
    <div class="flex space-x-2">
      <input
        type="number"
        value={((filterValue as [number, number] | undefined)?.[0] ?? '') as any}
        oninput={(e: Event) =>
          column.setFilterValue((old: [number, number]) => [
            (e.target as HTMLInputElement).value,
            old?.[1],
          ])}
        placeholder="Min"
        class="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((filterValue as [number, number] | undefined)?.[1] ?? '') as any}
        oninput={(e: Event) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            (e.target as HTMLInputElement).value,
          ])}
        placeholder="Max"
        class="w-24 border shadow rounded"
      />
    </div>
  {:else}
    <input
      class="w-36 border shadow rounded"
      oninput={(e: Event) =>
        column.setFilterValue((e.target as HTMLInputElement).value)}
      placeholder="Search..."
      type="text"
      value={(filterValue ?? '') as string}
    />
  {/if}
{/snippet}

<div class="p-2">
  <form
    onsubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <!-- Form state indicators -->
    <div class="mb-4 flex items-center gap-4">
      <form.AppForm>
        {#snippet children()}
          <form.FormStateIndicator />
        {/snippet}
      </form.AppForm>
      <form.AppForm>
        {#snippet children()}
          <form.SubmitButton label="Save All Changes" />
        {/snippet}
      </form.AppForm>
      <button
        type="button"
        onclick={addRow}
        class="border rounded px-4 py-2 bg-green-500 text-white"
      >
        Add Row
      </button>
      <button
        type="button"
        onclick={refreshData}
        class="border rounded px-4 py-2 bg-gray-500 text-white"
      >
        Reset Data
      </button>
    </div>

    <!-- Table -->
    <div>
      <div class="h-2"></div>
      <table>
        <thead>
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  {#if !header.isPlaceholder}
                    <div>
                      <FlexRender
                        content={header.column.columnDef.header}
                        context={header.getContext()}
                      />
                      {#if header.column.getCanFilter()}
                        <div>
                          {@render filterSnippet(header.column)}
                        </div>
                      {/if}
                    </div>
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each table.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getAllCells() as cell (cell.id)}
                <td>
                  <FlexRender
                    content={cell.column.columnDef.cell}
                    context={cell.getContext()}
                  />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Pagination controls -->
      <div class="h-2"></div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="border rounded p-1"
          onclick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          type="button"
          class="border rounded p-1"
          onclick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          type="button"
          class="border rounded p-1"
          onclick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          type="button"
          class="border rounded p-1"
          onclick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.state.pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.state.pagination.pageIndex + 1}
            oninput={(e: Event) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
          onchange={(e: Event) => {
            table.setPageSize(Number((e.target as HTMLSelectElement).value))
          }}
        >
          {#each [10, 20, 30, 40, 50] as pageSize}
            <option value={pageSize}>Show {pageSize}</option>
          {/each}
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
    </div>
  </form>
</div>
