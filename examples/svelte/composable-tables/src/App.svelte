<script lang="ts">
  import UsersTable from './components/UsersTable.svelte'
  import ProductsTable from './components/ProductsTable.svelte'
  import './index.css'
</script>

<div class="app">
  <h1>Composable Tables Example</h1>
  <p class="description">
    Both tables below use the same <code>createAppTable</code> hook and
    shareable components, but with different data types and column
    configurations.
  </p>

  <!-- Original Users Table -->
  <UsersTable />

  <div class="table-divider"></div>

  <!-- New Products Table -->
  <ProductsTable />
</div>
