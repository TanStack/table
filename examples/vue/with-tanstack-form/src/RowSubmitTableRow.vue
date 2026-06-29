<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { watch } from 'vue'
import NumberField from './NumberField.vue'
import SelectField from './SelectField.vue'
import TextField from './TextField.vue'
import { personSchema } from './schema'
import type { appFeatures } from './table'
import type { FormRow } from './schema'
import type { Row } from '@tanstack/vue-table'

const props = defineProps<{
  row: Row<typeof appFeatures, FormRow>
  save: (originalRow: FormRow, value: FormRow) => void
}>()

const form = useForm({
  defaultValues: props.row.original,
  onSubmit: ({ value }: { value: FormRow }) => {
    props.save(props.row.original, value)
    form.reset(value)
  },
  validators: {
    onChange: personSchema,
  },
})

const selector = (state: {
  canSubmit: boolean
  isDirty: boolean
  isSubmitting: boolean
}) => ({
  canSubmit: state.canSubmit,
  isDirty: state.isDirty,
  isSubmitting: state.isSubmitting,
})

watch(
  () => props.row.original,
  (row) => {
    form.reset(row)
  },
)
</script>

<template>
  <tr>
    <td v-for="cell in row.getAllCells()" :key="cell.id">
      <TextField
        v-if="cell.column.id === 'firstName'"
        :form="form"
        name="firstName"
      />
      <TextField
        v-else-if="cell.column.id === 'lastName'"
        :form="form"
        name="lastName"
      />
      <NumberField
        v-else-if="cell.column.id === 'age'"
        :form="form"
        name="age"
      />
      <NumberField
        v-else-if="cell.column.id === 'visits'"
        :form="form"
        name="visits"
      />
      <SelectField
        v-else-if="cell.column.id === 'status'"
        :form="form"
        name="status"
      />
      <NumberField
        v-else-if="cell.column.id === 'progress'"
        :form="form"
        name="progress"
      />
      <component
        :is="form.Subscribe"
        v-else-if="cell.column.id === 'save'"
        :selector="selector"
        v-slot="state"
      >
        <div class="row-action-cell">
          <button
            v-if="state.isDirty"
            type="button"
            :disabled="!state.canSubmit || state.isSubmitting"
            class="demo-button demo-button-sm primary-action"
            @click="form.handleSubmit()"
          >
            {{ state.isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </component>
    </td>
  </tr>
</template>
