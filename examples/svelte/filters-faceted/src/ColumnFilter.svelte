<script lang="ts">
  import DebouncedInput from './DebouncedInput.svelte'
  import type { Person } from './makeData'
  import type { Column, Table } from '@tanstack/svelte-table'

  let {
    column,
    table,
  }: {
    column: Column<any, Person, unknown>
    table: Table<any, Person>
  } = $props()

  const firstValue = $derived(
    table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id),
  )

  const isNumber = $derived(typeof firstValue === 'number')

  function getSortedUniqueValues(): Array<string> {
    if (isNumber) return []
    return Array.from(column.getFacetedUniqueValues().keys()).sort() as Array<string>
  }
</script>

{#if isNumber}
  <div>
    <div class="flex space-x-2">
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(column.getFilterValue() as [number, number] | undefined)?.[0] ?? ''}
        onchange={(value) =>
          column.setFilterValue((old: [number, number]) => [
            value,
            old?.[1],
          ])
        }
        debounce={500}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
        class="w-24 border shadow rounded"
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(column.getFilterValue() as [number, number] | undefined)?.[1] ?? ''}
        onchange={(value) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            value,
          ])
        }
        debounce={500}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
        class="w-24 border shadow rounded"
      />
    </div>
  </div>
{:else}
  <div>
    <datalist id="{column.id}list">
      {#each getSortedUniqueValues().slice(0, 5000) as value}
        <option value={value}></option>
      {/each}
    </datalist>
    <DebouncedInput
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onchange={(value) => column.setFilterValue(value)}
      debounce={500}
      placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
      class="w-36 border shadow rounded"
      list="{column.id}list"
    />
  </div>
{/if}
