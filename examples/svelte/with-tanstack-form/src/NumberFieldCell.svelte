<script lang="ts">
  import { z } from 'zod'
  import type { AnyFormApi } from '@tanstack/form-core'

  const { form, rowIndex, fieldName, min, max }: {
    form: any
    rowIndex: number
    fieldName: string
    min?: number
    max?: number
  } = $props()

  const validator = $derived(
    max !== undefined
      ? z.number().min(min ?? 0, 'Must be positive').max(max, `Must be 0-${max}`)
      : z.number().min(min ?? 0, 'Must be positive'),
  )
</script>

<form.AppField
  name={`data[${rowIndex}].${fieldName}`}
  validators={{
    onChange: validator,
  }}
>
  {#snippet children(field: any)}
    <field.NumberField />
  {/snippet}
</form.AppField>
