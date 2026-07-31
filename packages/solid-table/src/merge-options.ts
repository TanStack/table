function getMergedPrototype(sources: Array<object>): object | null {
  let fallback: object | null = Object.prototype

  for (let i = sources.length - 1; i >= 0; i--) {
    const prototype = Object.getPrototypeOf(sources[i]!)
    fallback = prototype

    // Adapter-owned option fragments are ordinary objects. Prefer a custom
    // user prototype when one exists in another source.
    if (prototype !== Object.prototype) {
      return prototype
    }
  }

  return fallback
}

/**
 * Lazily merges reactive Solid option sources.
 *
 * Unlike `mergeProps`, an explicitly present `undefined` wins over an earlier
 * value. This is required for clearing optional table options. The proxy also
 * keeps accessor reads live and reflects symbols and the user source's
 * prototype for the core option controller.
 */
export function mergeOptionSources<T extends Array<object>>(
  ...sources: T
): T[number] {
  const accessors = new Map<PropertyKey, () => unknown>()

  const read = (key: PropertyKey) => {
    for (let i = sources.length - 1; i >= 0; i--) {
      const source = sources[i]!
      if (Reflect.has(source, key)) {
        return Reflect.get(source, key, source)
      }
    }
  }

  return new Proxy(Object.create(null), {
    defineProperty() {
      return false
    },
    deleteProperty() {
      return false
    },
    get(_target, key) {
      return read(key)
    },
    getOwnPropertyDescriptor(_target, key) {
      let descriptor: PropertyDescriptor | undefined
      for (let i = sources.length - 1; i >= 0; i--) {
        descriptor = Reflect.getOwnPropertyDescriptor(sources[i]!, key)
        if (descriptor) break
      }
      if (!descriptor) return undefined

      let get = accessors.get(key)
      if (!get) {
        get = () => read(key)
        accessors.set(key, get)
      }

      return {
        configurable: true,
        enumerable: descriptor.enumerable ?? false,
        get,
      }
    },
    getPrototypeOf() {
      return getMergedPrototype(sources)
    },
    has(_target, key) {
      return sources.some((source) => Reflect.has(source, key))
    },
    ownKeys() {
      const keys = new Set<string | symbol>()
      for (const source of sources) {
        for (const key of Reflect.ownKeys(source)) keys.add(key)
      }
      return [...keys]
    },
    preventExtensions() {
      return false
    },
    set() {
      return false
    },
    setPrototypeOf() {
      return false
    },
  }) as T[number]
}
