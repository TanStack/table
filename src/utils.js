import React from 'react'

let renderErr = 'Renderer Error ☝️'

export function functionalUpdate(updater, old) {
  return typeof updater === 'function' ? updater(old) : updater
}

export function useGetLatest(obj) {
  const ref = React.useRef()
  ref.current = obj

  return React.useCallback(() => ref.current, [])
}

// SSR has issues with useLayoutEffect still, so use useEffect during SSR
export const safeUseLayoutEffect =
  typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

export function useMountedLayoutEffect(fn, deps) {
  const mountedRef = React.useRef(false)

  safeUseLayoutEffect(() => {
    if (mountedRef.current) {
      fn()
    }
    mountedRef.current = true
    // eslint-disable-next-line
  }, deps)
}

export function makeRenderer(getInstance, renderers, meta = {}) {
  return (types, userProps = {}) => {
    types = Array.isArray(types) ? types : [types]

    const type = types.find(t => renderers[t])

    const Comp = renderers[type]

    if (typeof Comp === 'undefined') {
      console.info(renderers)
      throw new Error(renderErr)
    }

    return flexRender(Comp, {
      tableInstance: getInstance(),
      ...meta,
      ...userProps,
    })
  }
}

export function flexRender(Comp, props) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp
}

function isReactComponent(component) {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}

export function flattenColumns(columns) {
  return flattenBy(columns, 'columns')
}

export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

export function isFunction(a) {
  if (typeof a === 'function') {
    return a
  }
}

export function flattenBy(arr, key) {
  const flat = []

  const recurse = arr => {
    arr.forEach(d => {
      if (!d[key]) {
        flat.push(d)
      } else {
        recurse(d[key])
      }
    })
  }

  recurse(arr)

  return flat
}

export function assignMemo(obj, key, value, deps = []) {
  obj._memos = obj._memos || {}
  obj._memos[key] = obj._memos[key] || {}

  const memo = obj._memos[key]

  if (
    !memo.lastDeps ||
    memo.lastDeps.length !== deps.length ||
    deps.some((dep, i) => memo.lastDeps[i] !== dep)
  ) {
    memo.lastDeps = deps
    memo.value = value()
  }

  return memo.value
}

export function expandRows(rows, getInstance) {
  const expandedRows = []

  const handleRow = row => {
    expandedRows.push(row)

    if (
      getInstance().options.expandSubRows &&
      row.subRows &&
      row.subRows.length &&
      row.getIsExpanded()
    ) {
      row.subRows.forEach(handleRow)
    }
  }

  rows.forEach(handleRow)

  return expandedRows
}

export function getFilterMethod(filter, userFilterTypes, filterTypes) {
  return isFunction(filter) || userFilterTypes[filter] || filterTypes[filter]
}

export function shouldAutoRemoveFilter(autoRemove, value, column) {
  return autoRemove ? autoRemove(value, column) : typeof value === 'undefined'
}

export function defaultGroupingFn(rows, columnId) {
  return rows.reduce((prev, row, i) => {
    const resKey = `${row.values[columnId]}`
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
    prev[resKey].push(row)
    return prev
  }, {})
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

export function getRowIsSelected(row, selection) {
  if (selection[row.id]) {
    return true
  }

  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true
    let someSelected = false

    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (getRowIsSelected(subRow, selection)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })
    return allChildrenSelected ? true : someSelected ? null : false
  }

  return false
}

export function findExpandedDepth(expanded) {
  let maxDepth = 0

  Object.keys(expanded).forEach(id => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}
