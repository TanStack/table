import { createSignal, onCleanup } from 'solid-js'

/**
 * Subscribes to a table store and returns a reactive signal.
 * Handles both subscribe APIs: function return (store 0.8.x) and
 * { unsubscribe } object return (store 0.9.x).
 */
export function useTableStore<T, U>(
  store:
    | { state: T; subscribe: (listener: () => void) => unknown }
    | null
    | undefined,
  selector: (state: T) => U = (s) => s as unknown as U,
): (() => U) | undefined {
  if (!store) return undefined

  const [signal, setSignal] = createSignal(selector(store.state))
  const result = store.subscribe(() => {
    setSignal(() => selector(store.state))
  })

  onCleanup(() => {
    if (typeof result === 'function') {
      ;(result as () => void)()
    } else if (
      result &&
      typeof (result as { unsubscribe?: () => void }).unsubscribe === 'function'
    ) {
      ;(result as { unsubscribe: () => void }).unsubscribe()
    }
  })

  return signal
}
