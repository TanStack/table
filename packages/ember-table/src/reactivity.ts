import type { Subscription } from '@tanstack/store'
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
      if (this.#options?.compare?.(this._value, next)) {
        return;
      }

    this._value = next;
  }

  update(fn: (value: T) => T) {
    const original = untrack(() => this._value);

    this._value = fn(original);
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

export function computed<T>(fn: () => T) {
  return new ComputedSignal(fn);
}
