<script setup lang="ts">
import { getErrorMessage, shouldShowErrors } from './field-utils'

defineProps<{
  form: any
  name: string
}>()

const statusOptions = ['relationship', 'complicated', 'single'] as const
</script>

<template>
  <component :is="form.Field" :name="name" v-slot="{ field, state }">
    <div>
      <select
        class="compact-input"
        :value="state.value"
        @change="field.handleChange(($event.target as HTMLSelectElement).value)"
        @blur="field.handleBlur()"
      >
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
      <div v-if="shouldShowErrors(state.meta)" class="error-text">
        {{ state.meta.errors.map(getErrorMessage).join(', ') }}
      </div>
    </div>
  </component>
</template>
