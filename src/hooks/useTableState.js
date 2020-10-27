import React from 'react'
import { functionalUpdate } from '../utils'

export default function useTableState(instance) {
  // A home for our automatic internal table state
  const [autoState, setAutoState] = React.useState(
    instance.options.initialState
  )

  delete instance.queuedAutoState

  // The computed state with any conrolled state overrides from the user
  instance.state = React.useMemo(
    () => ({
      ...autoState,
      ...instance.options.state,
    }),
    [autoState, instance.options.state]
  )

  // Our super cool setState function with meta and onStateChange callback support
  instance.setState = React.useCallback(
    (updater, meta) => {
      const {
        state: old,
        options: { onStateChange },
      } = instance

      const newState = functionalUpdate(
        updater,
        instance.queuedAutoState || old
      )

      const [newStateNoMeta, moreMeta] = Array.isArray(newState)
        ? newState
        : [newState, {}]

      const resolvedState = onStateChange(newStateNoMeta, old, {
        ...meta,
        ...moreMeta,
      })

      if (resolvedState && resolvedState !== old) {
        instance.queuedAutoState = {
          ...resolvedState,
          ...instance.options.state,
        }
        setAutoState(resolvedState)
      }
    },
    [instance]
  )
}
