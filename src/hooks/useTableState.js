import React from 'react'

import { functionalUpdate, useGetLatest } from '../utils'

export default function useTableState(instance) {
  const getInstance = useGetLatest(instance)
  // Get the users initialState for the table
  instance.getInitialState = React.useCallback(
    () => functionalUpdate(getInstance().options.initialState),
    [getInstance]
  )

  // A home for our automatic internal table state
  const [autoState, setAutoState] = React.useState(instance.getInitialState)

  delete instance.queuedAutoState

  // The computed state with any conrolled state overrides from the user
  instance.state = React.useMemo(
    () => ({
      ...autoState,
      ...instance.options.userState,
    }),
    [autoState, instance.options.userState]
  )

  // Our super cool setState function with meta and onStateChange callback support
  instance.setState = React.useCallback(
    (updater, meta) => {
      const {
        state: old,
        options: { onStateChange },
      } = getInstance()

      const newState = functionalUpdate(
        updater,
        getInstance().queuedAutoState || old
      )

      const [newStateNoMeta, moreMeta] = Array.isArray(newState)
        ? newState
        : [newState, {}]

      const resolvedState = onStateChange(newStateNoMeta, old, {
        ...meta,
        ...moreMeta,
      })

      if (resolvedState && resolvedState !== old) {
        getInstance().queuedAutoState = {
          ...resolvedState,
          ...instance.options.userState,
        }
        setAutoState(resolvedState)
      }
    },
    [getInstance, instance.options.userState]
  )
}
