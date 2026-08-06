import { onCleanup, onMount } from 'solid-js'

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const quoteCellLifecycle = {
  created: 0,
  destroyed: 0,
}

export const quoteCellRendererNames = [
  'Ticker',
  'Venue',
  'Bid',
  'Ask',
  'Spread',
  'Last',
  'LastMove',
  'LastQty',
  'Depth',
  'QuoteAge',
  'DayChange',
  'TotalQty',
  'TradedValue',
  'Intraday',
] as const

export const quoteComponentNames = [
  'PriceCell',
  'StableMoveCell',
  'UpMoveCell',
  'DownMoveCell',
  'SpreadCell',
  'DepthCell',
  'QuoteAgeCell',
  'SparklineCell',
] as const

export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]

const createCounterMap = <Name extends string>(
  names: ReadonlyArray<Name>,
): Record<Name, number> =>
  Object.fromEntries(names.map((name) => [name, 0])) as Record<Name, number>

export const quoteRenderDiagnostics = {
  cellRendererCalls: 0,
  componentRenderCalls: 0,
  cellRendererCallsByName: createCounterMap(quoteCellRendererNames),
  componentRenderCallsByName: createCounterMap(quoteComponentNames),
}

export function recordCellRender<T>(
  name: QuoteCellRendererName,
  value: () => T,
): T {
  quoteRenderDiagnostics.cellRendererCalls++
  quoteRenderDiagnostics.cellRendererCallsByName[name]++
  return value()
}

function trackLifecycle(componentName: QuoteComponentName): void {
  quoteRenderDiagnostics.componentRenderCalls++
  quoteRenderDiagnostics.componentRenderCallsByName[componentName]++
  onMount(() => {
    quoteCellLifecycle.created++
  })
  onCleanup(() => {
    quoteCellLifecycle.destroyed++
  })
}

export function PriceCell(props: {
  price: number
  move: number
  onSelect: () => void
}) {
  trackLifecycle('PriceCell')
  return (
    <button
      class="price-button"
      classList={{
        'quote-up': props.move >= 0,
        'quote-down': props.move < 0,
      }}
      onClick={props.onSelect}
    >
      {props.price.toFixed(2)}
    </button>
  )
}

export function StableMoveCell(props: { move: number }) {
  trackLifecycle('StableMoveCell')
  return (
    <span
      class="move-cell"
      classList={{
        'quote-up': props.move >= 0,
        'quote-down': props.move < 0,
      }}
    >
      {formatSigned(props.move)}
    </span>
  )
}

export function UpMoveCell(props: { move: number }) {
  trackLifecycle('UpMoveCell')
  return <span class="move-cell quote-up">▲ {formatSigned(props.move)}</span>
}

export function DownMoveCell(props: { move: number }) {
  trackLifecycle('DownMoveCell')
  return <span class="move-cell quote-down">▼ {formatSigned(props.move)}</span>
}

export function SpreadCell(props: { bid: number; ask: number }) {
  trackLifecycle('SpreadCell')
  const spread = () => Math.max(0, props.ask - props.bid)
  const basisPoints = () => {
    const midpoint = (props.bid + props.ask) / 2
    return midpoint === 0 ? 0 : (spread() / midpoint) * 10_000
  }

  return (
    <span class="spread-cell" classList={{ 'spread-wide': basisPoints() >= 4 }}>
      {spread().toFixed(2)}
      <small>{basisPoints().toFixed(1)} bp</small>
    </span>
  )
}

export function DepthCell(props: { bidSize: number; askSize: number }) {
  trackLifecycle('DepthCell')
  const bidShare = () => {
    const total = props.bidSize + props.askSize
    return total === 0 ? 50 : (props.bidSize / total) * 100
  }

  return (
    <div
      class="depth-cell"
      title={`Bid ${props.bidSize} / Ask ${props.askSize}`}
    >
      <span class="depth-bid" style={{ width: `${bidShare()}%` }} />
      <span class="depth-ask" style={{ width: `${100 - bidShare()}%` }} />
      <span class="depth-values">
        <span>{compactNumber.format(props.bidSize)}</span>
        <span>{compactNumber.format(props.askSize)}</span>
      </span>
    </div>
  )
}

export function QuoteAgeCell(props: { ageMs: number }) {
  trackLifecycle('QuoteAgeCell')
  return (
    <span
      class="quote-age"
      classList={{
        'quote-age-warm': props.ageMs >= 500,
        'quote-age-stale': props.ageMs >= 1_500,
      }}
    >
      {props.ageMs < 1_000
        ? `${Math.round(props.ageMs)} ms`
        : `${(props.ageMs / 1_000).toFixed(1)} s`}
    </span>
  )
}

export function SparklineCell(props: { values: ReadonlyArray<number> }) {
  trackLifecycle('SparklineCell')
  const points = () => {
    const min = Math.min(...props.values)
    const max = Math.max(...props.values)
    const range = max - min || 1
    const denominator = Math.max(1, props.values.length - 1)
    return props.values
      .map((value, index) => {
        const x = (index / denominator) * 100
        const y = 22 - ((value - min) / range) * 20
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  return (
    <svg class="sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
      <polyline points={points()} />
    </svg>
  )
}

function formatSigned(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}
