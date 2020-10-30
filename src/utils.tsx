import React from 'react'
import { TableColumn, RendererMeta, TableInstance, SortFn } from './types'

export function composeDecorator(fns) {
  return (initial, meta) => fns.forEach(fn => fn(initial, meta), initial)
}

export function composeReducer(fns) {
  return (initial, meta) =>
    fns.reduce((reduced, fn) => fn(reduced, meta), initial)
}

export function functionalUpdate(updater, old) {
  return typeof updater === 'function' ? updater(old) : updater
}

export function noop() {
  //
}

export function makeStateUpdater(key) {
  return (updater, instance) => {
    instance.setState(old => {
      return {
        ...old,
        [key]: functionalUpdate(updater, old[key]),
      }
    })
  }
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

export function makeRenderer<T, U extends RendererMeta>(
  instance: T,
  meta: U = {} as U
) {
  return (Comp: any, userProps = {}) => {
    return flexRender(Comp, {
      instance,
      ...meta,
      ...userProps,
    })
  }
}

export function flexRender(Comp: any, props: any) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp
}

function isReactComponent(component: unknown) {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}

export function flattenColumns(
  columns: TableColumn[],
  includeParents: boolean
) {
  return flattenBy<TableColumn[], TableColumn[]>(
    columns,
    'columns',
    includeParents
  )
}

export function getFirstDefined<T extends any>(...args: T[]): T | undefined {
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

export function flattenBy<T extends any[], U>(
  arr: T,
  key: string,
  includeParents?: boolean
) {
  const flat: any = []

  const recurse = (subArr: T) => {
    subArr.forEach(item => {
      if (item[key]?.length) {
        if (includeParents) {
          flat.push(item)
        }
        recurse(item[key])
      } else {
        flat.push(item)
      }
    })
  }

  recurse(arr)

  return flat as U
}

export function expandRows(rows, instance) {
  const expandedRows = []

  const handleRow = row => {
    expandedRows.push(row)

    if (
      instance.options.expandSubRows &&
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

export function groupBy(rows, columnId) {
  return rows.reduce((prev, row) => {
    const resKey = `${row.values[columnId]}`
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
    prev[resKey].push(row)
    return prev
  }, {})
}

type BasicSortFn = (a: any, b: any) => number

export function orderBy<T extends { index: number }>(
  arr: T[],
  funcs: BasicSortFn[]
): T[] {
  const copy = [...arr]
  copy.sort((a, b) => {
    for (let i = 0; i < funcs.length; i += 1) {
      const sortInt = funcs[i](a, b)
      if (sortInt !== 0) {
        return sortInt
      }
    }

    return b.index - a.index
  })
  return copy
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

export function composeDecorate(fns) {
  return (...args) => {
    fns.filter(Boolean).forEach(fn => fn(...args))
  }
}

export function getLeafHeaders(originalHeader) {
  const leafHeaders = []

  const recurseHeader = header => {
    if (header.subHeaders && header.subHeaders.length) {
      header.subHeaders.map(recurseHeader)
    }
    leafHeaders.push(header)
  }

  recurseHeader(originalHeader)
  return leafHeaders
}

export function useLazyMemo(fn, deps = []) {
  const ref = React.useRef({ deps: [] })

  return React.useCallback(() => {
    if (
      ref.current.deps.length !== deps.length ||
      deps.some((dep, i) => ref.current.deps[i] !== dep)
    ) {
      ref.current.deps = deps
      ref.current.result = fn()
    }

    return ref.current.result
  }, [deps, fn])
}

export function applyDefaults(obj, defaults) {
  const newObj = { ...obj }

  Object.keys(defaults).forEach(key => {
    if (typeof newObj[key] === 'undefined') {
      newObj[key] = defaults[key]
    }
  })

  return newObj
}

export function buildHeaderGroups(originalColumns, leafColumns, { instance }) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (columns, depth = 0) => {
    maxDepth = Math.max(maxDepth, depth)

    columns.forEach(column => {
      if (column.getIsVisible && !column.getIsVisible()) {
        return
      }
      if (column.columns) {
        findMaxDepth(column.columns, depth + 1)
      }
    }, 0)
  }

  findMaxDepth(originalColumns)

  const headerGroups = []

  const makeHeaderGroup = (headers, depth) => {
    // The header group we are creating
    const headerGroup = {
      depth,
      id: depth,
      headers: [],
    }

    // The parent columns we're going to scan next
    const parentHeaders = []

    // Scan each column for parents
    headers.forEach(header => {
      // What is the latest (last) parent column?
      const latestParentHeader = [...parentHeaders].reverse()[0]

      const parentHeader = {
        subHeaders: [],
      }

      const isTrueHeaderDepth = header.column.depth === headerGroup.depth

      if (isTrueHeaderDepth && header.column.parent) {
        // The parent header different
        parentHeader.isPlaceholder = false
        parentHeader.column = header.column.parent
      } else {
        // The parent header is repeated
        parentHeader.column = header.column
        parentHeader.isPlaceholder = true
      }

      parentHeader.placeholderId = parentHeaders.filter(
        d => d.column === parentHeader.column
      ).length

      if (
        !latestParentHeader ||
        latestParentHeader.column !== parentHeader.column
      ) {
        parentHeader.subHeaders.push(header)
        parentHeaders.push(parentHeader)
      } else {
        latestParentHeader.subHeaders.push(header)
      }

      if (!header.isPlaceholder) {
        header.column.header = header
      }

      header.id = [header.column.id, header.placeholderId]
        .filter(Boolean)
        .join('_')

      headerGroup.headers.push(header)
    })

    headerGroups.push(headerGroup)

    if (depth > 0) {
      makeHeaderGroup(parentHeaders, depth - 1)
    }
  }

  const bottomHeaders = leafColumns.map(column => ({
    column,
    isPlaceholder: false,
  }))

  makeHeaderGroup(bottomHeaders, maxDepth)

  headerGroups.reverse()

  headerGroups.forEach(headerGroup => {
    headerGroup.getHeaderGroupProps = (props = {}) =>
      instance.plugs.reduceHeaderGroupProps(
        {
          key: headerGroup.id,
          role: 'row',
          ...props,
        },
        { instance, headerGroup }
      )

    headerGroup.getFooterGroupProps = (props = {}) =>
      instance.plugs.reduceFooterGroupProps(
        {
          key: headerGroup.id,
          role: 'row',
          ...props,
        },
        { instance, headerGroup }
      )
  })

  return headerGroups
}

export function recurseHeaderForSpans(header) {
  let colSpan = 0
  let rowSpan = 1
  let childRowSpans = [0]

  if (header.column.getIsVisible && header.column.getIsVisible()) {
    if (header.subHeaders && header.subHeaders.length) {
      childRowSpans = []
      header.subHeaders.forEach(subHeader => {
        const [count, childRowSpan] = recurseHeaderForSpans(subHeader)
        colSpan += count
        childRowSpans.push(childRowSpan)
      })
    } else {
      colSpan = 1
    }
  }

  const minChildRowSpan = Math.min(...childRowSpans)
  rowSpan = rowSpan + minChildRowSpan

  header.colSpan = colSpan
  header.rowSpan = rowSpan

  return [colSpan, rowSpan]
}

let passiveSupported = null
export function passiveEventSupported() {
  // memoize support to avoid adding multiple test events
  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    window.addEventListener('test', null, options)
    window.removeEventListener('test', null, options)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}
