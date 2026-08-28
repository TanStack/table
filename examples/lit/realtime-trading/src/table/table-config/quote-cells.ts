import { LitElement, html, svg } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export const quoteCellLifecycle = { created: 0, destroyed: 0 }
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
  'SparklineCell',
] as const
export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]
const counters = <Name extends string>(names: ReadonlyArray<Name>) =>
  Object.fromEntries(names.map((name) => [name, 0])) as Record<Name, number>
export const quoteRenderDiagnostics = {
  cellRendererCalls: 0,
  componentRenderCalls: 0,
  cellRendererCallsByName: counters(quoteCellRendererNames),
  componentRenderCallsByName: counters(quoteComponentNames),
}
export function recordCellRender<T>(name: QuoteCellRendererName, value: T): T {
  quoteRenderDiagnostics.cellRendererCalls++
  quoteRenderDiagnostics.cellRendererCallsByName[name]++
  return value
}
const signed = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`

abstract class QuoteElement extends LitElement {
  protected abstract readonly componentName: QuoteComponentName
  protected createRenderRoot() {
    return this
  }
  connectedCallback() {
    super.connectedCallback()
    quoteCellLifecycle.created++
  }
  disconnectedCallback() {
    quoteCellLifecycle.destroyed++
    super.disconnectedCallback()
  }
  protected recordRender() {
    quoteRenderDiagnostics.componentRenderCalls++
    quoteRenderDiagnostics.componentRenderCallsByName[this.componentName]++
  }
}

@customElement('quote-price-cell')
export class PriceCell extends QuoteElement {
  protected readonly componentName = 'PriceCell'
  @property({ type: Number }) price = 0
  @property({ type: Number }) move = 0
  @property({ attribute: false }) select: () => void = () => undefined
  protected render() {
    this.recordRender()
    return html`<button
      class="price-button ${this.move >= 0 ? 'quote-up' : 'quote-down'}"
      @click=${this.select}
    >
      ${this.price.toFixed(2)}
    </button>`
  }
}

abstract class MoveCell extends QuoteElement {
  @property({ type: Number }) move = 0
  protected direction: 'up' | 'down' | null = null
  protected indicator = ''
  protected render() {
    this.recordRender()
    const direction = this.direction ?? (this.move >= 0 ? 'up' : 'down')
    return html`<span class="move-cell quote-${direction}"
      >${this.indicator}${signed(this.move)}</span
    >`
  }
}
@customElement('quote-stable-move')
export class StableMoveCell extends MoveCell {
  protected readonly componentName = 'StableMoveCell'
}
@customElement('quote-up-move')
export class UpMoveCell extends MoveCell {
  protected readonly componentName = 'UpMoveCell'
  protected direction = 'up' as const
  protected indicator = '▲ '
}
@customElement('quote-down-move')
export class DownMoveCell extends MoveCell {
  protected readonly componentName = 'DownMoveCell'
  protected direction = 'down' as const
  protected indicator = '▼ '
}

@customElement('quote-percent-change')
export class PercentChangeCell extends QuoteElement {
  protected readonly componentName = 'PercentChangeCell'
  @property({ type: Number }) value = 0
  protected render() {
    this.recordRender()
    return html`<span
      class="percent-change-cell ${this.value >= 0 ? 'quote-up' : 'quote-down'}"
      >${signed(this.value)}%</span
    >`
  }
}

@customElement('quote-sparkline')
export class SparklineCell extends QuoteElement {
  protected readonly componentName = 'SparklineCell'
  @property({ attribute: false }) values: ReadonlyArray<number> = []
  protected render() {
    this.recordRender()
    const first = this.values[0] ?? 0
    const range = this.values.reduce(
      (current, value) => ({
        min: Math.min(current.min, value),
        max: Math.max(current.max, value),
      }),
      { min: first, max: first },
    )
    const height = range.max - range.min || 1
    const denominator = Math.max(1, this.values.length - 1)
    const points = this.values
      .map(
        (value, index) =>
          `${((index / denominator) * 100).toFixed(1)},${(22 - ((value - range.min) / height) * 20).toFixed(1)}`,
      )
      .join(' ')
    const rising = (this.values.at(-1) ?? 0) >= first
    return svg`<svg class="sparkline ${rising ? 'quote-up' : 'quote-down'}" viewBox="0 0 100 24" preserveAspectRatio="none"><polyline points=${points}></polyline></svg>`
  }
}
