// import React from 'react'

import { Piped } from './types'

type UnionToIntersection<Union> = (Union extends unknown
? (distributedUnion: Union) => void
: never) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never

type FnsParamsIntersection<
  T extends ((...args: any) => any)[]
> = UnionToIntersection<Parameters<T[number]>[0]>

type FnsReturnIntersection<
  T extends ((...args: any) => any)[]
> = UnionToIntersection<ReturnType<T[number]>>

type PipeFunctions<TInitial, TMeta> = Array<Piped<TInitial, TMeta>>

type IntersectionPipe<
  TInitial,
  TMeta,
  T extends PipeFunctions<TInitial, TMeta>
> = (value: FnsParamsIntersection<T>, meta: TMeta) => FnsReturnIntersection<T>

export const pipe = <TInitial, TMeta, T extends PipeFunctions<TInitial, TMeta>>(
  fns: T
): IntersectionPipe<TInitial, TMeta, T> => {
  const piped = fns.reduce(
    (prevFn, nextFn): IntersectionPipe<TInitial, TMeta, T> => <UValue>(
      value: UValue,
      meta
    ): UValue => {
      const previousValue = prevFn(value, meta)
      return nextFn(previousValue, meta)
    },
    value => value
  )

  return (value, meta) => piped(value, meta)
}

type Decorator = <T, U>(arg: T, meta: U) => T

export function composeDecorator(fns: Decorator[]) {
  return <U, V>(initial: U, meta: V) =>
    fns.forEach((fn): U => fn(initial, meta), initial)
}

type Reducer = <T, U>(arg: T, meta: U) => T

export function composeReducer(fns: Reducer[]) {
  return <U, V>(initial: U, meta: V): U =>
    fns.reduce((reduced: U, fn): U => fn(reduced, meta), initial)
}

// export function functionalUpdate(updater, old) {
//   return typeof updater === 'function' ? updater(old) : updater
// }

// export function noop() {}

// export function useGetLatest(obj) {
//   const ref = React.useRef()
//   ref.current = obj

//   return React.useCallback(() => ref.current, [])
// }

// // SSR has issues with useLayoutEffect still, so use useEffect during SSR
// export const safeUseLayoutEffect =
//   typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

// export function useMountedLayoutEffect(fn, deps) {
//   const mountedRef = React.useRef(false)

//   safeUseLayoutEffect(() => {
//     if (mountedRef.current) {
//       fn()
//     }
//     mountedRef.current = true
//     // eslint-disable-next-line
//   }, deps)
// }

// export function makeRenderer(getInstance, meta = {}) {
//   return (Comp, userProps = {}) => {
//     return flexRender(Comp, {
//       tableInstance: getInstance(),
//       ...meta,
//       ...userProps,
//     })
//   }
// }

// export function flexRender(Comp, props) {
//   return isReactComponent(Comp) ? <Comp {...props} /> : Comp
// }

// function isReactComponent(component) {
//   return (
//     isClassComponent(component) ||
//     typeof component === 'function' ||
//     isExoticComponent(component)
//   )
// }

// function isClassComponent(component) {
//   return (
//     typeof component === 'function' &&
//     (() => {
//       const proto = Object.getPrototypeOf(component)
//       return proto.prototype && proto.prototype.isReactComponent
//     })()
//   )
// }

// function isExoticComponent(component) {
//   return (
//     typeof component === 'object' &&
//     typeof component.$$typeof === 'symbol' &&
//     ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
//   )
// }

// export function flattenColumns(columns, includeParents) {
//   return flattenBy(columns, 'columns', includeParents)
// }

// export function getFirstDefined(...args) {
//   for (let i = 0; i < args.length; i += 1) {
//     if (typeof args[i] !== 'undefined') {
//       return args[i]
//     }
//   }
// }

// export function isFunction(a) {
//   if (typeof a === 'function') {
//     return a
//   }
// }

// export function flattenBy(arr, key, includeParents) {
//   const flat = []

//   const recurse = arr => {
//     arr.forEach(d => {
//       if (d[key] && d[key].length) {
//         if (includeParents) {
//           flat.push(d)
//         }
//         recurse(d[key])
//       } else {
//         flat.push(d)
//       }
//     })
//   }

