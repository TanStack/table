import { DestroyRef, NgZone, computed, signal, untracked } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { batch, createAtom } from '@tanstack/angular-store'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/angular-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Injector, Signal, WritableSignal } from '@angular/core'

const optionsStoreDebugName = 'table/optionsStore'

function signalToReadonlyAtom<T>(
  signal: Signal<T>,
  injector: Injector,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      const subscription = toObservable(computed(signal), {
        injector: injector,
      }).subscribe(observer)

      return {
        unsubscribe: () => subscription.unsubscribe(),
      }
    },
  })
}

function signalToWritableAtom<T>(
  signal: WritableSignal<T>,
  injector: Injector,
): Atom<T> {
  return Object.assign(signal.asReadonly(), {
    set: (updater: T | ((prevVal: T) => T)) => {
      typeof updater === 'function'
        ? signal.update(updater as (val: T) => T)
        : signal.set(updater)
    },
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      const subscription = toObservable(computed(signal), {
        injector: injector,
      }).subscribe(observer)

      return {
        unsubscribe: () => subscription.unsubscribe(),
      }
    },
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
      return signalToReadonlyAtom(value, injector)
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
