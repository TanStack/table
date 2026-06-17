<!--
  Row-selection checkbox cell - toggles selection for the current row.
  Uses useCellContext to access the cell (and its row) instance.

  Unlike React, Svelte tracks the table state read here natively, so no
  Subscribe boundary is needed; a small action sets the indeterminate property.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext()
  const row = $derived(cell.row)

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

<input
  type="checkbox"
  checked={row.getIsSelected()}
  disabled={!row.getCanSelect()}
  use:setIndeterminate={!row.getIsSelected() && row.getIsSomeSelected()}
  onchange={row.getToggleSelectedHandler()}
/>
