<script lang="ts">
  import type { Header } from '@tanstack/svelte-table'
  import type { features } from './tableHelper.svelte'
  import type { Person } from './makeData'

  type Props = {
    label?: string
    header?: Header<typeof features, Person, unknown>
  }

  const { label, header }: Props = $props()
</script>

{#if header && header.column}
  <button
    class:sortable={header.column.getCanSort()}
    onclick={header.column.getToggleSortingHandler()}
  >
    {label ?? header.column.id}
    {#if header.column.getIsSorted().toString() === 'asc'}
      🔼
    {:else if header.column.getIsSorted().toString() === 'desc'}
      🔽
    {/if}
  </button>
{:else}
  {label ?? ''}
{/if}

<style>
  button {
    padding-left: 4px;
    padding-right: 4px;
    font-weight: bold;
  }
</style>
