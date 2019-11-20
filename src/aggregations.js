export function sum(values, rows) {
  return values.reduce((sum, next) => sum + next, 0)
}

export function average(values, rows) {
  return Math.round((sum(values, rows) / values.length) * 100) / 100
}

export function median(values) {
  values = values.length ? values : [0]
  let min = Math.min(...values)
  let max = Math.max(...values)

  return (min + max) / 2
}

export function uniqueCount(values) {
  return new Set(values).size
}

export function count(values) {
  return values.length
}
