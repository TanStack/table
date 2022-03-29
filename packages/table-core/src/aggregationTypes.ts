export const aggregationTypes = {
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

export type BuiltInAggregationType = keyof typeof aggregationTypes

function sum(_leafValues: unknown[], childValues: unknown[]) {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return childValues.reduce(
    (sum: number, next: unknown) => sum + (typeof next === 'number' ? next : 0),
    0
  )
}

function min(_leafValues: unknown[], childValues: unknown[]) {
  let min: number | undefined

  for (const value of childValues as number[]) {
    if (
      value != null &&
      (min! > value || (min === undefined && value >= value))
    ) {
      min = value
    }
  }

  return min
}

function max(_leafValues: unknown[], childValues: unknown[]) {
  let max: number | undefined

  for (const value of childValues as number[]) {
    if (
      value != null &&
      (max! < value || (max === undefined && value >= value))
    ) {
      max = value
    }
  }

  return max
}

function extent(_leafValues: unknown[], childValues: unknown[]) {
  let min: number | undefined
  let max: number | undefined

  for (const value of childValues as number[]) {
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

function mean(leafValues: unknown[]) {
  let count = 0
  let sum = 0

  for (let value of leafValues as number[]) {
    if (value != null && (value = +value) >= value) {
      ++count, (sum += value)
    }
  }

  if (count) return sum / count

  return
}

function median(values: unknown[]) {
  if (!values.length) {
    return
  }

  let min = 0
  let max = 0

  values.forEach(value => {
    if (typeof value === 'number') {
      min = Math.min(min, value)
      max = Math.max(max, value)
    }
  })

  return (min + max) / 2
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values).values())
}

function uniqueCount(values: unknown[]) {
  return new Set(values).size
}

function count(values: unknown[]) {
  return values.length
}
