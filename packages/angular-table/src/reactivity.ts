import { computed, signal, untracked } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/angular-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Injector, Signal, WritableSignal } from '@angular/core'

function signalToReadonlyAtom<T>(
  signal: Signal<T>,
  injector: Injector,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      return toObservable(computed(signal), { injector: injector }).subscribe(
        observer,
      )
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
      return toObservable(computed(signal), { injector: injector }).subscribe(
        observer,
      )
    },
  })
}

/**
 * Creates the table-core reactivity bindings used by the Angular adapter.
 *
 * Readonly table atoms are backed by Angular `computed` signals and writable
 * atoms by Angular `signal`. Subscriptions bridge through `toObservable` with
 * the caller's injector so table APIs can be consumed from Angular `computed`
 * and `effect` calls.
 */
export function angularReactivity(injector: Injector): TableReactivityBindings {
  return {
    createOptionsStore: true,
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const signal = computed(() => fn(), {
        equal: options?.compare,
        debugName: options?.debugName,
      })
      return signalToReadonlyAtom(signal, injector)
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      const writableSignal = signal(value, {
        equal: options?.compare,
        debugName: options?.debugName,
      })
      return signalToWritableAtom(writableSignal, injector)
    },
    untrack: untracked,
    batch: (fn) => fn(),
  }
}
