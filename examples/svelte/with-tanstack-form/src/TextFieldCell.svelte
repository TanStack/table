<script lang="ts">
  import { z } from 'zod'
  import type { AnyFormApi } from '@tanstack/form-core'

  const { form, rowIndex, fieldName }: {
    form: any
    rowIndex: number
    fieldName: string
  } = $props()
</script>

<form.AppField
  name={`data[${rowIndex}].${fieldName}`}
  validators={{
    onChange: z.string().min(1, 'Required'),
  }}
>
  {#snippet children(field: any)}
    <field.TextField />
  {/snippet}
</form.AppField>
