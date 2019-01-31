export function sum (values, rows) {
  return values.reduce((sum, next) => sum + next, 0)
}

export function average (values, rows) {
  return Math.round((sum(values, rows) / values.length) * 100) / 100
}
