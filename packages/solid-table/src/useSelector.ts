import { createSignal, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Subscribable } from '@tanstack/store'

export interface UseSelectorOptions<TSelected> {
  compare?: (a: TSelected, b: TSelected) => boolean
}

const defaultCompare = <T>(a: T, b: T): boolean => a === b

/**
 * Solid read hook for TanStack Store atoms/stores. Returns a Solid Accessor
 * for the selected slice and unsubscribes on cleanup.
 *
 * Inlined locally (instead of consuming `@tanstack/solid-store`) so we don't
 * pull in `solid-js/web` (a Solid v1 path that doesn't exist in Solid v2).
 */
export function useSelector<TSource, TSelected = TSource>(
  source: Subscribable<TSource> & { get: () => TSource },
  selector: (snapshot: TSource) => TSelected = (value) =>
    value as unknown as TSelected,
  options?: UseSelectorOptions<TSelected>,
): Accessor<TSelected> {
  const compare = options?.compare ?? defaultCompare
  const [signal, setSignal] = createSignal(
    selector(source.get()) as Exclude<TSelected, Function>,
    {
      equals: compare,
    },
  )
  const unsubscribe = source.subscribe((snapshot: TSource) => {
    setSignal(() => selector(snapshot))
  }).unsubscribe
  onCleanup(() => {
    unsubscribe()
  })
  return signal
}
