import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

if (import.meta.env.DEV) {
  const reactScan = document.createElement('script')
  reactScan.src = 'https://unpkg.com/react-scan/dist/auto.global.js'
  reactScan.async = true
  document.head.append(reactScan)
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

// StrictMode is intentionally omitted: its development-only mount replay would
// contaminate the component lifecycle counters used by this benchmark.
createRoot(rootElement).render(<App />)
