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

export function angularReactivity(injector: Injector): TableReactivityBindings {
  return {
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
