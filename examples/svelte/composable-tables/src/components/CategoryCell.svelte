<!--
  Category badge cell.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext<'electronics' | 'clothing' | 'food' | 'books'>()
</script>

<span class="category-badge {cell.getValue()}">{cell.getValue()}</span>
