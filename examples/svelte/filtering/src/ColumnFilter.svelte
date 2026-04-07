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
</script>

{#if isNumber}
  <div>
    <div class="flex space-x-2">
      <DebouncedInput
        type="number"
        min={0}
        max={100}
        value={(column.getFilterValue() as [number, number] | undefined)?.[0] ?? ''}
        onchange={(value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            value,
            old?.[1] ?? '',
          ])
        }
        debounce={500}
        placeholder="Min"
        class="w-24 border shadow rounded"
      />
      <DebouncedInput
        type="number"
        min={0}
        max={100}
        value={(column.getFilterValue() as [number, number] | undefined)?.[1] ?? ''}
        onchange={(value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            old?.[0] ?? '',
            value,
          ])
        }
        debounce={500}
        placeholder="Max"
        class="w-24 border shadow rounded"
      />
    </div>
  </div>
{:else}
  <div>
    <DebouncedInput
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onchange={(value) => column.setFilterValue(value)}
      debounce={500}
      placeholder="Search..."
      class="w-36 border shadow rounded"
      list="{column.id}list"
    />
  </div>
{/if}
