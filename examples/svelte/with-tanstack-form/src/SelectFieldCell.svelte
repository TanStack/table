<script lang="ts">
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
