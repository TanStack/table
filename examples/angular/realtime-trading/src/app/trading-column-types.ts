export type RendererMode = 'stable' | 'swap'

export interface TradingColumnState {
  quoteClock: () => number
  rendererMode: () => RendererMode
  selectSymbol: (symbol: string) => void
  updateQuoteAges: () => boolean
}

export const TRADING_COLUMN_COUNT = 14
