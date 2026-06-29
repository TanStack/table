<script lang="ts">
  const { form, rowIndex, fieldName }: {
    form: any
    rowIndex: number
    fieldName: string
  } = $props()
</script>

<form.AppField name={`data[${rowIndex}].${fieldName}`}>
  {#snippet children(field: any)}
    <field.TextField />
  {/snippet}
</form.AppField>
