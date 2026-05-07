import { shallow, useSelector } from '@tanstack/svelte-store'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/svelte-store'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * Fine-grained subscription to a source using `useSelector` with shallow
 * comparison. Omit `selector` to subscribe to the source value directly.
 */
export function subscribeTable<TSourceValue>(
  source: SubscribeSource<TSourceValue>,
): ReturnType<typeof useSelector<TSourceValue>>
export function subscribeTable<TSourceValue, TSelected>(
  source: SubscribeSource<TSourceValue>,
  selector: (state: TSourceValue) => TSelected,
): ReturnType<typeof useSelector<TSourceValue, TSelected>>
export function subscribeTable<TSourceValue, TSelected>(
  source: SubscribeSource<TSourceValue>,
  selector?: (state: TSourceValue) => TSelected,
) {
  return useSelector(source, selector, { compare: shallow })
}
