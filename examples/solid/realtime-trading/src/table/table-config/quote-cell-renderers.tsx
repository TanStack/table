import { Show } from 'solid-js'
import { useTradingRowData } from '../trading-row-data-context'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import { getDayChange, getDayChangePercent } from './market-quote-values'

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function createPriceCellRenderer(
  onSelectSymbol: (symbol: string) => void,
) {
  return function PriceCellRenderer() {
    const quote = useTradingRowData()
    return recordCellRender('Last', () => (
      <PriceCell
        price={quote().price}
        move={getDayChange(quote())}
        onSelect={() => onSelectSymbol(quote().symbol)}
      />
    ))
  }
}

export function StableMoveCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Change', () => (
    <StableMoveCell move={getDayChange(quote())} />
  ))
}

export function SwappingMoveCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Change', () => (
    <Show
      when={getDayChange(quote()) >= 0}
      fallback={<DownMoveCell move={getDayChange(quote())} />}
    >
      <UpMoveCell move={getDayChange(quote())} />
    </Show>
  ))
}

export function PercentChangeCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('ChangePercent', () => (
    <PercentChangeCell value={getDayChangePercent(quote())} />
  ))
}

export function SparklineCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Intraday', () => (
    <SparklineCell values={quote().history} />
  ))
}

export function MarketCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Market', () => <>{quote().venue}</>)
}

export function NameCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Name', () => <>{quote().company}</>)
}

export function SymbolCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Symbol', () => <>{quote().symbol}</>)
}

export function BidCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Bid', () => <>{quote().bid.toFixed(2)}</>)
}

export function BidVolumeCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('BidVolume', () => (
    <>{compactFormatter.format(quote().bidSize)}</>
  ))
}

export function AskCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Ask', () => <>{quote().ask.toFixed(2)}</>)
}

export function AskVolumeCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('AskVolume', () => (
    <>{compactFormatter.format(quote().askSize)}</>
  ))
}

export function OpenCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Open', () => <>{quote().open.toFixed(2)}</>)
}

export function HighCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('High', () => <>{quote().high.toFixed(2)}</>)
}

export function LowCellRenderer() {
  const quote = useTradingRowData()
  return recordCellRender('Low', () => <>{quote().low.toFixed(2)}</>)
}
