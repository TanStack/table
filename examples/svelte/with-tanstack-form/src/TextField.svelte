<script lang="ts">
  import { useFieldContext } from './form-context.js'

  const field = useFieldContext<string>()
</script>

<div>
  <input
    class="border rounded px-1 w-full"
    value={field.state.value}
    oninput={(e: Event) =>
      field.handleChange((e.target as HTMLInputElement).value)}
    onblur={() => field.handleBlur()}
  />
  {#if field.state.meta.errors.length > 0}
    <div class="text-red-500 text-xs">{field.state.meta.errors.join(', ')}</div>
  {/if}
</div>
