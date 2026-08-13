import { assertInInjectionContext, effect, untracked } from '@angular/core'

export function lazyInit<T extends object>(
  initializer: () => T,
): {
  readonly rawValue: T
  readonly value: T
  readonly initialized: boolean
} {
  assertInInjectionContext(lazyInit)
  let object: T | null = null

  const initializeObject = () => {
    if (!object) {
      object = untracked(() => initializer())
    }
  }

  effect(() => initializeObject(), {
    debugName: 'tableLazyInitEffect',
  })

  const table = () => {}

  const proxy = new Proxy<T>(table as T, {
    apply(target: T, thisArg: any, argArray: Array<any>): any {
      initializeObject()
      if (typeof object === 'function') {
        return Reflect.apply(object, thisArg, argArray)
      }
      return Reflect.apply(target as any, thisArg, argArray)
    },
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

  return {
    value: proxy,
    get rawValue() {
      return object as T
    },
    get initialized() {
      return !!object
    },
  }
}
