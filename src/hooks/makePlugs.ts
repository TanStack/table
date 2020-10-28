import { composeDecorator, composeReducer } from '../utils'

interface Plugin {
  name: string
  after: string[]
  plugs: PluginPlugs
}

interface PluginPlugs {
  useReduceOptions: unknown
  useInstanceAfterState: unknown
  useReduceColumns: unknown
  useReduceAllColumns: unknown
  useReduceLeafColumns: unknown
  decorateColumn: unknown
  useReduceHeaderGroups: unknown
  useReduceFooterGroups: unknown
  useReduceFlatHeaders: unknown
  decorateHeader: unknown
  decorateRow: unknown
  decorateCell: unknown
  useInstanceAfterDataModel: unknown
  reduceTableProps: unknown
  reduceTableBodyProps: unknown
  reduceTableHeadProps: unknown
  reduceTableFootProps: unknown
  reduceHeaderGroupProps: unknown
  reduceFooterGroupProps: unknown
  reduceHeaderProps: unknown
  reduceRowProps: unknown
  reduceCellProps: unknown
}

type PlugType = [keyof PluginPlugs, PluginPlugBuilder]

type PluginPlugBuilder = any

type Plugs = Partial<Record<keyof PluginPlugs, unknown>>

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
  ['reduceTableFootProps', composeReducer],
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

  const plugs: Plugs = {}

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

  plugTypes.forEach(([plugType, plugCompositionFn]) => {
    const pluginPlugs = plugins
      // Get the info necessary to sort
      .map(plugin => {
        return {
          pluginName: plugin.name,
          plug: plugin.plugs[plugType],
          after: plugin.plugs[plugType]?.after || [],
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
  })

  return plugs
}
