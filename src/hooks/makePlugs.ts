import { InstancePlugs, Plugin, PlugType } from '../types'
import { composeDecorator, composeReducer } from '../utils'

const plugTypes: PlugType[] = [
  ['useReduceOptions', composeReducer],
  ['useInstanceAfterState', composeDecorator],
  ['useReduceColumns', composeReducer],
  ['useReduceAllColumns', composeReducer],
  ['useReduceLeafColumns', composeReducer],
  ['decorateColumn', composeDecorator],
  ['useReduceHeaderGroups', composeReducer],
  ['useReduceFooterGroups', composeReducer],
  ['useReduceFlatHeaders', composeReducer],
  ['decorateHeader', composeDecorator],
  ['decorateRow', composeDecorator],
  ['decorateCell', composeDecorator],
  ['useInstanceAfterDataModel', composeDecorator],
  ['reduceTableProps', composeReducer],
  ['reduceTableBodyProps', composeReducer],
  ['reduceTableHeadProps', composeReducer],
  ['reduceTableFooterProps', composeReducer],
  ['reduceHeaderGroupProps', composeReducer],
  ['reduceFooterGroupProps', composeReducer],
  ['reduceHeaderProps', composeReducer],
  ['reduceRowProps', composeReducer],
  ['reduceCellProps', composeReducer],
]

export default function makePlugs(plugins: Plugin[]) {
  plugins = plugins.filter(Boolean)

  plugins.sort((a, b) => {
    if (a.after.includes(b.name) || a.after.length > b.after.length) {
      return 1
    }
    if (b.after.includes(a.name) || b.after.length > a.after.length) {
      return -1
    }
    return 0
  })

  if (process.env.NODE_ENV !== 'production') {
    plugins.forEach(plugin => {
      Object.keys(plugin.plugs).forEach(plugName => {
        if (!plugTypes.find(d => d[0] === plugName)) {
          throw new Error(
            `Unknown plug "${plugName}" found in plugin "${plugin.name}"`
          )
        }
      })
    })
  }

  return plugTypes.reduce((plugs, [plugType, plugCompositionFn]) => {
    const pluginPlugs = plugins
      // Get the info necessary to sort
      .map(plugin => {
        const plugFn = plugin.plugs[plugType]

        return {
          pluginName: plugin.name,
          plug: plugFn,
          after: plugFn?.after || [],
        }
      })
      // remove empty
      .filter(d => d.plug)
      // sort for optional after deps
      .sort((a, b) => {
        if (a.after.includes(b.pluginName) || a.after.length > b.after.length) {
          return 1
        }
        if (b.after.includes(a.pluginName) || b.after.length > a.after.length) {
          return -1
        }
        return 0
      })
      // map back to the plug functions
      .map(d => d.plug)

    plugs[plugType] = plugCompositionFn(pluginPlugs)

    return plugs
  }, {} as InstancePlugs)
}
