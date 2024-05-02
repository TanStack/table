import { untracked } from '@angular/core'

/**
 * Implementation from @tanstack/angular-query
 * {@link https://github.com/TanStack/query/blob/main/packages/angular-query-experimental/src/util/lazy-init/lazy-init.ts}
 */
export function lazyInit<T extends object>(initializer: () => T): T {
  let object: T | null = null

  const initializeObject = () => {
    if (!object) {
      object = untracked(() => initializer())
    }
  }

  queueMicrotask(() => initializeObject())

  return new Proxy<T>({} as T, {
    get(_, prop, receiver) {
      initializeObject()
      return Reflect.get(object as T, prop, receiver)
    },
    has(_, prop) {
      initializeObject()
      return Reflect.has(object as T, prop)
    },
    ownKeys() {
      initializeObject()
      return Reflect.ownKeys(object as T)
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      }
    },
  })
}
