export interface ConfiguratorOption<TValue extends number | string> {
  readonly label: string
  readonly value: TValue
}

const instrumentCountOptions = [
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '150', value: 150 },
  { label: '250', value: 250 },
  { label: '350', value: 350 },
  { label: '500', value: 500 },
  { label: '750', value: 750 },
  { label: '1,000', value: 1_000 },
  { label: '1,500', value: 1_500 },
  { label: '2,500', value: 2_500 },
  { label: '5,000', value: 5_000 },
  { label: '1,000,000', value: 1_000_000 },
  { label: '10,000,000', value: 10_000_000 },
] as const satisfies ReadonlyArray<ConfiguratorOption<number>>

const workerDeliveryOptions = [
  { label: '8 ms · 125 msg/s', value: 8 },
  { label: '16 ms · 62.5 msg/s', value: 16 },
  { label: '20 ms · 50 msg/s', value: 20 },
  { label: '33 ms · 30 msg/s', value: 33 },
  { label: '50 ms · 20 msg/s', value: 50 },
  { label: '100 ms · 10 msg/s', value: 100 },
  { label: '250 ms · 4 msg/s', value: 250 },
  { label: '500 ms · 2 msg/s', value: 500 },
  { label: '1,000 ms · 1 msg/s', value: 1_000 },
] as const satisfies ReadonlyArray<ConfiguratorOption<number>>

const intradaySamplingOptions = [
  { label: '16 ms · fastest', value: 16 },
  { label: '33 ms · very fast', value: 33 },
  { label: '50 ms · fast', value: 50 },
  { label: '100 ms', value: 100 },
  { label: '250 ms', value: 250 },
  { label: '500 ms', value: 500 },
  { label: '1,000 ms', value: 1_000 },
  { label: '2,000 ms', value: 2_000 },
] as const satisfies ReadonlyArray<ConfiguratorOption<number>>

export const configuratorOptions = {
  instrumentCounts: instrumentCountOptions,
  workerDeliveryIntervals: workerDeliveryOptions,
  intradaySamplingIntervals: intradaySamplingOptions,
} as const
