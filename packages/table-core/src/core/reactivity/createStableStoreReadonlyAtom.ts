import type { AtomOptions, Observer, ReadonlyAtom } from '@tanstack/store'

type StoreReadonlyAtomFactory = <T>(
  getValue: (previous?: T) => T,
  options?: AtomOptions<T>,
) => ReadonlyAtom<T>

/**
 * Creates a TanStack Store computed whose equality also works for `undefined`.
 *
 * Store uses `undefined` as its uninitialized computed snapshot, so a computed
 * that legitimately returns `undefined` is otherwise reported as changed on
 * every dependency invalidation. Keeping the compared value inside a stable
 * box gives Store a distinct initialized snapshot without changing the public
 * atom value.
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
