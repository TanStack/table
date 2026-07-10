import type { Atom, AtomOptions, Observer, Subscription } from '@tanstack/store'

import { tracked, cached } from '@glimmer/tracking';
import { untrack } from '@glimmer/validator';

/**
 * Ember-native signal implementation.
 * In future ember >7.3 `tracked` will be available by itself
 * so the class wrapper will not be needed for those versions
 */
export class Signal<T> {
  @tracked _value;

  #options: AtomOptions<T> | undefined;

  // Ember reads are tag-tracked; this observer list exists for the plain-JS
  // subscribers core wires up (external-atom sync in constructTable, the
  // inspector), which have no access to framework tracking.
  #listeners = new Set<(value: T) => void>();

  constructor(value: T, options: AtomOptions<T> | undefined) {
    this._value = value;
    this.#options = options;
  }

  subscribe(
    listenerOrObserver: Observer<T> | ((value: T) => void),
  ): Subscription {
    const listener =
      typeof listenerOrObserver === 'function'
        ? listenerOrObserver
        : listenerOrObserver.next;

    if (!listener) {
      return { unsubscribe: () => {} };
    }

    this.#listeners.add(listener);
    return { unsubscribe: () => this.#listeners.delete(listener) };
  }

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

    const isEqual = this.#options?.compare
      ? this.#options.compare(prev, next) : prev === next;
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

export function signal<T>(value: T, options: AtomOptions<T> | undefined) {
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
  options?: AtomOptions<T>,
): Atom<T> {
  return signal(initialValue, options);
}

export function computed<T>(fn: () => T) {
  return new ComputedSignal(fn);
}
