import * as React from 'react'
export * from '@tanstack/table-core'

import {
  createTableInstance,
  _NonGenerated,
  PartialKeys,
  Options,
  TableInstance,
  PartialGenerics,
  CreateTableFactoryOptions,
  TableFactory,
} from '@tanstack/table-core'

export function useTable<TGenerics extends PartialGenerics>(
  table: TableFactory<TGenerics>,
  options: PartialKeys<
    Omit<Options<TGenerics>, keyof CreateTableFactoryOptions<any, any, any>>,
    'state' | 'onStateChange'
  >
): TableInstance<TGenerics> {
  // Compose in the generic options to the user options
  const resolvedOptions = {
    ...(table.__options ?? {}),
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    ...options,
  }

  // Create a new table instance and store it in state
  const [instance] = React.useState(() =>
    createTableInstance<TGenerics>(resolvedOptions)
  )

  // By default, manage table state here using the instance's initial state
  const [state, setState] = React.useState(() => instance.initialState)

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  instance.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: updater => {
      setState(updater)
      options.onStateChange?.(updater)
    },
  }))

  return instance
}
