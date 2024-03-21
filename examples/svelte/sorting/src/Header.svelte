<script lang="ts">
  import type { Header } from '@tanstack/svelte-table'
  import type { Person } from './makeData'

  type Props = {
    label?: string
    header: Header<Person, unknown>
  }

  const { label, header }: Props = $props()
</script>

<button
  class:cursor-pointer={header.column.getCanSort()}
  class:select-none={header.column.getCanSort()}
  on:click={header.column.getToggleSortingHandler()}
>
  {label ?? header.column.id}
  {#if header.column.getIsSorted().toString() === 'asc'}
    🔼
  {:else if header.column.getIsSorted().toString() === 'desc'}
    🔽
  {/if}
</button>

<style>
  button {
    padding-left: 4px;
    padding-right: 4px;
    font-weight: bold;
  }
</style>
