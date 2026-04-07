<script lang="ts">
  import type { AnyFormApi } from '@tanstack/form-core'

  const { form, rowIndex }: {
    form: any
    rowIndex: number
  } = $props()
</script>

<form.AppField name={`data[${rowIndex}].status`}>
  {#snippet children(field: any)}
    <field.SelectField />
  {/snippet}
</form.AppField>
