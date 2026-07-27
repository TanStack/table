import { batch, createAtom, useSelector } from '@tanstack/react-store'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Subscription } from '@tanstack/react-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

interface ExternalSource<T> {
  get: () => T
  subscribe: (listener: (value: T) => void) => Subscription
}

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export interface ReactTableReactivityBindings extends TableReactivityBindings {
  /**
   * Invalidates readonly atoms after React commits updated plain options.
   */
  commit: () => void
}

/**
 * Creates the table-core reactivity bindings used by the React adapter.
 *
 * React stores table state in TanStack Store atoms and leaves options as plain
 * resolved data because `useTable` synchronizes options during render.
 */
export function reactReactivity(): ReactTableReactivityBindings {
  const commitAtom = createAtom(0)

  return {
    createOptionsStore: false,
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
    schedule: (fn) => queueMicrotask(fn),
    batch,
    untrack: (fn) => fn(),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const compare = options?.compare ?? Object.is
      let hasSnapshot = false
      let snapshot: T

      // The returned atom is a live facade: get() must see the options from the
      // render in progress, while subscribe() must only publish after commit.
      // The hidden computed tracks both real atom dependencies and commitAtom,
      // which covers changes whose only reactive source is a plain option
      // (controlled state ownership, for example).
      const getSnapshot = () => {
        const nextSnapshot = fn()

        if (!hasSnapshot || !compare(snapshot, nextSnapshot)) {
          snapshot = nextSnapshot
          hasSnapshot = true
        }

        return snapshot
      }

      const reactiveAtom = createAtom(
        () => {
          commitAtom.get()
          return getSnapshot()
        },
        {
          compare,
        },
      )

      return {
        get: getSnapshot,
        subscribe: reactiveAtom.subscribe.bind(reactiveAtom),
      }
    },
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return createAtom(value, {
        compare: options?.compare,
      })
    },
    commit: () => {
      commitAtom.set((version) => version + 1)
    },
  }
}

/**
 * Selects the root table state while filtering notifications that merely
 * publish a snapshot already read during the current React render.
 *
 * Isolated `table.Subscribe` consumers still receive the underlying store
 * notification; only this hook's root subscription is filtered.
 */
export function useTableSelector<TState, TSelected>(
  source: ExternalSource<TState>,
  selector: ((state: TState) => TSelected) | undefined,
  compare: (previous: TSelected, next: TSelected) => boolean,
): TSelected {
  const committedSelectorRef = useRef(selector)
  const committedSelectionRef = useRef<
    | { hasSnapshot: false }
    | {
        hasSnapshot: true
        snapshot: TSelected
      }
  >({ hasSnapshot: false })

  const [filteredSource] = useState(() => {
    return {
      get: () => source.get(),
      subscribe: (onStoreChange: (value: TState) => void) => {
        return source.subscribe((nextState) => {
          const select =
            committedSelectorRef.current ??
            ((state: TState) => state as unknown as TSelected)
          const nextSelection = select(nextState)
          const committedSelection = committedSelectionRef.current

          if (
            !committedSelection.hasSnapshot ||
            !compare(committedSelection.snapshot, nextSelection)
          ) {
            onStoreChange(nextState)
          }
        })
      },
    }
  })

  const selected = useSelector(filteredSource, selector, { compare })

  useIsomorphicLayoutEffect(() => {
    committedSelectorRef.current = selector
    committedSelectionRef.current = {
      hasSnapshot: true,
      snapshot: selected,
    }
  })

  return selected
}
