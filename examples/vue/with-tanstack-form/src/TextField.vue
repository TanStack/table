<script setup lang="ts">
import { getErrorMessage, shouldShowErrors } from './field-utils'

defineProps<{
  form: any
  name: string
}>()
</script>

<template>
  <component :is="form.Field" :name="name" v-slot="{ field, state }">
    <div>
      <input
        class="text-input"
        :value="state.value"
        @input="field.handleChange(($event.target as HTMLInputElement).value)"
        @blur="field.handleBlur()"
      />
      <div v-if="shouldShowErrors(state.meta)" class="error-text">
        {{ state.meta.errors.map(getErrorMessage).join(', ') }}
      </div>
    </div>
  </component>
</template>