//   recurse(arr)

//   return flat
// }

// export function expandRows(rows, getInstance) {
//   const expandedRows = []

//   const handleRow = row => {
//     expandedRows.push(row)

//     if (
//       getInstance().options.expandSubRows &&
//       row.subRows &&
//       row.subRows.length &&
//       row.getIsExpanded()
//     ) {
//       row.subRows.forEach(handleRow)
//     }
//   }

//   rows.forEach(handleRow)

//   return expandedRows
// }

// export function getFilterMethod(filter, userFilterTypes, filterTypes) {
//   return isFunction(filter) || userFilterTypes[filter] || filterTypes[filter]
// }

// export function shouldAutoRemoveFilter(autoRemove, value, column) {
//   return autoRemove ? autoRemove(value, column) : typeof value === 'undefined'
// }

// export function groupBy(rows, columnId) {
//   return rows.reduce((prev, row, i) => {
//     const resKey = `${row.values[columnId]}`
//     prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
//     prev[resKey].push(row)
//     return prev
//   }, {})
// }

// export function orderBy(arr, funcs, dirs) {
//   return [...arr].sort((rowA, rowB) => {
//     for (let i = 0; i < funcs.length; i += 1) {
//       const sortFn = funcs[i]
//       const desc = dirs[i] === false || dirs[i] === 'desc'
//       const sortInt = sortFn(rowA, rowB, desc)
//       if (sortInt !== 0) {
//         return desc ? -sortInt : sortInt
//       }
//     }
//     return dirs[0] ? rowA.index - rowB.index : rowB.index - rowA.index
//   })
// }

// export function getRowIsSelected(row, selection) {
//   if (selection[row.id]) {
//     return true
//   }

//   if (row.subRows && row.subRows.length) {
//     let allChildrenSelected = true
//     let someSelected = false

//     row.subRows.forEach(subRow => {
//       // Bail out early if we know both of these
//       if (someSelected && !allChildrenSelected) {
//         return
//       }

//       if (getRowIsSelected(subRow, selection)) {
//         someSelected = true
//       } else {
//         allChildrenSelected = false
//       }
//     })
//     return allChildrenSelected ? true : someSelected ? null : false
//   }

//   return false
// }

// export function findExpandedDepth(expanded) {
//   let maxDepth = 0

//   Object.keys(expanded).forEach(id => {
//     const splitId = id.split('.')
//     maxDepth = Math.max(maxDepth, splitId.length)
//   })

//   return maxDepth
// }

// export function composeDecorate<T extends readonly any[]>(...fns: T) {
//   return <U extends any[]>(...args: U) => {
//     fns.filter(Boolean).forEach(fn => fn(...args))
//   }
// }

// export function getLeafHeaders(header) {
//   const leafHeaders = []
//   const recurseHeader = header => {
//     if (header.subHeaders && header.subHeaders.length) {
//       header.subHeaders.map(recurseHeader)
//     }
//     leafHeaders.push(header)
//   }
//   recurseHeader(header)
//   return leafHeaders
// }

// export function useLazyMemo(fn, deps = []) {
//   const ref = React.useRef({ deps: [] })

//   return React.useCallback(() => {
//     if (
//       ref.current.deps.length !== deps.length ||
//       deps.some((dep, i) => ref.current.deps[i] !== dep)
//     ) {
//       ref.current.deps = deps
//       ref.current.result = fn()
//     }

//     return ref.current.result
//   }, [deps, fn])
// }

// export function composePropsReducer(...fns) {
//   return (initial, ...args) =>
//     fns.reduceRight((reduced, fn) => fn(reduced, ...args), initial)
// }

// export function applyDefaults(obj, defaults) {
//   const newObj = { ...obj }

//   Object.keys(defaults).forEach(key => {
//     if (typeof newObj[key] === 'undefined') {
//       newObj[key] = defaults[key]
//     }
//   })

//   return newObj
// }

// export function buildHeaderGroups(columns, leafColumns, { getInstance }) {
//   // Find the max depth of the columns:
//   // build the leaf column row
//   // build each buffer row going up
//   //    placeholder for non-existent level
//   //    real column for existing level

//   let maxDepth = 0

