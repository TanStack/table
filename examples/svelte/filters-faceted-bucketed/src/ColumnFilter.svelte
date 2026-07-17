<script lang="ts">
  import type { Column, Table } from '@tanstack/svelte-table'
  import type { features } from './features'
  import type { Account } from './makeData'
  import type { FacetKey } from './buckets'

  let { column, table: _table }: {
    column: Column<typeof features, Account, unknown>
    table: Table<typeof features, Account>
  } = $props()

  const variant = $derived(column.columnDef.meta?.filterVariant)
  const options = $derived(column.columnDef.meta?.facetOptions ?? [])
  const selected = $derived((column.getFilterValue() ?? []) as Array<FacetKey>)
  const counts = $derived(column.getFacetedUniqueValues())

  function toggleFacet(value: FacetKey) {
    column.setFilterValue(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : [...selected, value],
    )
  }
</script>

{#if variant === 'facets'}
  <fieldset class="facet-options">
    {#each options as option (option.value)}
      <label>
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onchange={() => toggleFacet(option.value)}
        />
        <span>{option.label}</span>
        <span class="count">{(counts.get(option.value) ?? 0).toLocaleString()}</span>
      </label>
    {/each}
  </fieldset>
{:else}
  <input
    type="text"
    value={(column.getFilterValue() ?? '') as string}
    oninput={(event) => column.setFilterValue(event.currentTarget.value)}
    placeholder="Search…"
    class="filter-select"
  />
{/if}
