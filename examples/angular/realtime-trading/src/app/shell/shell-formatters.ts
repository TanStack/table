const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatInteger = (value: number): string =>
  integerFormatter.format(value)
export const formatRate = (value: number): string =>
  rateFormatter.format(value)
export const formatMs = (value: number): string => `${value.toFixed(2)} ms`

export const selectValue = (event: Event): string =>
  (event.target as HTMLSelectElement).value
export const inputValue = (event: Event): string =>
  (event.target as HTMLInputElement).value
export const inputChecked = (event: Event): boolean =>
  (event.target as HTMLInputElement).checked
