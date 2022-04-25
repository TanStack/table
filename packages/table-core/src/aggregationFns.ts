export const aggregationFns = {
  sum,
  min,
  max,
  extent,
  mean,
  median,
  unique,
  uniqueCount,
  count,
}

export type BuiltInAggregationFn = keyof typeof aggregationFns

function sum(_getLeafValues: () => unknown[], getChildValues: () => unknown[]) {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return getChildValues().reduce(
    (sum: number, next: unknown) => sum + (typeof next === 'number' ? next : 0),
    0
  )
}

function min(_getLeafValues: () => unknown[], getChildValues: () => unknown[]) {
  let min: number | undefined

  for (const value of getChildValues() as number[]) {
    if (
      value != null &&
      (min! > value || (min === undefined && value >= value))
    ) {
      min = value
    }
  }

  return min
}

function max(_getLeafValues: () => unknown[], getChildValues: () => unknown[]) {
  let max: number | undefined

  for (const value of getChildValues() as number[]) {
    if (
      value != null &&
      (max! < value || (max === undefined && value >= value))
    ) {
      max = value
    }
  }

  return max
}

function extent(
  _getLeafValues: () => unknown[],
  getChildValues: () => unknown[]
) {
  let min: number | undefined
  let max: number | undefined

  for (const value of getChildValues() as number[]) {
    if (value != null) {
      if (min === undefined) {
        if (value >= value) min = max = value
      } else {
        if (min > value) min = value
        if (max! < value) max = value
      }
    }
  }

  return [min, max]
}

export function mean(getLeafValues: () => unknown[]) {
  let count = 0
  let sum = 0

  for (let value of getLeafValues() as number[]) {
    if (value != null && (value = +value) >= value) {
      ++count, (sum += value)
    }
  }

  if (count) return sum / count

  return
}

function median(getLeafValues: () => unknown[]) {
  const leafValues = getLeafValues()
  if (!leafValues.length) {
    return
  }

  let min = 0
  let max = 0

  leafValues.forEach(value => {
    if (typeof value === 'number') {
      min = Math.min(min, value)
      max = Math.max(max, value)
    }
  })

  return (min + max) / 2
}

function unique<T>(getLeafValues: () => T[]) {
  return Array.from(new Set(getLeafValues()).values())
}

function uniqueCount(getLeafValues: () => unknown[]) {
  return new Set(getLeafValues()).size
}

function count(getLeafValues: () => unknown[]) {
  return getLeafValues().length
}
