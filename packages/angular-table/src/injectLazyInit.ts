import {
  DestroyRef,
  assertInInjectionContext,
  inject,
  untracked,
} from '@angular/core'

export function injectLazyInit<T extends object>(
  initializer: () => T,
  cleanup: (object: T) => void,
): T {
  assertInInjectionContext(injectLazyInit)
  const destroyRef = inject(DestroyRef)
  let object: T | null = null

  const getObject = () => {
    if (object === null) {
      const initializedObject = untracked(initializer)
      object = initializedObject
      destroyRef.onDestroy(() => cleanup(initializedObject))
    }

    return object
  }

  return new Proxy<T>({} as T, {
    get(_, prop, receiver) {
      return Reflect.get(getObject(), prop, receiver)
    },
    has(_, prop) {
      return Reflect.has(getObject(), prop)
    },
    ownKeys() {
      return Reflect.ownKeys(getObject())
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      }
    },
  })
}
