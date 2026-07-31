import { batch, createAtom } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Observer, ReadonlyAtom } from '@tanstack/store'

function createStableReadonlyAtom<T>(
  fn: () => T,
  compare: (previous: T, next: T) => boolean,
): ReadonlyAtom<T> {
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
    ) =>
      boxedAtom.subscribe((box) => {
        if (typeof observer === 'function') {
          observer(box.value)
        } else {
          observer.next?.(box.value)
        }
      })) as ReadonlyAtom<T>['subscribe'],
  }
}

/**
 * Creates the table-core reactivity bindings used by the Alpine adapter.
 *
 * Alpine uses TanStack Store atoms directly. Table instance reads
 * are then exposed to Alpine through the proxy wrapper in `createTable`.
 */
export function alpineReactivity(): TableReactivityBindings {
  return {
    wrapExternalAtoms: false,
    addSubscription: () => {
      throw new Error(
        'Feature not supported in current reactivity implementation',
      )
    },
    unmount: () => {
      throw new Error(
        'Feature not supported in current reactivity implementation',
      )
    },
    schedule: (fn) => queueMicrotask(() => fn()),
    batch,
    untrack: (fn) => fn(),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      return createStableReadonlyAtom(
        fn,
        options?.compare ?? Object.is,
      )
    },
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return createAtom(value, {
        compare: options?.compare,
      })
    },
  }
}
