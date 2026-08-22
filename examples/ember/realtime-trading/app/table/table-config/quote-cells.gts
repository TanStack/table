import Component from '@glimmer/component'
import { registerDestructor } from '@ember/destroyable'
import { on } from '@ember/modifier'
import type Owner from '@ember/owner'
import type { CellRenderableSignature } from '@tanstack/ember-table'
import type { MarketQuote } from '../../feed/market-data'
import type { tradingFeatures } from '../trading-features'

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
  'SpreadCell',
  'DepthCell',
  'QuoteAgeCell',
  'SparklineCell',
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

interface PriceOptions {
  selectSymbol: (symbol: string) => void
}
abstract class QuoteCell<Signature> extends Component<Signature> {
  constructor(owner: Owner, args: object, name: QuoteComponentName) {
    super(owner, args)
    quoteCellLifecycle.created++
    registerDestructor(this, () => {
      quoteCellLifecycle.destroyed++
    })
  }
}

export class PriceCell extends QuoteCell<
  CellRenderableSignature<
    typeof tradingFeatures,
    MarketQuote,
    number,
    PriceOptions
  >
> {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'PriceCell')
  }
  get quote() {
    return this.args.ctx.row.original
  }
  select = () => {
    this.args.options?.selectSymbol(this.quote.symbol)
  }
  <template>
    {{recordComponent 'PriceCell'}}
    <button
      class='price-button
        {{if (isPositive this.quote) "quote-up" "quote-down"}}'
      type='button'
      {{on 'click' this.select}}
    >
      {{fixed this.quote.price}}
    </button>
  </template>
}

abstract class MoveCellBase extends QuoteCell<
  CellRenderableSignature<typeof tradingFeatures, MarketQuote, number>
> {
  get move() {
    return (
      this.args.ctx.row.original.price -
      this.args.ctx.row.original.previousClose
    )
  }
  get positive() {
    return this.move >= 0
  }
}

export class StableMoveCell extends MoveCellBase {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'StableMoveCell')
  }
  <template>
    {{recordComponent 'StableMoveCell'}}
    <span
      class='move-cell {{if this.positive "quote-up" "quote-down"}}'
    >{{signed this.move}}</span>
  </template>
}

export class UpMoveCell extends MoveCellBase {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'UpMoveCell')
  }
  <template>
    {{recordComponent 'UpMoveCell'}}
    <span class='move-cell quote-up'>▲ {{signed this.move}}</span>
  </template>
}

export class DownMoveCell extends MoveCellBase {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'DownMoveCell')
  }
  <template>
    {{recordComponent 'DownMoveCell'}}
    <span class='move-cell quote-down'>▼ {{signed this.move}}</span>
  </template>
}

export class PercentChangeCell extends QuoteCell<
  CellRenderableSignature<typeof tradingFeatures, MarketQuote, number>
> {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'PercentChangeCell')
  }
  get value() {
    const quote = this.args.ctx.row.original
    return quote.previousClose === 0
      ? 0
      : ((quote.price - quote.previousClose) / quote.previousClose) * 100
  }
  <template>
    {{recordComponent 'PercentChangeCell'}}
    <span
      class='percent-change-cell
        {{if (nonNegative this.value) "quote-up" "quote-down"}}'
    >{{percent this.value}}</span>
  </template>
}

export class SparklineCell extends QuoteCell<
  CellRenderableSignature<typeof tradingFeatures, MarketQuote>
> {
  constructor(owner: Owner, args: object) {
    super(owner, args, 'SparklineCell')
  }
  get values() {
    return this.args.ctx.row.original.history
  }
  get rising() {
    return (this.values.at(-1) ?? 0) >= (this.values[0] ?? 0)
  }
  get points() {
    const first = this.values[0] ?? 0
    const range = this.values.reduce(
      (result, value) => ({
        min: Math.min(result.min, value),
        max: Math.max(result.max, value),
      }),
      { min: first, max: first },
    )
    const scale = range.max - range.min || 1
    const denominator = Math.max(1, this.values.length - 1)
    return this.values
      .map((value, index) => {
        const x = (index / denominator) * 100
        const y = 22 - ((value - range.min) / scale) * 20
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }
  <template>
    {{recordComponent 'SparklineCell'}}
    <svg
      class='sparkline {{if this.rising "quote-up" "quote-down"}}'
      viewBox='0 0 100 24'
      preserveAspectRatio='none'
    ><polyline points={{this.points}} /></svg>
  </template>
}

const fixed = (value: number): string => value.toFixed(2)
const signed = (value: number): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
const percent = (value: number): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
const nonNegative = (value: number): boolean => value >= 0
const isPositive = (quote: MarketQuote): boolean =>
  quote.price - quote.previousClose >= 0
const recordComponent = (name: QuoteComponentName): string => {
  quoteRenderDiagnostics.componentRenderCalls++
  quoteRenderDiagnostics.componentRenderCallsByName[name]++
  return ''
}
