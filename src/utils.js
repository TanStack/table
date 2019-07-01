import React from 'react'

export function getBy(obj, path, def) {
  if (!path) {
    return obj
  }
  const pathObj = makePathArray(path)
  let val
  try {
    val = pathObj.reduce((cursor, pathPart) => cursor[pathPart], obj)
  } catch (e) {
    // continue regardless of error
  }
  return typeof val !== 'undefined' ? val : def
}

export function defaultOrderByFn(arr, funcs, dirs) {
  return [...arr].sort((rowA, rowB) => {
    for (let i = 0; i < funcs.length; i += 1) {
      const sortFn = funcs[i]
      const desc = dirs[i] === false || dirs[i] === 'desc'
      const sortInt = sortFn(rowA, rowB)
      if (sortInt !== 0) {
        return desc ? -sortInt : sortInt
      }
    }
    return dirs[0] ? rowA.index - rowB.index : rowB.index - rowA.index
  })
}

export function defaultSortByFn(a, b, desc) {
  // force null and undefined to the bottom
  a = a === null || a === undefined ? '' : a
  b = b === null || b === undefined ? '' : b
  // force any string values to lowercase
  a = typeof a === 'string' ? a.toLowerCase() : a
  b = typeof b === 'string' ? b.toLowerCase() : b
  // Return either 1 or -1 to indicate a sort priority
  if (a > b) {
    return 1
  }
  if (a < b) {
    return -1
  }
  // returning 0, undefined or any falsey value will defer to the next
  // sorting mechanism or eventually the columns index via the orderByFn
  return 0
}

export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

export function defaultGroupByFn(rows, grouper) {
  return rows.reduce((prev, row, i) => {
    const resKey =
      typeof grouper === 'function'
        ? grouper(row.values, i)
        : row.values[grouper]
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
    prev[resKey].push(row)
    return prev
  }, {})
}

export function defaultFilterFn(row, id, value, column) {
  return row.values[id] !== undefined
    ? String(row.values[id])
        .toLowerCase()
        .includes(String(value).toLowerCase())
    : true
}

export function setBy(obj = {}, path, value) {
  const recurse = (obj, depth = 0) => {
    const key = path[depth]
    const target = typeof obj[key] !== 'object' ? {} : obj[key]
    const subValue =
      depth === path.length - 1 ? value : recurse(target, depth + 1)
    return {
      ...obj,
      [key]: subValue,
    }
  }

  return recurse(obj)
}

export function getElementDimensions(element) {
  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const margins = {
    left: parseInt(style.marginLeft),
    right: parseInt(style.marginRight),
  }
  const padding = {
    left: parseInt(style.paddingLeft),
    right: parseInt(style.paddingRight),
  }
  return {
    left: Math.ceil(rect.left),
    width: Math.ceil(rect.width),
    outerWidth: Math.ceil(
      rect.width + margins.left + margins.right + padding.left + padding.right
    ),
    marginLeft: margins.left,
    marginRight: margins.right,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    scrollWidth: element.scrollWidth,
  }
}

export function flexRender(Comp, props) {
  if (typeof Comp === 'function') {
    return Object.getPrototypeOf(Comp).isReactComponent ? (
      <Comp {...props} />
    ) : (
      Comp(props)
    )
  }
  return Comp
}

export const mergeProps = (...groups) => {
  let props = {}
  groups.forEach(({ style = {}, className, ...rest } = {}) => {
    props = {
      ...props,
      ...rest,
      style: {
        ...(props.style || {}),
        ...style,
      },
      className: [props.className, className].filter(Boolean).join(' '),
    }
  })
  return props
}

export const applyHooks = (hooks, initial, ...args) =>
  hooks.reduce((prev, next) => next(prev, ...args), initial)

export const applyPropHooks = (hooks, ...args) =>
  hooks.reduce((prev, next) => mergeProps(prev, next(...args)), {})

export const warnUnknownProps = props => {
  if (Object.keys(props).length) {
    throw new Error(
      `Unknown options passed to useReactTable:

${JSON.stringify(props, null, 2)}`
    )
  }
}

export function sum(arr) {
  return arr.reduce((prev, curr) => prev + curr, 0)
}

function makePathArray(obj) {
  return flattenDeep(obj)
    .join('.')
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
}

function flattenDeep(arr, newArr = []) {
  if (!Array.isArray(arr)) {
    newArr.push(arr)
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}
