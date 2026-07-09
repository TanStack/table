import type { Atom, Observer, Subscription } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

import { tracked, cached } from '@glimmer/tracking';
import { untrack } from '@glimmer/validator';

export function emberReactivity(): TableReactivityBindings {
  const subscriptions = new Set<Subscription>()

  return {
    createOptionsStore: true,
    wrapExternalAtoms: true,

    // timing is not important, but the main thing is that the work does *not*
    // happen during the render phase.
    schedule: (fn) => queueMicrotask(() => fn()),
    batch: (fn) => fn(),
    untrack,
    // @cached
    createReadonlyAtom: <T>(fn: () => T) => {
      return computed(fn);
    },
    // @tracked
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return signal(value, options);
    },
    // Not for the ember integration, but for the tanstack inspector
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
    },
  }
}


//////////////////
// for back-compat, because the primitives we need (outside of classes)
// are only in ember 7.3+ (probably)
//////////////////


export class Signal<T> {
  @tracked _value;

  #options: TableAtomOptions<T> | undefined;

  // Ember reads are tag-tracked; this observer list exists for the plain-JS
  // subscribers core wires up (external-atom sync in constructTable, the
  // inspector), which have no access to framework tracking.
  #listeners = new Set<(value: T) => void>();

  constructor(value: T, options: TableAtomOptions<T> | undefined) {
    this._value = value;
    this.#options = options;
  }

    subscribe(): Subscription { return null as unknown as Subscription/* handled by framework */}

    get() {
      return this.value;
    }
    set(value: T | ((prev: T) => T)) {
      if (typeof value === 'function') {
       return this.update(value as unknown as (prev: T) => T);
      }

     this.value =  value;
    }

  get value() {
    return this._value;
  }

  set value(next: T) {
    const prev = untrack(() => this._value);
    // Default Object.is cutoff guarantees the wrapped<->external atom sync
    // loop terminates: an echoed-back equal value stops here instead of
    // re-notifying. Table state is replaced immutably, so real changes always
    // differ by identity.
    const isEqual = this.#options?.compare
      ? this.#options.compare(prev, next)
      : Object.is(prev, next);
    if (isEqual) {
      return;
    }

    this._value = next;

    for (const listener of this.#listeners) {
      listener(next);
    }
  }

  update(fn: (value: T) => T) {
    const original = untrack(() => this._value);

    this.value = fn(original);
  }
}

export class ComputedSignal<T> {
  #compute;

  constructor(compute: () => T) {
    this.#compute = compute;
  }

  get() {
    return this.value;
  }

  subscribe(): Subscription { return null as unknown as Subscription/* handled by framework */}

  @cached
  get value() {
    return this.#compute();
  }
}

export function signal<T>(value: T, options: TableAtomOptions<T> | undefined) {
  return new Signal(value, options);
}

/**
 * Creates an Ember-native writable atom, satisfying the `@tanstack/store`
 * `Atom` contract so it can be passed to `options.atoms`. Because it is backed
 * by a `@tracked` Signal, reading `atom.get()` directly in a template or
 * getter is reactive — unlike a foreign `@tanstack/store` atom, whose reads
 * create no Glimmer tag dependency.
 *
 * Takes a plain initial value only; there is no derived/function overload.
 */
export function createAtom<T>(
  initialValue: T,
  options?: TableAtomOptions<T>,
): Atom<T> {
  return signal(initialValue, options);
}

export function computed<T>(fn: () => T) {
  return new ComputedSignal(fn);
}
