export const quoteCellLifecycle = { created: 0, destroyed: 0 }
export const quoteCellRendererNames = ['Market', 'Name', 'Symbol', 'Last', 'Change', 'ChangePercent', 'Bid', 'BidVolume', 'Ask', 'AskVolume', 'Open', 'High', 'Low', 'Intraday'] as const
export const quoteComponentNames = ['PriceCell', 'StableMoveCell', 'UpMoveCell', 'DownMoveCell', 'PercentChangeCell', 'SparklineCell'] as const
export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]
const counters = <Name extends string>(names: ReadonlyArray<Name>) => Object.fromEntries(names.map((name) => [name, 0])) as Record<Name, number>
export const quoteRenderDiagnostics = { cellRendererCalls: 0, componentRenderCalls: 0, cellRendererCallsByName: counters(quoteCellRendererNames), componentRenderCallsByName: counters(quoteComponentNames) }
export function recordCellRender<T>(name: QuoteCellRendererName, value: T): T { quoteRenderDiagnostics.cellRendererCalls++; quoteRenderDiagnostics.cellRendererCallsByName[name]++; return value }
const signed = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`

abstract class QuoteElement extends HTMLElement {
  protected abstract readonly componentName: QuoteComponentName
  connectedCallback() { quoteCellLifecycle.created++; this.renderCell() }
  disconnectedCallback() { quoteCellLifecycle.destroyed++ }
  attributeChangedCallback() { if (this.isConnected) this.renderCell() }
  protected renderCell() { quoteRenderDiagnostics.componentRenderCalls++; quoteRenderDiagnostics.componentRenderCallsByName[this.componentName]++ }
  protected number(name: string) { return Number(this.getAttribute(name) ?? 0) }
}

class PriceCell extends QuoteElement {
  protected readonly componentName = 'PriceCell'
  static observedAttributes = ['price', 'move']
  protected renderCell() { super.renderCell(); const price = this.number('price'); const move = this.number('move'); this.innerHTML = `<button class="price-button ${move >= 0 ? 'quote-up' : 'quote-down'}">${price.toFixed(2)}</button>` }
}
abstract class MoveCell extends QuoteElement {
  static observedAttributes = ['move']
  protected direction: 'up' | 'down' | null = null
  protected indicator = ''
  protected renderCell() { super.renderCell(); const move = this.number('move'); const direction = this.direction ?? (move >= 0 ? 'up' : 'down'); this.innerHTML = `<span class="move-cell quote-${direction}">${this.indicator}${signed(move)}</span>` }
}
class StableMoveCell extends MoveCell { protected readonly componentName = 'StableMoveCell' }
class UpMoveCell extends MoveCell { protected readonly componentName = 'UpMoveCell'; protected direction = 'up' as const; protected indicator = '▲ ' }
class DownMoveCell extends MoveCell { protected readonly componentName = 'DownMoveCell'; protected direction = 'down' as const; protected indicator = '▼ ' }
class PercentChangeCell extends QuoteElement {
  protected readonly componentName = 'PercentChangeCell'
  static observedAttributes = ['value']
  protected renderCell() { super.renderCell(); const value = this.number('value'); this.innerHTML = `<span class="percent-change-cell ${value >= 0 ? 'quote-up' : 'quote-down'}">${signed(value)}%</span>` }
}
class SparklineCell extends QuoteElement {
  protected readonly componentName = 'SparklineCell'
  static observedAttributes = ['points', 'rising']
  protected renderCell() { super.renderCell(); this.innerHTML = `<svg class="sparkline ${this.getAttribute('rising') === 'true' ? 'quote-up' : 'quote-down'}" viewBox="0 0 100 24" preserveAspectRatio="none"><polyline points="${this.getAttribute('points') ?? ''}"></polyline></svg>` }
}

const definitions = [
  ['quote-price-cell', PriceCell], ['quote-stable-move', StableMoveCell], ['quote-up-move', UpMoveCell],
  ['quote-down-move', DownMoveCell], ['quote-percent-change', PercentChangeCell], ['quote-sparkline', SparklineCell],
] as const
for (const [name, definition] of definitions) if (!customElements.get(name)) customElements.define(name, definition)

export function sparklineMarkup(values: ReadonlyArray<number>): string {
  const first = values[0] ?? 0
  const range = values.reduce((current, value) => ({ min: Math.min(current.min, value), max: Math.max(current.max, value) }), { min: first, max: first })
  const height = range.max - range.min || 1; const denominator = Math.max(1, values.length - 1)
  const points = values.map((value, index) => `${((index / denominator) * 100).toFixed(1)},${(22 - ((value - range.min) / height) * 20).toFixed(1)}`).join(' ')
  return `<quote-sparkline points="${points}" rising="${(values.at(-1) ?? 0) >= first}"></quote-sparkline>`
}
