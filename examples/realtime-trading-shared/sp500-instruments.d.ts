export type MarketCode =
  | 'US'
  | 'NL'
  | 'DE'
  | 'FR'
  | 'IT'
  | 'ES'
  | 'CH'
  | 'DK'
  | 'SE'
  | 'FI'
  | 'GB'
  | 'KR'
  | 'JP'
  | 'HK'
  | 'CA'
  | 'AU'

export type BaseInstrument = readonly [
  symbol: string,
  company: string,
  market: MarketCode,
]

export declare const sp500Instruments: ReadonlyArray<BaseInstrument>
export declare const internationalInstruments: ReadonlyArray<BaseInstrument>
export declare const globalInstruments: ReadonlyArray<BaseInstrument>
