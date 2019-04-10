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
  compare,
  getFirstDefined,
  sum,
  makeTemplateComponent,
  groupBy,
  isArray,
  splitProps,
  compactObject,
  isSortingDesc,
  normalizeComponent,
  asPx,
}

function get (obj, path, def) {
  if (!path) {
    return obj
  }
  const pathObj = makePathArray(path)
  let val
  try {
    val = pathObj.reduce((current, pathPart) => current[pathPart], obj)
  } catch (e) {
    // continue regardless of error
  }
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
  for (let i = 0; i < n; i += 1) {
    arr.push(n)
  }
  return arr
}

function orderBy (arr, funcs, dirs, indexKey) {
  return arr.sort((rowA, rowB) => {
    for (let i = 0; i < funcs.length; i += 1) {
      const comp = funcs[i]
      const desc = dirs[i] === false || dirs[i] === 'desc'
      const sortInt = comp(rowA, rowB)
      if (sortInt) {
        return desc ? -sortInt : sortInt
      }
    }
    // Use the row index for tie breakers
    return dirs[0] ? rowA[indexKey] - rowB[indexKey] : rowB[indexKey] - rowA[indexKey]
  })
}

function remove (a, b) {
  return a.filter((o, i) => {
    const r = b(o)
    if (r) {
      a.splice(i, 1)
      return true
    }
    return false
  })
}

// function clone (a) {
//   try {
//     return JSON.parse(
//       JSON.stringify(a, (key, value) => {
//         if (typeof value === 'function') {
//           return value.toString()
//         }
//         return value
//       })
//     )
//   } catch (e) {
//     return a
//   }
// }

function getFirstDefined (...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

function sum (arr) {
  return arr.reduce((a, b) => a + b, 0)
}

function makeTemplateComponent (compClass, displayName) {
  if (!displayName) {
    throw new Error('No displayName found for template component:', compClass)
  }
  const cmp = ({ children, className, ...rest }) => (
    <div className={classnames(compClass, className)} {...rest}>
      {children}
    </div>
  )
  cmp.displayName = displayName
  return cmp
}

function groupBy (xs, key) {
  return xs.reduce((rv, x, i) => {
    const resKey = typeof key === 'function' ? key(x, i) : x[key]
    rv[resKey] = isArray(rv[resKey]) ? rv[resKey] : []
    rv[resKey].push(x)
    return rv
  }, {})
}

function asPx (value) {
  value = Number(value)
  return Number.isNaN(value) ? null : `${value}px`
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
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
}

function flattenDeep (arr, newArr = []) {
  if (!isArray(arr)) {
    newArr.push(arr)
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}

function splitProps ({ className, style, ...rest }) {
  return {
    className,
    style,
    rest: rest || {},
  }
}

function compactObject (obj) {
  const newObj = {}
  if (obj) {
    Object.keys(obj).map(key => {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        obj[key] !== undefined &&
        typeof obj[key] !== 'undefined'
      ) {
        newObj[key] = obj[key]
      }
      return true
    })
  }
  return newObj
}

function isSortingDesc (d) {
  return !!(d.sort === 'desc' || d.desc === true || d.asc === false)
}

function normalizeComponent (Comp, params = {}, fallback = Comp) {
  return typeof Comp === 'function' ? (
    <Comp {...params} />
  ) : (
    fallback
  )
}

function clone (obj) {
  if (typeof obj === 'function') {
    return JSON.parse(JSON.stringify(obj.toString()))
  }
  const result = Array.isArray(obj) ? [] : {}
  /* eslint-disable guard-for-in */
  /* eslint-disable no-restricted-syntax */
  for (const key in obj) {
    // include prototype properties
    const value = obj[key]
    const type = {}.toString.call(value).slice(8, -1)
    if (type === 'Array' || type === 'Object') {
      result[key] = clone(value)
    } else if (type === 'Date') {
      result[key] = new Date(value.getTime())
    } else if (type === 'RegExp') {
      result[key] = RegExp(value.source, getRegExpFlags(value))
    } else {
      result[key] = value
    }
  }
  return result
}

/* eslint-disable no-unused-expressions */
function getRegExpFlags (regExp) {
  if (typeof regExp.source.flags === 'string') {
    return regExp.source.flags
  }
  const flags = []
  regExp.global && flags.push('g')
  regExp.ignoreCase && flags.push('i')
  regExp.multiline && flags.push('m')
  regExp.sticky && flags.push('y')
  regExp.unicode && flags.push('u')
  return flags.join('')
}

function compare(value1, value2) {
  if (value1 === value2) {
    return true;
  }
  /* eslint-disable no-self-compare */
  // if both values are NaNs return true
  if ((value1 !== value1) && (value2 !== value2)) {
    return true;
  }
  if ({}.toString.call(value1) != {}.toString.call(value2)) {
    return false;
  }
  if (value1 !== Object(value1)) {
    // non equal primitives
    return false;
  }
  if (!value1) {
    return false;
  }
  if (Array.isArray(value1)) {
    return compareArrays(value1, value2);
  }
  if ({}.toString.call(value1) == '[object Object]') {
    return compareObjects(value1, value2);
  } else {
    return compareNativeSubtypes(value1, value2);
  }
}

function compareNativeSubtypes(value1, value2) {
  // e.g. Function, RegExp, Date
  return value1.toString() === value2.toString();
}

function compareArrays(value1, value2) {
  var len = value1.length;
  if (len != value2.length) {
    return false;
  }
  var alike = true;
  for (var i = 0; i < len; i++) {
    if (!compare(value1[i], value2[i])) {
      alike = false;
      break;
    }
  }
  return alike;
}

function compareObjects(value1, value2) {
  var keys1 = Object.keys(value1).sort();
  var keys2 = Object.keys(value2).sort();
  var len = keys1.length;
  if (len != keys2.length) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    var key1 = keys1[i];
    var key2 = keys2[i];
    if (!(key1 == key2 && compare(value1[key1], value2[key2]))) {
      return false;
    }
  }
  return true;
}