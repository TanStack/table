import { render } from 'solid-js/web'
import { TanStackDevtools } from '@tanstack/solid-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { SolidQueryDevtoolsPanel } from '@tanstack/solid-query-devtools'
import { tableDevtoolsPlugin } from '@tanstack/solid-table-devtools'
import './index.css'
import App from './App'

const queryClient = new QueryClient()

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
      <TanStackDevtools
        plugins={[
          tableDevtoolsPlugin(),
          {
            name: 'TanStack Query',
            render: <SolidQueryDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  ),
  document.getElementById('root') as HTMLElement,
)
