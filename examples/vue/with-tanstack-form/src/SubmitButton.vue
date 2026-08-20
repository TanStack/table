<script setup lang="ts">
defineProps<{
  form: any
  label: string
}>()

const selector = (state: { canSubmit: boolean; isSubmitting: boolean }) => ({
  canSubmit: state.canSubmit,
  isSubmitting: state.isSubmitting,
})
</script>

<template>
  <component :is="form.Subscribe" :selector="selector" v-slot="state">
    <button
      type="submit"
      :disabled="!state.canSubmit || state.isSubmitting"
      class="demo-button primary-action submit-button"
    >
      {{ state.isSubmitting ? 'Submitting...' : label }}
    </button>
  </component>
</template>
