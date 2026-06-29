<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import { ref, watch } from 'vue'
import FormStateIndicator from './FormStateIndicator.vue'
import NumberField from './NumberField.vue'
import RowSubmitTableRow from './RowSubmitTableRow.vue'
import SelectField from './SelectField.vue'
import SubmitButton from './SubmitButton.vue'
import TextField from './TextField.vue'
import { makeData } from './makeData'
import { formSchema } from './schema'
import { createAppColumnHelper, useAppTable } from './table'
import type { FormData, FormRow } from './schema'

const columnHelper = createAppColumnHelper<FormRow>()

const blankRow = (): FormRow => ({
  firstName: '',
  lastName: '',
  age: 0,
  visits: 0,
  progress: 0,
  status: 'single',
})

const fullData = ref<Array<FormRow>>(makeData(100))

const fullTableForm = useForm({
  defaultValues: {
    data: fullData.value,
  } satisfies FormData,
  onSubmit: ({ value }: { value: FormData }) => {
    alert(
      `Submitted ${value.data.length} records!\n\nFirst record: ${JSON.stringify(value.data[0], null, 2)}`,
    )
  },
  validators: {
    onChange: formSchema,
  },
})

watch(
  fullData,
  (data) => {
    fullTableForm.reset({ data })
  },
  { flush: 'sync' },
)

const fullColumns = columnHelper.columns([
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
])

const fullTable = useAppTable({
  key: 'with-tanstack-form-full-table',
  columns: fullColumns,
  data: fullData,
  debugTable: true,
})

useTanStackTableDevtools(fullTable)

function refreshFullData() {
  fullData.value = makeData(100)
}

function stressTest() {
  fullData.value = makeData(1_000_000)
}

function addRow() {
  fullData.value = [blankRow(), ...fullTableForm.store.get().values.data]
  fullTable.firstPage()
}

const rowData = ref<Array<FormRow>>(makeData(100))

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

const rowTable = useAppTable({
  key: 'with-tanstack-form-row-submit',
  columns: rowColumns,
  data: rowData,
  debugTable: true,
})

useTanStackTableDevtools(rowTable)

function refreshRowData() {
  rowData.value = makeData(100)
}

function saveRow(originalRow: FormRow, value: FormRow) {
  rowData.value = rowData.value.map((row) => {
    return row === originalRow ? value : row
  })
}

function handleSubmit(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  fullTableForm.handleSubmit()
}

function getSortTitle(
  column: ReturnType<typeof fullTable.getAllColumns>[number],
) {
  if (!column.getCanSort()) return undefined

  const nextOrder = column.getNextSortingOrder()
  if (nextOrder === 'asc') return 'Sort ascending'
  if (nextOrder === 'desc') return 'Sort descending'

  return 'Clear sort'
}
</script>

<template>
  <div class="demo-root">
    <section class="example-section">
      <h2 class="section-title">Single form around the table</h2>
      <form @submit="handleSubmit">
        <div class="form-actions">
          <FormStateIndicator :form="fullTableForm" />
          <SubmitButton :form="fullTableForm" label="Save All Changes" />
          <button
            type="button"
            class="demo-button success-action"
            @click="addRow"
          >
            Add Row
          </button>
          <button
            type="button"
            class="demo-button secondary-action"
            @click="refreshFullData"
          >
            Regenerate Data
          </button>
          <button
            type="button"
            class="demo-button secondary-action"
            @click="stressTest"
          >
            Stress Test (1M rows)
          </button>
        </div>

        <component :is="fullTable.AppTable">
          <div class="spacer-sm" />
          <div class="scroll-container">
            <table>
              <thead>
                <tr
                  v-for="headerGroup in fullTable.getHeaderGroups()"
                  :key="headerGroup.id"
                >
                  <component
                    :is="fullTable.AppHeader"
                    v-for="header in headerGroup.headers"
                    :key="header.id"
                    :header="header"
                    v-slot="{ header: appHeader }"
                  >
                    <th :colSpan="appHeader.colSpan">
                      <div
                        v-if="!appHeader.isPlaceholder"
                        :class="
                          appHeader.column.getCanSort()
                            ? 'sortable-header'
                            : undefined
                        "
                        :title="getSortTitle(appHeader.column)"
                        @click="
                          appHeader.column.getToggleSortingHandler()?.($event)
                        "
                      >
                        <component :is="appHeader.FlexRender" />
                        <component :is="appHeader.SortIndicator" />
                        <component :is="appHeader.ColumnFilter" />
                      </div>
                    </th>
                  </component>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in fullTable.getRowModel().rows" :key="row.id">
                  <td v-for="cell in row.getAllCells()" :key="cell.id">
                    <TextField
                      v-if="cell.column.id === 'firstName'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].firstName`"
                    />
                    <TextField
                      v-else-if="cell.column.id === 'lastName'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].lastName`"
                    />
                    <NumberField
                      v-else-if="cell.column.id === 'age'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].age`"
                    />
                    <NumberField
                      v-else-if="cell.column.id === 'visits'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].visits`"
                    />
                    <SelectField
                      v-else-if="cell.column.id === 'status'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].status`"
                    />
                    <NumberField
                      v-else-if="cell.column.id === 'progress'"
                      :form="fullTableForm"
                      :name="`data[${row.index}].progress`"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <component :is="fullTable.PaginationControls" />
          <component :is="fullTable.RowCount" />
        </component>
      </form>
    </section>

    <div class="spacer-md" />

    <section class="example-section">
      <h2 class="section-title">Form submission per row</h2>
      <div class="form-actions">
        <button
          type="button"
          class="demo-button secondary-action"
          @click="refreshRowData"
        >
          Regenerate Data
        </button>
      </div>

      <component :is="rowTable.AppTable">
        <div class="spacer-sm" />
        <div class="scroll-container">
          <table>
            <thead>
              <tr
                v-for="headerGroup in rowTable.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <component
                  :is="rowTable.AppHeader"
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :header="header"
                  v-slot="{ header: appHeader }"
                >
                  <th :colSpan="appHeader.colSpan">
                    <div
                      v-if="!appHeader.isPlaceholder"
                      :class="
                        appHeader.column.getCanSort()
                          ? 'sortable-header'
                          : undefined
                      "
                      :title="getSortTitle(appHeader.column)"
                      @click="
                        appHeader.column.getToggleSortingHandler()?.($event)
                      "
                    >
                      <component :is="appHeader.FlexRender" />
                      <component :is="appHeader.SortIndicator" />
                      <component :is="appHeader.ColumnFilter" />
                    </div>
                  </th>
                </component>
              </tr>
            </thead>
            <tbody>
              <RowSubmitTableRow
                v-for="row in rowTable.getRowModel().rows"
                :key="row.id"
                :row="row"
                :save="saveRow"
              />
            </tbody>
          </table>
        </div>

        <component :is="rowTable.PaginationControls" />
        <component :is="rowTable.RowCount" />
      </component>
    </section>
  </div>
</template>
