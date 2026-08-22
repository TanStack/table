export type RendererMode = 'stable' | 'swap'

export interface TradingColumnState {
  rendererMode: () => RendererMode
  selectSymbol: (symbol: string) => void
}

export const TRADING_COLUMN_COUNT = 14
