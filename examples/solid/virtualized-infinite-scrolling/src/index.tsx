/* @refresh reload */
import { render } from '@solidjs/web'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import './index.css'
import App from './App'

const queryClient = new QueryClient()

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  document.getElementById('root') as HTMLElement,
)
