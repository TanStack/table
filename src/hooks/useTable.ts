import React from 'react'
import useTableOptions from './useTableOptions'
import useTableState from './useTableState'
import useColumns from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useDataModel from './useDataModel'

import {withCore} from '../plugins/withCore'
import {plugTypes, TableCell, TableColumn, TablePlugin} from "./pluginSupport";

type TableOptions<
  Column extends TableColumn = TableColumn,
  Cell extends TableCell = TableCell
> = {
  plugins?: TablePlugin<Column, Cell>[]
} & Record<string, any>

export function useTable<
  Column extends TableColumn = TableColumn,
  Cell extends TableCell = TableCell,
>(options: TableOptions<Column, Cell>) {
  const instanceRef: any = React.useRef()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {}
  }
  const instance = instanceRef.current

  const {
    plugins = []
  } = options;
  const userPlugins = plugins.filter(Boolean)

  userPlugins.sort((a: any, b: any) => {
    if (a.after.includes(b.name) || a.after.length > b.after.length) {
      return 1
    }
    if (b.after.includes(a.name) || b.after.length > a.after.length) {
      return -1
    }
    return 0
  })

  const allPlugins = [withCore, ...userPlugins]

  instance.plugs = {}

  // @ts-ignore  @todo @types/node ?
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

  plugTypes.forEach(([plugType, compositionFn]) => {
    const pluginPlugs = allPlugins
      // Get the info necessary to sort
      .map(plugin => ({
        name: plugin.name,
        plug: plugin[plugType],
        after: plugin[plugType]?.after || [],
      }))
      // remove empty
      .filter(d => d.plug)
      // sort for optional after deps
      .sort((a, b) => {
        if (a.after.includes(b.name) || a.after.length > b.after.length) {
          return 1
        }
        if (b.after.includes(a.name) || b.after.length > a.after.length) {
          return -1
        }
        return 0
      })
      // map back to the plug functions
      .map(d => d.plug)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    instance.plugs[plugType] = React.useCallback(
      compositionFn(...pluginPlugs),
      pluginPlugs
    )
  })

  // Apply the defaults to our options
  instance.options = useTableOptions(options, instance)

  useTableState(instance)

  instance.plugs.useInstanceAfterState(instance)

  useColumns(instance)
  useHeadersAndFooters(instance)
  useDataModel(instance)

  instance.plugs.useInstanceAfterDataModel(instance)

  return instance
}

