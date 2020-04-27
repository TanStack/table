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
import { withColumnFilters } from '../plugins/withColumnFilters'
import { withGlobalFilter } from '../plugins/withGlobalFilter'
import { withGrouping } from '../plugins/withGrouping'
import { withSorting } from '../plugins/withSorting'
import { withExpanding } from '../plugins/withExpanding'
import { withPagination } from '../plugins/withPagination'
import { withSelection } from '../plugins/withSelection'

//

const plugTypes = [
  ['useOptions', composeReducer],
  ['useInstanceAfterState', composeDecorator],
  ['useInstanceAfterDataModel', composeDecorator],
  ['decorateFlatColumns', composeDecorator],
  ['decorateColumn', composeDecorator],
  ['decorateOrderedColumns', composeDecorator],
  ['decorateVisibleColumns', composeDecorator],
  ['decorateRow', composeDecorator],
  ['decorateCell', composeDecorator],
  ['useInstanceFinal', composeDecorator],
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
    plugins: [
      withCore,
      withVisibility,
      withColumnFilters,
      withGlobalFilter,
      withGrouping,
      withSorting,
      withExpanding,
      withPagination,
      withSelection,
      ...options.plugins,
    ].filter(Boolean),
  }

  instance.plugs = {}

  plugTypes.forEach(([plugType, compositionFn]) => {
    const pluginPlugs = options.plugins
      .map(plugin => plugin[plugType])
      .filter(Boolean)

    instance.plugs[plugType] = compositionFn(...pluginPlugs)
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
