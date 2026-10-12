/**
 * Creates a stable object that forwards every read to `getTarget()`.
 *
 * `App*` wrappers provide a cell or header through context once, while the
 * instance behind them can change (e.g. `data` is replaced and a keyed
 * `v-for` reuses the component with a new cell). Reading `getTarget()` inside
 * a reactive scope also tracks the source prop, so consumers update with it.
 *
 * Prototype methods are called with the current instance as `this`, so
 * per-instance memos never see the proxy. The forwarders are cached per key so
 * method identity stays stable across target changes.
 */
export function createLiveProxy<T extends object>(getTarget: () => T): T {
  const forwarders = new Map<PropertyKey, (...args: Array<any>) => any>()

  return new Proxy({} as T, {
    get(_, key) {
      const target = getTarget()
      const value = Reflect.get(target, key, target)
      if (typeof value !== 'function' || Object.hasOwn(target, key)) {
        return value
      }
      let forwarder = forwarders.get(key)
      if (!forwarder) {
        forwarder = function (...args) {
          const current = getTarget() as any
          return current[key](...args)
        }
        forwarders.set(key, forwarder)
      }
      return forwarder
    },
    set(_, key, value) {
      return Reflect.set(getTarget(), key, value)
    },
    has(_, key) {
      return key in getTarget()
    },
    ownKeys() {
      return Reflect.ownKeys(getTarget())
    },
    getOwnPropertyDescriptor(_, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(getTarget(), key)
      return descriptor && { ...descriptor, configurable: true }
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(getTarget())
    },
  })
}
