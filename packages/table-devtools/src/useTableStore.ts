import { createEffect, createSignal, onCleanup } from 'solid-js'
import { scheduleDevtoolsUpdate } from './devtoolsUpdateScheduler'
import type { Accessor } from 'solid-js'
import type { Readable } from '@tanstack/solid-store'

interface UseTableStoreOptions<U> {
  equals?: false | ((previous: U | undefined, next: U | undefined) => boolean)
}

/**
 * Subscribes to a table store and returns a reactive signal.
 * Handles both function and `{ unsubscribe }` subscription results.
 */
export function useTableStore<T, U>(
  storeAccessor: Accessor<Readable<T> | null | undefined>,
  selector: (state: T) => U = (s) => s as unknown as U,
  options?: UseTableStoreOptions<U>,
): Accessor<U | undefined> {
  const initialStore = storeAccessor()
  const [signal, setSignal] = createSignal<U | undefined>(
    initialStore ? selector(initialStore.get()) : undefined,
    { equals: options?.equals },
  )

  createEffect(() => {
    const store = storeAccessor()
    let cancelPendingUpdate: (() => void) | undefined

    if (!store) {
      setSignal(() => undefined)
      return
    }

    setSignal(() => selector(store.get()))

    let latestValue: U
    const subscription = store.subscribe((snapshot) => {
      latestValue = selector(snapshot)

      if (cancelPendingUpdate) {
        return
      }

      cancelPendingUpdate = scheduleDevtoolsUpdate(() => {
        cancelPendingUpdate = undefined
        setSignal(() => latestValue)
      })
    }) as unknown as { unsubscribe: () => void } | (() => void)

    onCleanup(() => {
      cancelPendingUpdate?.()

      if (typeof subscription === 'function') {
        subscription()
      } else {
        subscription.unsubscribe()
      }
    })
  })

  return signal
}
