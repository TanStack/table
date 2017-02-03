import React from 'react'
import classnames from 'classnames'
//
export default {
  get,
  set,
  takeRight,
  last,
  orderBy,
  range,
  remove,
  clone,
  getFirstDefined,
  sum,
  makeTemplateComponent,
  groupBy,
  isArray,
  splitProps
}

function get (obj, path, def) {
  if (!path) {
    return obj
  }
  const pathObj = makePathArray(path)
  let val
  try {
    val = pathObj.reduce((current, pathPart) => current[pathPart], obj)
  } catch (e) {}
  return typeof val !== 'undefined' ? val : def
}

function set (obj = {}, path, value) {
  const keys = makePathArray(path)
  let keyPart
  let cursor = obj
  while ((keyPart = keys.shift()) && keys.length) {
    if (!cursor[keyPart]) {
      cursor[keyPart] = {}
    }
    cursor = cursor[keyPart]
  }
  cursor[keyPart] = value
  return obj
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

function orderBy (arr, funcs, dirs) {
  return arr.sort((a, b) => {
    for (let i = 0; i < funcs.length; i++) {
      const comp = funcs[i]
      const ca = comp(a)
      const cb = comp(b)
      const desc = dirs[i] === false || dirs[i] === 'desc'
      if (ca > cb) {
        return desc ? -1 : 1
      }
      if (ca < cb) {
        return desc ? 1 : -1
      }
    }
    return dirs[0]
      ? a.__index - b.__index
      : b.__index - b.__index
  })
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

function clone (a) {
  try {
    return JSON.parse(JSON.stringify(a, (key, value) => {
      if (typeof value === 'function') {
        return value.toString()
      }
      return value
    }))
  } catch (e) {
    return a
  }
}

function getFirstDefined (...args) {
  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

function sum (arr) {
  return arr.reduce((a, b) => {
    return a + b
  }, 0)
}

function makeTemplateComponent (compClass) {
  return ({children, className, ...rest}) => (
    <div
      className={classnames(compClass, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

function groupBy (xs, key) {
  return xs.reduce((rv, x, i) => {
    const resKey = typeof key === 'function' ? key(x, i) : x[key]
    rv[resKey] = isArray(rv[resKey]) ? rv[resKey] : []
    rv[resKey].push(x)
    return rv
  }, {})
}

function isArray (a) {
  return Array.isArray(a)
}

// ########################################################################
// Non-exported Helpers
// ########################################################################

function makePathArray (obj) {
  return flattenDeep(obj)
      .join('.')
      .replace('[', '.')
      .replace(']', '')
      .split('.')
}

function flattenDeep (arr, newArr = []) {
  if (!isArray(arr)) {
    newArr.push(arr)
  } else {
    for (var i = 0; i < arr.length; i++) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}

function splitProps ({className, style, ...rest}) {
  return {
    className,
    style,
    rest
  }
}
