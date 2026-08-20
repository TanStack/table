<!--
  Column filter input.
  Uses useHeaderContext to access the header instance.
-->
<script lang="ts">
  import { useHeaderContext } from '../hooks/table'

  const header = useHeaderContext()
</script>

{#if header.column.getCanFilter()}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="column-filter" onclick={(e) => e.stopPropagation()}>
    <input
      type="text"
      value={header.column.getFilterValue() ?? ''}
      oninput={(e) => header.column.setFilterValue(e.currentTarget.value)}
      placeholder="Filter {header.column.id}..."
    />
  </div>
{/if}
