import { TanStackDevtools } from '@tanstack/solid-devtools'
import { pacerDevtoolsPlugin } from '@tanstack/solid-pacer-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { SolidQueryDevtoolsPanel } from '@tanstack/solid-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/solid-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/solid-router-devtools'
import { tableDevtoolsPlugin } from '@tanstack/solid-table-devtools'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <TanStackDevtools
        plugins={[
          tableDevtoolsPlugin(),
          {
            name: 'TanStack Query',
            render: <SolidQueryDevtoolsPanel />,
          },
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
          },
          pacerDevtoolsPlugin(),
        ]}
      />
    </QueryClientProvider>
  )
}
