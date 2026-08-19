import {
  DestroyRef,
  assertInInjectionContext,
  inject,
  untracked,
} from '@angular/core'

const notInitializedObject = Symbol('notInitializedObject')
export function injectLazyInit<T extends object>(
  initializer: () => T,
  cleanup: (object: T) => void,
): T {
  assertInInjectionContext(injectLazyInit)
  const destroyRef = inject(DestroyRef)
  let object: T | typeof notInitializedObject = notInitializedObject

  destroyRef.onDestroy(() => {
    if (object !== notInitializedObject) {
      cleanup(object)
    }
  })

  const getObject = () => {
    if (destroyRef.destroyed && object === notInitializedObject) {
      throw new Error(
        '[@tanstack/angular-table] Cannot initialize object after view is destroyed',
      )
    }
    if (object === notInitializedObject) {
      object = untracked(initializer)
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
