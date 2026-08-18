export interface PriceCellProps {
  price: number
  move: number
  onSelect: () => void
}

export interface MoveCellProps {
  move: number
}

export interface PercentChangeCellProps {
  value: number
}

export interface SpreadCellProps {
  bid: number
  ask: number
}

export interface DepthCellProps {
  bidSize: number
  askSize: number
}

export interface QuoteAgeCellProps {
  ageMs: number
}

export interface SparklineCellProps {
  values: ReadonlyArray<number>
}
