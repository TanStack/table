import React from 'react'

//

import { withCore } from '../plugins/withCore'
import makePlugs from './makePlugs'
import useTableState from './useTableState'
import useColumns from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useDataModel from './useDataModel'
import { TableInstance, TableOptions, Plugin } from '../types'

export function useTable(
  options: TableOptions,
  plugins?: Plugin[]
): TableInstance {
  const instanceRef = React.useRef<any>()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {
      plugs: makePlugs([withCore, ...(plugins || [])]),
    }
  }

  const instance: TableInstance = instanceRef.current

  // Apply the defaults to our options
  instance.options = instance.plugs?.useReduceOptions(options, {
    instance,
  })

  useTableState(instance)

  instance.plugs?.useInstanceAfterState(instance)

  useColumns(instance)
  useHeadersAndFooters(instance)
  useDataModel(instance)

  instance.plugs?.useInstanceAfterDataModel(instance)

  return instance
}
