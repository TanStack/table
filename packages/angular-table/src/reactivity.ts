import {
  DestroyRef,
  NgZone,
  computed,
  effect,
  signal,
  untracked,
} from '@angular/core'
import { batch, createAtom } from '@tanstack/angular-store'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/angular-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Injector, Signal, WritableSignal } from '@angular/core'

const optionsStoreDebugName = 'table/optionsStore'

function observerToCallback<T>(
  observerOrNext: Observer<T> | ((value: T) => void),
): (value: T) => void {
  return typeof observerOrNext === 'function'
    ? observerOrNext
    : (value) => observerOrNext.next?.(value)
}

function signalToReadonlyAtom<T>(
  source: Signal<T>,
  getSource: () => T,
  subscribeSource: (observerOrNext: Observer<T> | ((value: T) => void)) => {
    unsubscribe: () => void
  },
): ReadonlyAtom<T> {
  return Object.assign(source, {
    get: () => {
      const value = getSource()
      source()
      return value
    },
    subscribe: subscribeSource as ReadonlyAtom<T>['subscribe'],
  })
}

function signalToWritableAtom<T>(
  source: WritableSignal<T>,
  injector: Injector,
): Atom<T> {
  const observers = new Set<(value: T) => void>()
  let observed = false
  effect(
    () => {
      const value = source()
      if (!observed) {
        observed = true
        return
      }
      observers.forEach((observer) => observer(value))
    },
    { injector },
  )

  return Object.assign(source.asReadonly(), {
    set: (updater: T | ((prevVal: T) => T)) => {
      typeof updater === 'function'
        ? source.update(updater as (val: T) => T)
        : source.set(updater)
    },
    get: () => source(),
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const observer = observerToCallback(observerOrNext)
      observers.add(observer)

      return {
        unsubscribe: () => observers.delete(observer),
      }
    }) as Atom<T>['subscribe'],
  })
}

/**
 * Creates the table-core reactivity bindings used by the Angular adapter.
 *
 * Table state atoms are backed by TanStack Store atoms. The options store stays
 * framework-native because row-model APIs read `table.options` directly during
 * render. Readonly table atoms bridge Store dependency tracking into Angular
 * computed signals.
 */
export function angularReactivity(injector: Injector): TableReactivityBindings {
  const ngZone = injector.get(NgZone)
  const destroyRef = injector.get(DestroyRef)

  return {
    createOptionsStore: true,
    schedule: (fn) => ngZone.runOutsideAngular(() => queueMicrotask(fn)),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const storeAtom = createAtom(() => fn(), {
        compare: options?.compare,
      })
      const version = signal(0, {
        equal: () => false,
      })
      const subscription = storeAtom.subscribe(() => {
        version.update((value) => value + 1)
      })
      destroyRef.onDestroy(() => subscription.unsubscribe())

      const value = computed(
        () => {
          version()
          return storeAtom.get()
        },
        {
          equal: options?.compare,
          debugName: options?.debugName,
        },
      )
      return signalToReadonlyAtom(
        value,
        () => storeAtom.get(),
        (observerOrNext) => {
          const observer = observerToCallback(observerOrNext)
          return storeAtom.subscribe(() => {
            observer(storeAtom.get())
          })
        },
      )
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      if (options?.debugName === optionsStoreDebugName) {
        const writableSignal = signal(value, {
          equal: options.compare,
          debugName: options.debugName,
        })
        return signalToWritableAtom(writableSignal, injector)
      }

      return createAtom(value, {
        compare: options?.compare,
      })
    },
    untrack: untracked,
    batch,
  }
}
