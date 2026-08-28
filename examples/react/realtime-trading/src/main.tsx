import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

if (import.meta.env.DEV) {
  const nativeMeasure = performance.measure.bind(performance)
  const allowedMeasures = new Set([
    'react-profiler-commit',
    'tanstack-row-model',
    'market-update-to-dom-commit',
  ])
  performance.measure = ((
    name: string,
    startOrOptions?: string | PerformanceMeasureOptions,
    endMark?: string,
  ) => {
    // React 19 DEV records a User Timing measure per component. Combined with
    // this live feed that path freezes Chromium, so keep only benchmark marks.
    if (!allowedMeasures.has(name)) {
      return undefined as unknown as PerformanceMeasure
    }
    try {
      if (
        startOrOptions &&
        typeof startOrOptions === 'object' &&
        'detail' in startOrOptions
      ) {
        const { detail: _detail, ...rest } = startOrOptions
        return nativeMeasure(name, rest, endMark)
      }
      return nativeMeasure(name, startOrOptions as string, endMark)
    } catch {
      return undefined as unknown as PerformanceMeasure
    }
  }) as typeof performance.measure

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
