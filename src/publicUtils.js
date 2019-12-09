import React from 'react'

export const actions = {
  init: 'init',
}

export const defaultColumn = {
  Cell: ({ cell: { value = '' } }) => String(value),
  width: 150,
  minWidth: 0,
  maxWidth: Number.MAX_SAFE_INTEGER,
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

export function defaultGroupByFn(rows, columnId) {
  return rows.reduce((prev, row, i) => {
    // TODO: Might want to implement a key serializer here so
    // irregular column values can still be grouped if needed?
    const resKey = `${row.values[columnId]}`
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
    prev[resKey].push(row)
    return prev
  }, {})
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

  if (props.className === '') {
    delete props.className
  }

  return props
}

export const applyHooks = (hooks, initial, ...args) =>
  hooks.reduce((prev, next) => {
    const nextValue = next(prev, ...args)
    if (typeof nextValue === 'undefined') {
      throw new Error(
        'React Table: A hook just returned undefined! This is not allowed.'
      )
    }
    return nextValue
  }, initial)

export const applyPropHooks = (hooks, ...args) =>
  hooks.reduce((prev, next) => mergeProps(prev, next(...args)), {})

export function ensurePluginOrder(plugins, befores, pluginName, afters) {
  const pluginIndex = plugins.findIndex(
    plugin => plugin.pluginName === pluginName
  )

  if (pluginIndex === -1) {
    throw new Error(`The plugin ${pluginName} was not found in the plugin list!
This usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:

  ${pluginName}.pluginName = '${pluginName}'
`)
  }

  befores.forEach(before => {
    const beforeIndex = plugins.findIndex(
      plugin => plugin.pluginName === before
    )
    if (beforeIndex > -1 && beforeIndex > pluginIndex) {
      throw new Error(
        `React Table: The ${pluginName} plugin hook must be placed after the ${before} plugin hook!`
      )
    }
  })

  afters.forEach(after => {
    const afterIndex = plugins.findIndex(plugin => plugin.pluginName === after)
    if (afterIndex > -1 && afterIndex < pluginIndex) {
      throw new Error(
        `React Table: The ${pluginName} plugin hook must be placed before the ${after} plugin hook!`
      )
    }
  })
}

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

export function useAsyncDebounce(defaultFn, defaultWait = 0) {
  const debounceRef = React.useRef({})
  debounceRef.current.defaultFn = defaultFn
  debounceRef.current.defaultWait = defaultWait

  const debounce = React.useCallback(
    async (
      fn = debounceRef.current.defaultFn,
      wait = debounceRef.current.defaultWait
    ) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve
          debounceRef.current.reject = reject
        })
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout)
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout
        try {
          debounceRef.current.resolve(await fn())
        } catch (err) {
          debounceRef.current.reject(err)
        } finally {
          delete debounceRef.current.promise
        }
      }, wait)

      return debounceRef.current.promise
    },
    []
  )

  return debounce
}

export function useConsumeHookGetter(hooks, hookName) {
  const getter = useGetLatest(hooks[hookName])
  hooks[hookName] = undefined
  return getter
}

export function decorateColumn(
  column,
  userDefaultColumn,
  parent,
  depth,
  index
) {
  // Apply the userDefaultColumn
  column = { ...defaultColumn, ...userDefaultColumn, ...column }

  // First check for string accessor
  let { id, accessor, Header } = column

  if (typeof accessor === 'string') {
    id = id || accessor
    const accessorPath = accessor.split('.')
    accessor = row => getBy(row, accessorPath)
  }

  if (!id && typeof Header === 'string' && Header) {
    id = Header
  }

  if (!id && column.columns) {
    console.error(column)
    throw new Error('A column ID (or unique "Header" value) is required!')
  }

  if (!id) {
    console.error(column)
    throw new Error('A column ID (or string accessor) is required!')
  }

  column = {
    // Make sure there is a fallback header, just in case
    Header: () => <>&nbsp;</>,
    Footer: () => <>&nbsp;</>,
    ...column,
    // Materialize and override this stuff
    id,
    accessor,
    parent,
    depth,
    index,
  }

  return column
}

const pathObjCache = new Map()

export function getBy(obj, path, def) {
  if (!path) {
    return obj
  }
  const cacheKey = typeof path === 'function' ? path : JSON.stringify(path)

  const pathObj =
    pathObjCache.get(cacheKey) ||
    (() => {
      const pathObj = makePathArray(path)
      pathObjCache.set(cacheKey, pathObj)
      return pathObj
    })()

  let val

  try {
    val = pathObj.reduce((cursor, pathPart) => cursor[pathPart], obj)
  } catch (e) {
    // continue regardless of error
  }
  return typeof val !== 'undefined' ? val : def
}

const reOpenBracket = /\[/g
const reCloseBracket = /\]/g

function makePathArray(obj) {
  return (
    flattenDeep(obj)
      // remove all periods in parts
      .map(d => String(d).replace('.', '_'))
      // join parts using period
      .join('.')
      // replace brackets with periods
      .replace(reOpenBracket, '.')
      .replace(reCloseBracket, '')
      // split it back out on periods
      .split('.')
  )
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