//   const findMaxDepth = (columns, depth = 0) => {
//     maxDepth = Math.max(maxDepth, depth)

//     columns.forEach(column => {
//       if (column.getIsVisible && !column.getIsVisible()) {
//         return
//       }
//       if (column.columns) {
//         findMaxDepth(column.columns, depth + 1)
//       }
//     }, 0)
//   }

//   findMaxDepth(columns)

//   const headerGroups = []

//   const makeHeaderGroup = (headers, depth) => {
//     // The header group we are creating
//     const headerGroup = {
//       depth,
//       id: depth,
//       headers: [],
//     }

//     // The parent columns we're going to scan next
//     const parentHeaders = []

//     // Scan each column for parents
//     headers.forEach(header => {
//       // What is the latest (last) parent column?
//       let latestParentHeader = [...parentHeaders].reverse()[0]

//       let parentHeader = {
//         subHeaders: [],
//       }

//       const isTrueHeaderDepth = header.column.depth === headerGroup.depth

//       if (isTrueHeaderDepth && header.column.parent) {
//         // The parent header different
//         parentHeader.isPlaceholder = false
//         parentHeader.column = header.column.parent
//       } else {
//         // The parent header is repeated
//         parentHeader.column = header.column
//         parentHeader.isPlaceholder = true
//       }

//       parentHeader.placeholderId = parentHeaders.filter(
//         d => d.column === parentHeader.column
//       ).length

//       if (
//         !latestParentHeader ||
//         latestParentHeader.column !== parentHeader.column
//       ) {
//         parentHeader.subHeaders.push(header)
//         parentHeaders.push(parentHeader)
//       } else {
//         latestParentHeader.subHeaders.push(header)
//       }

//       if (!header.isPlaceholder) {
//         header.column.header = header
//       }

//       header.id = [header.column.id, header.placeholderId]
//         .filter(Boolean)
//         .join('_')

//       headerGroup.headers.push(header)
//     })

//     headerGroups.push(headerGroup)

//     if (depth > 0) {
//       makeHeaderGroup(parentHeaders, depth - 1)
//     }
//   }

//   const bottomHeaders = leafColumns.map(column => ({
//     column,
//     isPlaceholder: false,
//   }))

//   makeHeaderGroup(bottomHeaders, maxDepth)

//   headerGroups.reverse()

//   headerGroups.forEach(headerGroup => {
//     headerGroup.getHeaderGroupProps = (props = {}) =>
//       getInstance().plugs.reduceHeaderGroupProps(
//         {
//           role: 'row',
//           ...props,
//         },
//         { getInstance, headerGroup }
//       )

//     headerGroup.getFooterGroupProps = (props = {}) =>
//       getInstance().plugs.reduceFooterGroupProps(
//         {
//           role: 'row',
//           ...props,
//         },
//         { getInstance, headerGroup }
//       )
//   })

//   return headerGroups
// }

// export function recurseHeaderForSpans(header) {
//   let colSpan = 0
//   let rowSpan = 1
//   let childRowSpans = [0]

//   if (header.column.getIsVisible && header.column.getIsVisible()) {
//     if (header.subHeaders && header.subHeaders.length) {
//       childRowSpans = []
//       header.subHeaders.forEach(subHeader => {
//         const [count, childRowSpan] = recurseHeaderForSpans(subHeader)
//         colSpan += count
//         childRowSpans.push(childRowSpan)
//       })
//     } else {
//       colSpan = 1
//     }
//   }

//   let minChildRowSpan = Math.min(...childRowSpans)
//   rowSpan = rowSpan + minChildRowSpan

//   header.colSpan = colSpan
//   header.rowSpan = rowSpan

//   return [colSpan, rowSpan]
// }

// let passiveSupported = null
// export function passiveEventSupported() {
//   // memoize support to avoid adding multiple test events
//   if (typeof passiveSupported === 'boolean') return passiveSupported

//   let supported = false
//   try {
//     const options = {
//       get passive() {
//         supported = true
//         return false
//       },
//     }

//     window.addEventListener('test', null, options)
//     window.removeEventListener('test', null, options)
//   } catch (err) {
//     supported = false
//   }
//   passiveSupported = supported
//   return passiveSupported
// }
