import React from 'react'

//

import { composeDecorator, composeReducer } from '../utils'

// import useTableConfig from './useTableOptions'
// import useTableState from './useTableState'
// import useColumns from './useColumns'
// import useHeadersAndFooters from './useHeadersAndFooters'
// import useDataModel from './useDataModel'

import { withCore } from '../plugins/withCore'
import {
  TableInstance,
  PlugBuilderFn,
  TableInstancePlugs,
  PlugType,
  TablePlugin,
} from '../types'
import { makeBase } from '../Base'

const plugTypes: [PlugType, PlugBuilderFn][] = [
  // ['useReduceOptions', composeReducer],
  // ['useInstanceAfterState', composeDecorator],
  // ['useReduceColumns', composeReducer],
  // ['useReduceAllColumns', composeReducer],
  // ['useReduceLeafColumns', composeReducer],
  // ['decorateColumn', composeDecorator],
  // ['useReduceHeaderGroups', composeReducer],
  // ['useReduceFooterGroups', composeReducer],
  // ['useReduceFlatHeaders', composeReducer],
  // ['decorateHeader', composeDecorator],
  // ['decorateRow', composeDecorator],
  // ['decorateCell', composeDecorator],
  // ['useInstanceAfterDataModel', composeDecorator],
  // ['reduceTableProps', composeReducer],
  // ['reduceTableBodyProps', composeReducer],
  // ['reduceTableHeadProps', composeReducer],
  // ['reduceTableFootProps', composeReducer],
  // ['reduceHeaderGroupProps', composeReducer],
  // ['reduceFooterGroupProps', composeReducer],
  // ['reduceHeaderProps', composeReducer],
  // ['reduceRowProps', composeReducer],
  // ['reduceCellProps', composeReducer],
]

export function createTable({ plugins }: { plugins: TablePlugin[] }) {
  const userPlugins = plugins.filter(Boolean)

  userPlugins.sort((a, b) => {
    if (a.after.includes(b.name) || a.after.length > b.after.length) {
      return 1
    }
    if (b.after.includes(a.name) || b.after.length > a.after.length) {
      return -1
    }
    return 0
  })

  const allPlugins: TablePlugin[] = [withCore, ...userPlugins]

  const plugs: TableInstancePlugs = {}

  if (process.env.NODE_ENV !== 'production') {
    allPlugins.forEach(plugin => {
      Object.keys(plugin).forEach(plugName => {
        if (
          plugName !== 'name' &&
          plugName !== 'after' &&
          !plugTypes.find(d => d[0] === plugName)
        ) {
          throw new Error(
            `Unknown plug "${plugName}" found in plugin "${plugin.name}"`
          )
        }
      })
    })
  }

  // plugTypes.forEach(([plugType, plugCompositionFn]) => {
  //   const pluginPlugs: PlugBuilderFn[] = allPlugins
  //     // Get the info necessary to sort
  //     .map(plugin => ({
  //       pluginName: plugin.name,
  //       plug: plugin.plugs[plugType],
  //       after: plugin.plugs[plugType].after,
  //     }))
  //     // remove empty
  //     .filter(d => d.plug)
  //     // sort for optional after deps
  //     .sort((a, b) => {
  //       if (a.after.includes(b.pluginName) || a.after.length > b.after.length) {
  //         return 1
  //       }
  //       if (b.after.includes(a.pluginName) || b.after.length > a.after.length) {
  //         return -1
  //       }
  //       return 0
  //     })
  //     // map back to the plug functions
  //     .map(d => d.plug)

  //   plugs[plugType] = plugCompositionFn(...pluginPlugs)
  // })

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
  }

  const base = makeBase({ plugins: [] })

  const useTablePlugs = allPlugins
    .map(plugin => plugin.plugs.useTable)
    .filter(notEmpty)

  plugs.useTable = pipe(...useTablePlugs)

  function useTable(config: TableConfig) {
    const instanceRef = React.useRef<TableInstance<TableConfig>>()

    // Create and keep track of the table instance
    if (!instanceRef.current) {
      instanceRef.current = {
        config,
        plugs,
      }
    }

    const instance = instanceRef.current

    // Apply the defaults to our config
    // instance.config = useTableConfig(config, { instance })

    // useTableState(instance)

    // instance.plugs.useInstanceAfterState(instance)

    // useColumns(instance)
    // useHeadersAndFooters(instance)
    // useDataModel(instance)

    // instance.plugs.useInstanceAfterDataModel(instance)

    return instance
  }

  const finalUseTable = plugs.useTable(useTable, {})

  return finalUseTable
}
