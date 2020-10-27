import React from 'react'

//

import { withCore } from '../plugins/withCore'
import makePlugs from './makePlugs'
import useTableState from './useTableState'
import useColumns from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useDataModel from './useDataModel'

export function useTable(options, plugins = []) {
  const instanceRef = React.useRef()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {
      plugs: makePlugs([withCore, ...plugins]),
    }
  }

  const instance = instanceRef.current

  // Apply the defaults to our options
  instance.options = instance.plugs.useReduceOptions(options, {
    instance,
  })

  useTableState(instance)

  instance.plugs.useInstanceAfterState(instance)

  useColumns(instance)
  useHeadersAndFooters(instance)
  useDataModel(instance)

  instance.plugs.useInstanceAfterDataModel(instance)

  return instance
}
