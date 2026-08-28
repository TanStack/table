import { useEffect } from 'octane'

export const quoteCellLifecycle = { created: 0, destroyed: 0 }

export const quoteCellRendererNames = [
  'Market', 'Name', 'Symbol', 'Last', 'Change', 'ChangePercent', 'Bid',
  'BidVolume', 'Ask', 'AskVolume', 'Open', 'High', 'Low', 'Intraday',
] as const

export const quoteComponentNames = [
  'PriceCell', 'StableMoveCell', 'UpMoveCell', 'DownMoveCell',
  'PercentChangeCell', 'SpreadCell', 'DepthCell', 'QuoteAgeCell',
  'SparklineCell',
] as const

export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]

const createCounterMap = <Name extends string,>(names: ReadonlyArray<Name>) =>
  Object.fromEntries(names.map((name) => [name, 0])) as Record<Name, number>

export const quoteRenderDiagnostics = {
  cellRendererCalls: 0,
  componentRenderCalls: 0,
  cellRendererCallsByName: createCounterMap(quoteCellRendererNames),
  componentRenderCallsByName: createCounterMap(quoteComponentNames),
}

export function recordCellRender<T>(name: QuoteCellRendererName, value: T): T {
  quoteRenderDiagnostics.cellRendererCalls++
  quoteRenderDiagnostics.cellRendererCallsByName[name]++
  return value
}

function useLifecycleCounter(name: QuoteComponentName): void {
  quoteRenderDiagnostics.componentRenderCalls++
  quoteRenderDiagnostics.componentRenderCallsByName[name]++
  useEffect(() => {
    quoteCellLifecycle.created++
    return () => { quoteCellLifecycle.destroyed++ }
  }, [])
}

export function PriceCell(props: { price: number; move: number; onSelect: () => void }) @{
  useLifecycleCounter('PriceCell')
  <button className={`price-button ${props.move >= 0 ? 'quote-up' : 'quote-down'}`} onClick={props.onSelect}>
    {props.price.toFixed(2)}
  </button>
}

export function StableMoveCell({ move }: { move: number }) @{
  useLifecycleCounter('StableMoveCell')
  <span className={`move-cell ${move >= 0 ? 'quote-up' : 'quote-down'}`}>{formatSigned(move)}</span>
}

export function UpMoveCell({ move }: { move: number }) @{
  useLifecycleCounter('UpMoveCell')
  <span className="move-cell quote-up">▲ {formatSigned(move)}</span>
}

export function DownMoveCell({ move }: { move: number }) @{
  useLifecycleCounter('DownMoveCell')
  <span className="move-cell quote-down">▼ {formatSigned(move)}</span>
}

export function PercentChangeCell({ value }: { value: number }) @{
  useLifecycleCounter('PercentChangeCell')
  <span className={`percent-change-cell ${value >= 0 ? 'quote-up' : 'quote-down'}`}>
    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
  </span>
}

export function SparklineCell({ values }: { values: ReadonlyArray<number> }) @{
  useLifecycleCounter('SparklineCell')
  const rising = (values.at(-1) ?? 0) >= (values[0] ?? 0)
  const first = values[0] ?? 0
  const range = values.reduce(
    (result, value) => ({ min: Math.min(result.min, value), max: Math.max(result.max, value) }),
    { min: first, max: first },
  )
  const scale = range.max - range.min || 1
  const denominator = Math.max(1, values.length - 1)
  const points = values.map((value, index) => {
    const x = (index / denominator) * 100
    const y = 22 - ((value - range.min) / scale) * 20
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  <svg className={`sparkline ${rising ? 'quote-up' : 'quote-down'}`} viewBox="0 0 100 24" preserveAspectRatio="none">
    <polyline points={points} />
  </svg>
}

const formatSigned = (value: number): string => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
