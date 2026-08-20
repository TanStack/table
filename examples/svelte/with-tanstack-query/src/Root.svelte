<script lang="ts">
  import { TanStackDevtools } from '@tanstack/svelte-devtools'
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query'
  import App from './App.svelte'
  import QueryDevtoolsPanel from './QueryDevtoolsPanel.svelte'
  import TableDevtoolsPanel from './TableDevtoolsPanel.svelte'
  import type { TanStackDevtoolsSveltePlugin } from '@tanstack/svelte-devtools'

  const queryClient = new QueryClient()
  const plugins: Array<TanStackDevtoolsSveltePlugin> = [
    {
      name: 'TanStack Table',
      component: TableDevtoolsPanel,
    },
    {
      name: 'TanStack Query',
      component: QueryDevtoolsPanel,
      props: { client: queryClient },
    },
  ]
</script>

<QueryClientProvider client={queryClient}>
  <App />
  <TanStackDevtools {plugins} />
</QueryClientProvider>
