<script lang="ts">
  import { useFieldContext } from './form-context.js'

  const field = useFieldContext<string>()

  function getErrorMessage(error: unknown) {
    if (typeof error === 'string') return error

    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message
      if (typeof message === 'string') return message
    }

    return String(error)
  }
</script>

<div>
  <input
    class="text-input"
    value={field.state.value}
    oninput={(e: Event) =>
      field.handleChange((e.target as HTMLInputElement).value)}
    onblur={() => field.handleBlur()}
  />
  {#if (field.state.meta.isTouched || field.state.meta.isBlurred) && field.state.meta.errors.length > 0}
    <div class="error-text">
      {field.state.meta.errors.map(getErrorMessage).join(', ')}
    </div>
  {/if}
</div>
