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
    <div class="flex gap-4 text-sm">
      <span class={isDirty ? 'text-yellow-600' : 'text-gray-400'}>
        {isDirty ? '● Modified' : '○ Pristine'}
      </span>
      <span class={isValid ? 'text-green-600' : 'text-red-600'}>
        {isValid ? '✓ Valid' : '✗ Invalid'}
      </span>
      {#if Object.keys(errorMap).length > 0}
        <span class="text-red-600">
          Errors: {JSON.stringify(errorMap)}
        </span>
      {/if}
    </div>
  {/snippet}
</form.Subscribe>
