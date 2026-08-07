<script lang="ts">
  import UseInfiniteQueryApp from './UseInfiniteQueryApp.svelte'
  import UseQueryApp from './UseQueryApp.svelte'
  import './index.css'
</script>

<main class="demo-root">
  <section class="query-example" data-testid="use-query-example">
    <h1>createQuery</h1>
    <p>Page-index pagination with a known total row count.</p>
    <UseQueryApp />
  </section>
  <section class="query-example" data-testid="use-infinite-query-example">
    <h1>createInfiniteQuery</h1>
    <p>
      Cursor pagination with an unknown total. Each next cursor is the last row
      ID from the current page.
    </p>
    <UseInfiniteQueryApp />
  </section>
</main>
