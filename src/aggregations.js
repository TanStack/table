export function sum(values, rows) {
  return values.reduce((sum, next) => sum + next, 0)
}

export function average(values, rows) {
  return Math.round((sum(values, rows) / values.length) * 100) / 100
}

export function median(values) {
  let min = values[0] || ''
  let max = values[0] || ''

  values.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })

  return (min + max) / 2
}

export function uniqueCount(values) {
  return new Set(values).size
}

export function count(values) {
  return values.length
}
