<script lang="ts">
  import { useFormContext } from './form-context.js'

  const form = useFormContext()
</script>

<form.Subscribe
  selector={(state) => ({
    isDirty: state.isDirty,
    isValid: state.isValid,
    errorMap: state.errorMap,
  })}
>
  {#snippet children({ isDirty, isValid, errorMap })}
    <div class="form-status">
      <span class={isDirty ? 'warning-text' : 'muted-text'}>
        {isDirty ? '● Modified' : '○ Pristine'}
      </span>
      <span class={isValid ? 'success-text' : 'error-text'}>
        {isValid ? '✓ Valid' : '✗ Invalid'}
      </span>
      {#if Object.keys(errorMap).length > 0}
        <span class="error-text">
          Errors: {JSON.stringify(errorMap)}
        </span>
      {/if}
    </div>
  {/snippet}
</form.Subscribe>
