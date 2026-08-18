import { registerDestructor } from '@ember/destroyable'

interface Subscription {
  unsubscribe: () => void
}
interface Subscribable<T> {
  get: () => T
  subscribe: (listener: (value: T) => void) => Subscription
}

export function observeValue<T>(
  owner: object,
  source: Subscribable<T>,
  update: (value: T) => void,
): void {
  const subscription = source.subscribe(update)
  registerDestructor(owner, () => subscription.unsubscribe())
}

export function registerCleanup(owner: object, cleanup: () => void): void {
  registerDestructor(owner, cleanup)
}
