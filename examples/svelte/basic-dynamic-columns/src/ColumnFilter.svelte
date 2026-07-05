<script lang="ts">
  import DebouncedInput from './DebouncedInput.svelte'
  import type { DynamicRow, features } from './features'
  import type { Column } from '@tanstack/svelte-table'

  // A different filter UI per data type. Unlike the React example, Svelte 5 runes
  // keep these reads (getFilterValue, the faceted values) fresh on their own, so
  // there is no need for a `table.Subscribe` wrapper. Reading them through
  // `$derived` is enough for the inputs to stay in sync with column-filter changes.
  let {
    column,
  }: {
    column: Column<typeof features, DynamicRow, unknown>
  } = $props()

  const dataType = $derived(column.columnDef.meta?.dataType ?? 'string')
  const filterValue = $derived(column.getFilterValue())

  // number: faceted min/max drive the placeholder hints
  const minMax = $derived(column.getFacetedMinMaxValues() ?? [])
  const min = $derived(minMax[0])
  const max = $derived(minMax[1])

  // string: low-cardinality columns become a select of their faceted values,
  // everything else gets a free-text search.
  const uniqueValues = $derived(
    Array.from(column.getFacetedUniqueValues().keys()).map(String).sort(),
  )
  const isEnum = $derived(
    uniqueValues.length > 0 && uniqueValues.length <= 10,
  )
  const facetedUniqueCount = $derived(column.getFacetedUniqueValues().size)
</script>

{#if dataType === 'number'}
  <div class="filter-row">
    <DebouncedInput
      type="number"
      value={(filterValue as [number, number] | undefined)?.[0] ?? ''}
      onchange={(value) =>
        column.setFilterValue((old: [number, number] | undefined) => [
          value,
          old?.[1],
        ])}
      placeholder={`Min${min !== undefined ? ` (${min})` : ''}`}
      class="filter-input"
    />
    <DebouncedInput
      type="number"
      value={(filterValue as [number, number] | undefined)?.[1] ?? ''}
      onchange={(value) =>
        column.setFilterValue((old: [number, number] | undefined) => [
          old?.[0],
          value,
        ])}
      placeholder={`Max${max !== undefined ? ` (${max})` : ''}`}
      class="filter-input"
    />
  </div>
{:else if dataType === 'date'}
  <div class="filter-row">
    <DebouncedInput
      type="date"
      value={(filterValue as [string, string] | undefined)?.[0] ?? ''}
      onchange={(value) =>
        column.setFilterValue((old: [string, string] | undefined) => [
          String(value),
          old?.[1] ?? '',
        ])}
      class="filter-input"
    />
    <DebouncedInput
      type="date"
      value={(filterValue as [string, string] | undefined)?.[1] ?? ''}
      onchange={(value) =>
        column.setFilterValue((old: [string, string] | undefined) => [
          old?.[0] ?? '',
          String(value),
        ])}
      class="filter-input"
    />
  </div>
{:else if dataType === 'boolean'}
  <select
    class="filter-select"
    value={(filterValue ?? '').toString()}
    onchange={(e) =>
      column.setFilterValue((e.target as HTMLSelectElement).value)}
  >
    <option value="">All</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
{:else if isEnum}
  <select
    class="filter-select"
    value={(filterValue ?? '').toString()}
    onchange={(e) =>
      column.setFilterValue((e.target as HTMLSelectElement).value)}
  >
    <option value="">All</option>
    {#each uniqueValues as value (value)}
      <option {value}>{value}</option>
    {/each}
  </select>
{:else}
  <DebouncedInput
    type="text"
    value={(filterValue ?? '') as string}
    onchange={(value) => column.setFilterValue(value)}
    placeholder={`Search... (${facetedUniqueCount})`}
    class="filter-input"
  />
{/if}
