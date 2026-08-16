export const quoteCellLifecycle = { created: 0, destroyed: 0 }

export const quoteCellRendererNames = [
  'Market', 'Name', 'Symbol', 'Last', 'Change', 'ChangePercent', 'Bid',
  'BidVolume', 'Ask', 'AskVolume', 'Open', 'High', 'Low', 'Intraday',
] as const

export const quoteComponentNames = [
  'PriceCell', 'StableMoveCell', 'UpMoveCell', 'DownMoveCell',
  'PercentChangeCell', 'SparklineCell',
] as const

export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]

const createCounterMap = <Name extends string>(names: ReadonlyArray<Name>) =>
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

export function recordComponentRender(name: QuoteComponentName): void {
  quoteRenderDiagnostics.componentRenderCalls++
  quoteRenderDiagnostics.componentRenderCallsByName[name]++
}

export function formatSigned(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

export function sparklinePoints(values: ReadonlyArray<number>): string {
  const first = values[0] ?? 0
  const range = values.reduce(
    (current, value) => ({
      min: Math.min(current.min, value),
      max: Math.max(current.max, value),
    }),
    { min: first, max: first },
  )
  const height = range.max - range.min || 1
  const denominator = Math.max(1, values.length - 1)
  return values
    .map((value, index) => {
      const x = (index / denominator) * 100
      const y = 22 - ((value - range.min) / height) * 20
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
