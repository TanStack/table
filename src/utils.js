export default {
  get,
  takeRight,
  last,
  orderBy,
  range,
  clone,
  remove
}

function remove (a, b) {
  return a.filter(function (o, i) {
    var r = b(o)
    if (r) {
      a.splice(i, 1)
      return true
    }
    return false
  })
}

function get (a, b) {
  if (isArray(b)) {
    b = b.join('.')
  }
  return b
    .replace('[', '.').replace(']', '')
    .split('.')
    .reduce(
      function (obj, property) {
        return obj[property]
      }, a
    )
}

function takeRight (arr, n) {
  const start = n > arr.length ? 0 : arr.length - n
  return arr.slice(start)
}

function last (arr) {
  return arr[arr.length - 1]
}

function range (n) {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(n)
  }
  return arr
}

function orderBy (arr, funcs) {
  return arr.sort((a, b) => {
    for (let i = 0; i < funcs.length; i++) {
      const comp = funcs[i]
      const ca = comp(a)
      const cb = comp(b)
      if (ca > cb) {
        return 1
      }
      if (ca < cb) {
        return -1
      }
    }
    return 0
  })
}

function clone (a) {
  return JSON.parse(JSON.stringify(a, function (key, value) {
    if (typeof value === 'function') {
      return value.toString()
    }
    return value
  }))
}

// ########################################################################
// Helpers
// ########################################################################

function isArray (a) {
  return Array.isArray(a)
}
