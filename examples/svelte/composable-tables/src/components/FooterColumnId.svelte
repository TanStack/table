<!--
  Footer showing the column ID.
  Uses useHeaderContext to access the header instance.
-->
<script lang="ts">
  import { useHeaderContext } from '../hooks/table'

  const header = useHeaderContext()
</script>

<span class="footer-column-id">{header.column.id}</span>
