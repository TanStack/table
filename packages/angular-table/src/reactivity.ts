import { NgZone, computed, signal, untracked } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import type { Injector, Signal, WritableSignal } from '@angular/core'
import type {
  Atom,
  Observer,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/angular-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

function signalToReadonlyAtom<T>(
  signal: Signal<T>,
  injector: Injector,
  debugName?: string,
): ReadonlyAtom<T> {
  const _signal = Object.assign(signal, {
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      return untracked(() =>
        toObservable(computed(signal), { injector: injector }).subscribe(
          observer,
        ),
      )
    },
  })
  if (debugName) {
    _signal.toString = () => debugName
  }
  return _signal
}

function signalToWritableAtom<T>(
  signal: WritableSignal<T>,
  injector: Injector,
  debugName?: string,
): Atom<T> {
  const _signal = Object.assign(signal.asReadonly(), {
    set: (updater: T | ((prevVal: T) => T)) => {
      typeof updater === 'function'
        ? signal.update(updater as (val: T) => T)
        : signal.set(updater)
    },
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      return untracked(() =>
        toObservable(computed(signal), { injector: injector }).subscribe(
          observer,
        ),
      )
    },
  })
  if (debugName) {
    _signal.toString = () => debugName
  }
  return _signal
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
  const subscriptions = new Set<Subscription>()

  return {
    createOptionsStore: true,
    wrapExternalAtoms: true,
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
    },
    schedule: (fn) => ngZone.runOutsideAngular(() => queueMicrotask(fn)),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const signal = computed(() => fn(), {
        equal: options?.compare,
        debugName: options?.debugName,
      })
      return signalToReadonlyAtom(signal, injector, options?.debugName)
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      const writableSignal = signal(value, {
        equal: options?.compare,
        debugName: options?.debugName,
      })
      return signalToWritableAtom(writableSignal, injector, options?.debugName)
    },
    untrack: untracked,
    batch: (fn) => fn(),
  }
}
