import { createEffect, createSignal, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Readable } from '@tanstack/solid-store'

/**
 * Subscribes to a table store and returns a reactive signal.
 * Handles both subscribe APIs: function return (store 0.8.x) and
 * { unsubscribe } object return (store 0.9.x).
 */
export function useTableStore<T, U>(
  storeAccessor: Accessor<Readable<T> | null | undefined>,
  selector: (state: T) => U = (s) => s as unknown as U,
): Accessor<U | undefined> {
  const initialValue = storeAccessor()?.get()
  const [signal, setSignal] = createSignal(
    initialValue ? selector(initialValue) : undefined,
  )

  createEffect(() => {
    const store = storeAccessor()
    if (!store) return

    const subscription = store.subscribe(() => {
      setSignal(() => selector(store.get()))
    })

    onCleanup(() => {
      subscription.unsubscribe()
    })
  })

  return signal
}
