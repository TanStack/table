<script lang="ts">
  import { useFormContext } from './form-context.js'

  const form = useFormContext()

  const { label }: { label: string } = $props()
</script>

<form.Subscribe
  selector={(state) => ({
    isSubmitting: state.isSubmitting,
    canSubmit: state.canSubmit,
  })}
>
  {#snippet children({ isSubmitting, canSubmit })}
    <button
      type="submit"
      disabled={!canSubmit || isSubmitting}
      class="demo-button primary-action submit-button"
    >
      {isSubmitting ? 'Submitting...' : label}
    </button>
  {/snippet}
</form.Subscribe>
