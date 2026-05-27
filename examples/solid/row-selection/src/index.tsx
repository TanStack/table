/* @refresh reload */
import { render } from 'solid-js/web'
import { TanStackDevtools } from '@tanstack/solid-devtools'
import { tableDevtoolsPlugin } from '@tanstack/solid-table-devtools'
import './index.css'
import App from './App'

render(
  () => (
    <>
      <App />
    </>
  ),
  document.getElementById('root') as HTMLElement,
)
