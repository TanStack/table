<script setup lang="ts">
defineProps<{
  form: any
}>()

const selector = (state: { isDirty: boolean; isValid: boolean }) => ({
  isDirty: state.isDirty,
  isValid: state.isValid,
})
</script>

<template>
  <component :is="form.Subscribe" :selector="selector" v-slot="state">
    <div class="form-status">
      <span :class="state.isDirty ? 'warning-text' : 'muted-text'">
        {{ state.isDirty ? 'Modified' : 'Pristine' }}
      </span>
      <span :class="state.isValid ? 'success-text' : 'error-text'">
        {{ state.isValid ? 'Valid' : 'Invalid' }}
      </span>
    </div>
  </component>
</template>
