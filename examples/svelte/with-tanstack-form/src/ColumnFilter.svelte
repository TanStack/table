<script lang="ts">
  import { useHeaderContext, useTableContext } from './table'

  const header = useHeaderContext()
  const table = useTableContext()

  const firstValue = () =>
    table.getPreFilteredRowModel().flatRows[0]?.getValue(header.column.id)

  const filterValue = () => header.column.getFilterValue()
</script>

{#if header.column.getCanFilter()}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div onclick={(event) => event.stopPropagation()}>
    {#if typeof firstValue() === 'number'}
      <div class="filter-row">
        <input
          type="number"
          value={(filterValue() as [number, number] | undefined)?.[0] ?? ''}
          oninput={(event) =>
            header.column.setFilterValue(
              (old: [number, number] | undefined) => [
                event.currentTarget.value,
                old?.[1],
              ],
            )}
          placeholder="Min"
          class="filter-input"
        />
        <input
          type="number"
          value={(filterValue() as [number, number] | undefined)?.[1] ?? ''}
          oninput={(event) =>
            header.column.setFilterValue(
              (old: [number, number] | undefined) => [
                old?.[0],
                event.currentTarget.value,
              ],
            )}
          placeholder="Max"
          class="filter-input"
        />
      </div>
    {:else}
      <input
        type="text"
        value={(filterValue() ?? '') as string}
        oninput={(event) =>
          header.column.setFilterValue(event.currentTarget.value)}
        placeholder="Search..."
        class="filter-select"
      />
    {/if}
  </div>
{/if}
