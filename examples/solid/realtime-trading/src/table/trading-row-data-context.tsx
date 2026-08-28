import { createContext, useContext } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import type { MarketQuote } from '../feed/market-data'

export interface TradingRowDataProviderProps {
  quote: Accessor<MarketQuote>
  children?: JSX.Element
}

const TradingRowDataContext = createContext<Accessor<MarketQuote>>()

export function TradingRowDataProvider(props: TradingRowDataProviderProps) {
  return (
    <TradingRowDataContext.Provider value={props.quote}>
      {props.children}
    </TradingRowDataContext.Provider>
  )
}

export function useTradingRowData(): Accessor<MarketQuote> {
  const quote = useContext(TradingRowDataContext)
  if (!quote) {
    throw new Error('Trading cell renderers require TradingRowDataProvider')
  }
  return quote
}
