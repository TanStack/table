import React from 'react'

//

import { composeDecorator, composeReducer } from '../utils'

import useTableOptions from './useTableOptions'
import useTableState from './useTableState'
import useColumns from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useDataModel from './useDataModel'
import useHeaderWidths from './useHeaderWidths'

import { withCore } from '../plugins/withCore'
import { withVisibility } from '../plugins/withVisibility'

//

const plugTypes = [
  ['useReduceOptions', composeReducer],
  ['useInstanceAfterState', composeDecorator],
  ['useInstanceAfterDataModel', composeDecorator],
  ['decorateFlatColumns', composeDecorator],
  ['decorateColumn', composeDecorator],
  ['decorateHeader', composeDecorator],
  ['decorateOrderedColumns', composeDecorator],
  ['decorateVisibleColumns', composeDecorator],
  ['decorateRow', composeDecorator],
  ['decorateCell', composeDecorator],
  ['useInstanceFinal', composeDecorator],
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

export const useTable = options => {
  const instanceRef = React.useRef()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {}
  }
  const instance = instanceRef.current

  options = {
    ...options,
    plugins: [withCore, withVisibility, ...options.plugins].filter(Boolean),
  }

  instance.plugs = {}

  plugTypes.forEach(([plugType, compositionFn]) => {
    const pluginPlugs = options.plugins
      .map(plugin => plugin[plugType])
      .filter(Boolean)

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

  useHeaderWidths(instance)

  instance.plugs.useInstanceFinal(instance)

  return instance
}
