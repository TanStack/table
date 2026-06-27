<script lang="ts">
  import { createAppForm } from './form'
  import { untrack } from 'svelte'
  import { personSchema } from './schema'
  import type { appFeatures } from './table'
  import type { FormRow } from './schema'
  import type { Row } from '@tanstack/svelte-table'

  const { row, onSave }: {
    row: Row<typeof appFeatures, FormRow>
    onSave: (originalRow: FormRow, value: FormRow) => void
  } = $props()

  const form = createAppForm(() => ({
    defaultValues: row.original,
    onSubmit: ({ value }: { value: FormRow }) => {
      onSave(row.original, value)
      form.reset(value)
    },
    validators: {
      onChange: personSchema,
    },
  }))

  $effect(() => {
    const original = row.original
    untrack(() => form.reset(original))
  })
</script>

<tr>
  {#each row.getAllCells() as cell (cell.id)}
    <td>
      {#if cell.column.id === 'firstName'}
        <form.AppField name="firstName">
          {#snippet children(field: any)}
            <field.TextField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'lastName'}
        <form.AppField name="lastName">
          {#snippet children(field: any)}
            <field.TextField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'age'}
        <form.AppField name="age">
          {#snippet children(field: any)}
            <field.NumberField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'visits'}
        <form.AppField name="visits">
          {#snippet children(field: any)}
            <field.NumberField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'status'}
        <form.AppField name="status">
          {#snippet children(field: any)}
            <field.SelectField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'progress'}
        <form.AppField name="progress">
          {#snippet children(field: any)}
            <field.NumberField />
          {/snippet}
        </form.AppField>
      {:else if cell.column.id === 'save'}
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isDirty: state.isDirty,
            isSubmitting: state.isSubmitting,
          })}
        >
          {#snippet children({ canSubmit, isDirty, isSubmitting })}
            <div class="row-action-cell">
              {#if isDirty}
                <button
                  type="button"
                  disabled={!canSubmit || isSubmitting}
                  onclick={() => form.handleSubmit()}
                  class="demo-button demo-button-sm primary-action"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              {/if}
            </div>
          {/snippet}
        </form.Subscribe>
      {/if}
    </td>
  {/each}
</tr>
