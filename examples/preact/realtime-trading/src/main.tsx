import { render } from 'preact'
import { App } from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

// StrictMode is intentionally omitted: its development-only mount replay would
// contaminate the component lifecycle counters used by this benchmark.
render(<App />, rootElement)
