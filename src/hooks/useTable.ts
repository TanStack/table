import React from 'react'

//

import type { InstancePlugs } from './makePlugs'

import { withCore } from '../plugins/withCore'
import makePlugs from './makePlugs'
import useTableState from './useTableState'
import useColumns, { Column } from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useDataModel from './useDataModel'

interface TableInstance {
  options: {
    columns: Column[]
  }
  plugs: InstancePlugs
}

interface TableOptions {}

export function useTable(options: TableOptions, plugins = []) {
  const instanceRef = React.useRef<Partial<TableInstance>>()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {
      plugs: makePlugs([withCore, ...plugins]),
    } as Pick<TableInstance, 'plugs'>
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
