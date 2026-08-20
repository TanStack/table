<script lang="ts">
  import { useFormContext } from './form-context.js'

  const form = useFormContext()
</script>

<form.Subscribe
  selector={(state) => ({
    isDirty: state.isDirty,
    isValid: state.isValid,
  })}
>
  {#snippet children({ isDirty, isValid })}
    <div class="form-status">
      <span class={isDirty ? 'warning-text' : 'muted-text'}>
        {isDirty ? '● Modified' : '○ Pristine'}
      </span>
      <span class={isValid ? 'success-text' : 'error-text'}>
        {isValid ? '✓ Valid' : '✗ Invalid'}
      </span>
    </div>
  {/snippet}
</form.Subscribe>
