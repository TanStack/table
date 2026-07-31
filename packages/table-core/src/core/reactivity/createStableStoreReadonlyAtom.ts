import type { AtomOptions, Observer, ReadonlyAtom } from '@tanstack/store'

type StoreReadonlyAtomFactory = <T>(
  getValue: (previous?: T) => T,
  options?: AtomOptions<T>,
) => ReadonlyAtom<T>

/**
 * Creates a TanStack Store computed that can safely return any value.
 *
 * TanStack Store treats a function passed to `createAtom` as a computed
 * resolver and uses `undefined` as its uninitialized computed snapshot.
 * Keeping the result inside a stable box therefore lets the computed return
 * function-valued or `undefined` values while preserving result equality.
 */
export function createStableStoreReadonlyAtom<T>(
  createAtom: StoreReadonlyAtomFactory,
  fn: () => T,
  options?: AtomOptions<T>,
): ReadonlyAtom<T> {
  const compare = options?.compare ?? Object.is
  let stableBox: { value: T } | undefined

  const boxedAtom = createAtom(
    () => {
      const nextValue = fn()

      if (!stableBox || !compare(stableBox.value, nextValue)) {
        stableBox = { value: nextValue }
      }

      return stableBox
    },
  )

  return {
    get: () => boxedAtom.get().value,
    subscribe: ((
      observer: Observer<T> | ((value: T) => void),
    ) => {
      return boxedAtom.subscribe((box) => {
        if (typeof observer === 'function') {
          observer(box.value)
        } else {
          observer.next?.(box.value)
        }
      })
    }) as ReadonlyAtom<T>['subscribe'],
  }
}
