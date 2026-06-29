<script lang="ts">
  import { FlexRender, renderComponent } from '@tanstack/svelte-table'
  import { untrack } from 'svelte'
  import { createAppColumnHelper, createAppTable } from './table'
  import { createAppForm } from './form'
  import { formSchema, personSchema } from './schema'
  import { makeData } from './makeData'
  import NumberFieldCell from './NumberFieldCell.svelte'
  import RowSubmitTableRow from './RowSubmitTableRow.svelte'
  import SelectFieldCell from './SelectFieldCell.svelte'
  import TextFieldCell from './TextFieldCell.svelte'
  import type { FormData, FormRow } from './schema'
  import './index.css'

  const columnHelper = createAppColumnHelper<FormRow>()

  let fullData = $state<Array<FormRow>>(makeData(100))

  const form = createAppForm(() => ({
    defaultValues: {
      data: fullData,
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

  $effect(() => {
    const nextData = fullData
    untrack(() => form.reset({ data: nextData }))
  })

  const fullColumns = columnHelper.columns([
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
        }),
    }),
  ])

  const fullTable = createAppTable({
    columns: fullColumns,
    get data() {
      return fullData
    },
    debugTable: true,
  })

  const fullHeaderGroups = $derived.by(() => {
    JSON.stringify(fullTable.state)
    return fullTable.getHeaderGroups()
  })

  const fullRows = $derived.by(() => {
    JSON.stringify(fullTable.state)
    return fullTable.getRowModel().rows
  })

  function refreshFullData() {
    fullData = makeData(100)
  }

  function stressTest() {
    fullData = makeData(1_000_000)
  }

  function addRow() {
    fullData = [
      {
        firstName: '',
        lastName: '',
        age: 0,
        visits: 0,
        progress: 0,
        status: 'single',
      },
      ...form.state.values.data,
    ]
    fullTable.firstPage()
  }

  let rowData = $state<Array<FormRow>>(makeData(100))

  const rowColumns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
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
  ])

  const rowTable = createAppTable({
    columns: rowColumns,
    get data() {
      return rowData
    },
    debugTable: true,
  })

  const rowHeaderGroups = $derived.by(() => {
    JSON.stringify(rowTable.state)
    return rowTable.getHeaderGroups()
  })

  const rowRows = $derived.by(() => {
    JSON.stringify(rowTable.state)
    return rowTable.getRowModel().rows
  })

  function refreshRowData() {
    rowData = makeData(100)
  }

  function saveRow(originalRow: FormRow, value: FormRow) {
    rowData = rowData.map((row) => {
      return row === originalRow ? value : row
    })
  }
</script>

<div class="demo-root">
  <section class="example-section">
    <h2 class="section-title">Single form around the table</h2>
    <form
      onsubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div class="form-actions">
        <form.AppForm>
          {#snippet children()}
            <form.FormStateIndicator />
            <form.SubmitButton label="Save All Changes" />
          {/snippet}
        </form.AppForm>
        <button type="button" onclick={addRow} class="demo-button success-action">
          Add Row
        </button>
        <button
          type="button"
          onclick={refreshFullData}
          class="demo-button secondary-action"
        >
          Regenerate Data
        </button>
        <button
          type="button"
          onclick={stressTest}
          class="demo-button secondary-action"
        >
          Stress Test (1M rows)
        </button>
      </div>

      <fullTable.AppTable>
        <div class="spacer-sm"></div>
        <div class="scroll-container">
          <table>
            <thead>
              {#each fullHeaderGroups as headerGroup (headerGroup.id)}
                <tr>
                  {#each headerGroup.headers as h (h.id)}
                    <fullTable.AppHeader header={h}>
                      {#snippet children(header)}
                        <th colSpan={header.colSpan}>
                          {#if !header.isPlaceholder}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                              class={header.column.getCanSort()
                                ? 'sortable-header'
                                : ''}
                              onclick={header.column.getToggleSortingHandler()}
                              title={header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() ===
                                      'desc'
                                    ? 'Sort descending'
                                    : 'Clear sort'
                                : undefined}
                            >
                              <header.FlexRender header={header} />
                              <header.SortIndicator />
                              <header.ColumnFilter />
                            </div>
                          {/if}
                        </th>
                      {/snippet}
                    </fullTable.AppHeader>
                  {/each}
                </tr>
              {/each}
            </thead>
            <tbody>
              {#each fullRows as row (row.id)}
                <tr>
                  {#each row.getAllCells() as cell (cell.id)}
                    <td>
                      <FlexRender cell={cell} />
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <fullTable.PaginationControls />
        <fullTable.RowCount />
      </fullTable.AppTable>
    </form>
  </section>

  <div class="spacer-md"></div>

  <section class="example-section">
    <h2 class="section-title">Form submission per row</h2>
    <div class="form-actions">
      <button
        type="button"
        onclick={refreshRowData}
        class="demo-button secondary-action"
      >
        Regenerate Data
      </button>
    </div>

    <rowTable.AppTable>
      <div class="spacer-sm"></div>
      <div class="scroll-container">
        <table>
          <thead>
            {#each rowHeaderGroups as headerGroup (headerGroup.id)}
              <tr>
                {#each headerGroup.headers as h (h.id)}
                  <rowTable.AppHeader header={h}>
                    {#snippet children(header)}
                      <th colSpan={header.colSpan}>
                        {#if !header.isPlaceholder}
                          <!-- svelte-ignore a11y_click_events_have_key_events -->
                          <!-- svelte-ignore a11y_no_static_element_interactions -->
                          <div
                            class={header.column.getCanSort()
                              ? 'sortable-header'
                              : ''}
                            onclick={header.column.getToggleSortingHandler()}
                            title={header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined}
                          >
                            <header.FlexRender header={header} />
                            <header.SortIndicator />
                            <header.ColumnFilter />
                          </div>
                        {/if}
                      </th>
                    {/snippet}
                  </rowTable.AppHeader>
                {/each}
              </tr>
            {/each}
          </thead>
          <tbody>
            {#each rowRows as row (row.id)}
              <RowSubmitTableRow row={row} onSave={saveRow} />
            {/each}
          </tbody>
        </table>
      </div>

      <rowTable.PaginationControls />
      <rowTable.RowCount />
    </rowTable.AppTable>
  </section>
</div>
