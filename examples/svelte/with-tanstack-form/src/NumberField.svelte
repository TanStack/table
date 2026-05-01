<script lang="ts">
  import { useFieldContext } from './form-context.js'

  const field = useFieldContext<number>()
</script>

<div>
  <input
    type="number"
    class="number-input"
    value={field.state.value}
    oninput={(e: Event) =>
      field.handleChange(Number((e.target as HTMLInputElement).value))}
    onblur={() => field.handleBlur()}
  />
  {#if field.state.meta.errors.length > 0}
    <div class="error-text">{field.state.meta.errors.join(', ')}</div>
  {/if}
</div>
