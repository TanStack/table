<!--
  Select-all header checkbox for the row-selection column.
  Uses useHeaderContext to access the header (and its table) instance.
-->
<script lang="ts">
  import { useHeaderContext } from '../hooks/table'

  const header = useHeaderContext()
  const table = $derived(header.table)

  // Svelte action to set the indeterminate property on the checkbox input.
  function setIndeterminate(node: HTMLInputElement, value: boolean) {
    node.indeterminate = value
    return {
      update(newValue: boolean) {
        node.indeterminate = newValue
      },
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<input
  type="checkbox"
  checked={table.getIsAllRowsSelected()}
  use:setIndeterminate={!table.getIsAllRowsSelected() &&
    table.getIsSomeRowsSelected()}
  onchange={table.getToggleAllRowsSelectedHandler()}
  onclick={(e) => e.stopPropagation()}
/>
