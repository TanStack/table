import { useEffect } from 'react'

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const quoteCellLifecycle = {
  created: 0,
  destroyed: 0,
}

export const quoteCellRendererNames = [
  'Market',
  'Name',
  'Symbol',
  'Last',
  'Change',
  'ChangePercent',
  'Bid',
  'BidVolume',
  'Ask',
  'AskVolume',
  'Open',
  'High',
  'Low',
  'Intraday',
] as const

export const quoteComponentNames = [
  'PriceCell',
  'StableMoveCell',
  'UpMoveCell',
  'DownMoveCell',
  'PercentChangeCell',
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

export function recordCellRender<T>(name: QuoteCellRendererName, value: T): T {
  'use no memo'
  // Benchmark instrumentation is intentionally impure and must run per call.
  quoteRenderDiagnostics.cellRendererCalls++
  quoteRenderDiagnostics.cellRendererCallsByName[name]++
  return value
}

function useLifecycleCounter(componentName: QuoteComponentName): void {
  'use no memo'
  // This diagnostic mutation measures component-function invocation itself.
  quoteRenderDiagnostics.componentRenderCalls++
  quoteRenderDiagnostics.componentRenderCallsByName[componentName]++
  useEffect(() => {
    quoteCellLifecycle.created++
    return () => {
      quoteCellLifecycle.destroyed++
    }
  }, [])
}

export function PriceCell(props: {
  price: number
  move: number
  onSelect: () => void
}) {
  useLifecycleCounter('PriceCell')
  return (
    <button
      className={`price-button ${props.move >= 0 ? 'quote-up' : 'quote-down'}`}
      onClick={props.onSelect}
    >
      {props.price.toFixed(2)}
    </button>
  )
}

export function StableMoveCell({ move }: { move: number }) {
  useLifecycleCounter('StableMoveCell')
  return (
    <span className={`move-cell ${move >= 0 ? 'quote-up' : 'quote-down'}`}>
      {formatSigned(move)}
    </span>
  )
}

export function UpMoveCell({ move }: { move: number }) {
  useLifecycleCounter('UpMoveCell')
  return <span className="move-cell quote-up">▲ {formatSigned(move)}</span>
}

export function DownMoveCell({ move }: { move: number }) {
  useLifecycleCounter('DownMoveCell')
  return <span className="move-cell quote-down">▼ {formatSigned(move)}</span>
}

export function PercentChangeCell({ value }: { value: number }) {
  useLifecycleCounter('PercentChangeCell')
  return (
    <span
      className={`percent-change-cell ${value >= 0 ? 'quote-up' : 'quote-down'}`}
    >
      {value >= 0 ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  )
}

export function SpreadCell({ bid, ask }: { bid: number; ask: number }) {
  useLifecycleCounter('SpreadCell')
  const spread = Math.max(0, ask - bid)
  const midpoint = (bid + ask) / 2
  const basisPoints = midpoint === 0 ? 0 : (spread / midpoint) * 10_000

  return (
    <span className={`spread-cell ${basisPoints >= 4 ? 'spread-wide' : ''}`}>
      {spread.toFixed(2)}
      <small>{basisPoints.toFixed(1)} bp</small>
    </span>
  )
}

export function DepthCell(props: { bidSize: number; askSize: number }) {
  useLifecycleCounter('DepthCell')
  const total = props.bidSize + props.askSize
  const bidShare = total === 0 ? 50 : (props.bidSize / total) * 100

  return (
    <div
      className="depth-cell"
      title={`Bid ${props.bidSize} / Ask ${props.askSize}`}
    >
      <span className="depth-bid" style={{ width: `${bidShare}%` }} />
      <span className="depth-ask" style={{ width: `${100 - bidShare}%` }} />
      <span className="depth-values">
        <span>{compactNumber.format(props.bidSize)}</span>
        <span>{compactNumber.format(props.askSize)}</span>
      </span>
    </div>
  )
}

export function QuoteAgeCell({ ageMs }: { ageMs: number }) {
  useLifecycleCounter('QuoteAgeCell')
  const className =
    ageMs >= 1_500
      ? 'quote-age quote-age-stale'
      : ageMs >= 500
        ? 'quote-age quote-age-warm'
        : 'quote-age'

  return (
    <span className={className}>
      {ageMs < 1_000
        ? `${Math.round(ageMs)} ms`
        : `${(ageMs / 1_000).toFixed(1)} s`}
    </span>
  )
}

export function SparklineCell({ values }: { values: ReadonlyArray<number> }) {
  useLifecycleCounter('SparklineCell')
  const rising = (values.at(-1) ?? 0) >= (values[0] ?? 0)
  const { min, max } = findRange(values)
  const range = max - min || 1
  const denominator = Math.max(1, values.length - 1)
  const points = values
    .map((value, index) => {
      const x = (index / denominator) * 100
      const y = 22 - ((value - min) / range) * 20
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      className={`sparkline ${rising ? 'quote-up' : 'quote-down'}`}
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
    >
      <polyline points={points} />
    </svg>
  )
}

function formatSigned(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

function findRange(values: ReadonlyArray<number>): {
  min: number
  max: number
} {
  const first = values[0] ?? 0
  return values.reduce(
    (range, value) => {
      range.min = Math.min(range.min, value)
      range.max = Math.max(range.max, value)
      return range
    },
    { min: first, max: first },
  )
}
