import React from 'react'

// Find the depth of the columns
export function findMaxDepth(columns, depth = 0) {
  return columns.reduce((prev, curr) => {
    if (curr.columns) {
      return Math.max(prev, findMaxDepth(curr.columns, depth + 1))
    }
    return depth
  }, 0)
}

export function decorateColumn(column, defaultColumn, parent, depth, index) {
  // Apply the defaultColumn
  column = { ...defaultColumn, ...column }

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
    Header: () => null,
    Cell: ({ cell: { value = '' } }) => value,
    show: true,
    ...column,
    id,
    accessor,
    parent,
    depth,
    index,
  }

  return column
}

// Build the visible columns, headers and flat column list
export function decorateColumnTree(columns, defaultColumn, parent, depth = 0) {
  return columns.map((column, columnIndex) => {
    column = decorateColumn(column, defaultColumn, parent, depth, columnIndex)
    if (column.columns) {
      column.columns = decorateColumnTree(
        column.columns,
        defaultColumn,
        column,
        depth + 1
      )
    }
    return column
  })
}

// Build the header groups from the bottom up
export function makeHeaderGroups(columns, maxDepth, defaultColumn) {
  const headerGroups = []

  const removeChildColumns = column => {
    delete column.columns
    if (column.parent) {
      removeChildColumns(column.parent)
    }
  }
  columns.forEach(removeChildColumns)

  const buildGroup = (columns, depth = 0) => {
    const headerGroup = {
      headers: [],
    }

    const parentColumns = []

    const hasParents = columns.some(col => col.parent)

    columns.forEach(column => {
      const isFirst = !parentColumns.length
      let latestParentColumn = [...parentColumns].reverse()[0]

      // If the column has a parent, add it if necessary
      if (column.parent) {
        if (isFirst || latestParentColumn.originalID !== column.parent.id) {
          parentColumns.push({
            ...column.parent,
            originalID: column.parent.id,
            id: [column.parent.id, parentColumns.length].join('_'),
          })
        }
      } else if (hasParents) {
        // If other columns have parents, add a place holder if necessary
        const placeholderColumn = decorateColumn(
          {
            originalID: [column.id, 'placeholder', maxDepth - depth].join('_'),
            id: [
              column.id,
              'placeholder',
              maxDepth - depth,
              parentColumns.length,
            ].join('_'),
          },
          defaultColumn
        )
        if (
          isFirst ||
          latestParentColumn.originalID !== placeholderColumn.originalID
        ) {
          parentColumns.push(placeholderColumn)
        }
      }

      // Establish the new columns[] relationship on the parent
      if (column.parent || hasParents) {
        latestParentColumn = [...parentColumns].reverse()[0]
        latestParentColumn.columns = latestParentColumn.columns || []
        if (!latestParentColumn.columns.includes(column)) {
          latestParentColumn.columns.push(column)
        }
      }

      headerGroup.headers.push(column)
    })

    headerGroups.push(headerGroup)

    if (parentColumns.length) {
      buildGroup(parentColumns)
    }
  }

  buildGroup(columns)

  return headerGroups.reverse()
}

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

export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

export function defaultGroupByFn(rows, columnID) {
  return rows.reduce((prev, row, i) => {
    // TODO: Might want to implement a key serializer here so
    // irregular column values can still be grouped if needed?
    const resKey = `${row.values[columnID]}`
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : []
    prev[resKey].push(row)
    return prev
  }, {})
}

export function setBy(obj = {}, path, value) {
  path = makePathArray(path)
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
  if (typeof Comp === 'function' || typeof Comp === 'object') {
    return <Comp {...props} />
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

export function isFunction(a) {
  if (typeof a === 'function') {
    return a
  }
}

export function flattenBy(columns, childKey) {
  const flatColumns = []

  const recurse = columns => {
    columns.forEach(d => {
      if (!d[childKey]) {
        flatColumns.push(d)
      } else {
        recurse(d[childKey])
      }
    })
  }

  recurse(columns)

  return flatColumns
}

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

//

function makePathArray(obj) {
  return (
    flattenDeep(obj)
      // remove all periods in parts
      .map(d => String(d).replace('.', '_'))
      // join parts using period
      .join('.')
      // replace brackets with periods
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
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
