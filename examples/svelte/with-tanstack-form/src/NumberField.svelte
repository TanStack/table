<script lang="ts">
  import { useFieldContext } from './form-context.js'

  const field = useFieldContext<number>()
</script>

<div>
  <input
    type="number"
    class="border rounded px-1 w-20"
    value={field.state.value}
    oninput={(e: Event) =>
      field.handleChange(Number((e.target as HTMLInputElement).value))}
    onblur={() => field.handleBlur()}
  />
  {#if field.state.meta.errors.length > 0}
    <div class="text-red-500 text-xs">{field.state.meta.errors.join(', ')}</div>
  {/if}
</div>
