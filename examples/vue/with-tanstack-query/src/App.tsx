import { defineComponent } from 'vue'
import { UseInfiniteQueryApp } from './UseInfiniteQueryApp'
import { UseQueryApp } from './UseQueryApp'

export default defineComponent({
  name: 'WithTanStackQueryExample',
  setup() {
    return () => (
      <main class="demo-root">
        <section class="query-example" data-testid="use-query-example">
          <h1>useQuery</h1>
          <p>Page-index pagination with a known total row count.</p>
          <UseQueryApp />
        </section>
        <section class="query-example" data-testid="use-infinite-query-example">
          <h1>useInfiniteQuery</h1>
          <p>
            Cursor pagination with an unknown total. Each next cursor is the
            last row ID from the current page.
          </p>
          <UseInfiniteQueryApp />
        </section>
      </main>
    )
  },
})
