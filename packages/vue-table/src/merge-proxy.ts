import { isRef } from 'vue'

function trueFn() {
  return true
}

const $PROXY = Symbol('merge-proxy')
const $SOURCES = Symbol('merge-proxy-sources')

// https://github.com/solidjs/solid/blob/c20ca4fd8c36bc0522fedb2c7f38a110b7ee2663/packages/solid/src/render/component.ts#L51-L118
const propTraps: ProxyHandler<{
  get: (k: string | number | symbol) => any
  getDescriptor: (k: string | number | symbol) => PropertyDescriptor | undefined
  has: (k: string | number | symbol) => boolean
  keys: () => Array<string | symbol>
  prototype: () => object | null
  sources: Array<any>
}> = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver
    if (property === $SOURCES) return _.sources
    return _.get(property)
  },
  has(_, property) {
    return _.has(property)
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    const descriptor = _.getDescriptor(property)
    if (!descriptor) return undefined

    return {
      configurable: true,
      enumerable: descriptor.enumerable ?? false,
      get() {
        return _.get(property)
      },
      set: trueFn,
    }
  },
  getPrototypeOf(_) {
    return _.prototype()
  },
  ownKeys(_) {
    return _.keys()
  },
}

type UnboxLazy<T> = T extends () => infer U ? U : T
type BoxedTupleTypes<T extends Array<any>> = {
  [P in keyof T]: [UnboxLazy<T[P]>]
}[Exclude<keyof T, keyof Array<any>>]
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never
type MergeProxy<T extends Array<any>> = UnboxIntersection<
  UnionToIntersection<BoxedTupleTypes<T>>
>

function resolveSource(s: any) {
  return isRef(s) ? s.value : s
}

function getMergedPrototype(sources: Array<any>): object | null {
  let fallback: object | null = Object.prototype

  for (let i = sources.length - 1; i >= 0; i--) {
    const source = resolveSource(sources[i])
    if (
      (typeof source !== 'object' && typeof source !== 'function') ||
      source === null
    ) {
      continue
    }

    const prototype = Object.getPrototypeOf(source)
    fallback = prototype

    // Adapter-injected option fragments are ordinary objects. Prefer a
    // meaningful user prototype when one is present in another source.
    if (prototype !== Object.prototype) {
      return prototype
    }
  }

  return fallback
}

export function mergeProxy<T extends Array<any>>(...sources: T): MergeProxy<T>
export function mergeProxy(...sources: any): any {
  const flattenedSources = sources.flatMap((source: any) => {
    if (
      typeof source === 'object' &&
      source !== null &&
      $SOURCES in source &&
      Array.isArray(source[$SOURCES])
    ) {
      return source[$SOURCES]
    }

    return [source]
  })

  return new Proxy(
    {
      sources: flattenedSources,
      get(property: string | number | symbol) {
        for (let i = flattenedSources.length - 1; i >= 0; i--) {
          const source = resolveSource(flattenedSources[i])
          if (source != null && Reflect.has(source, property)) {
            return Reflect.get(source, property, source)
          }
        }
      },
      getDescriptor(property: string | number | symbol) {
        for (let i = flattenedSources.length - 1; i >= 0; i--) {
          const source = resolveSource(flattenedSources[i])
          if (source == null) continue

          const descriptor = Reflect.getOwnPropertyDescriptor(source, property)
          if (descriptor) return descriptor
        }
        return undefined
      },
      has(property: string | number | symbol) {
        for (let i = flattenedSources.length - 1; i >= 0; i--) {
          const source = resolveSource(flattenedSources[i])
          if (source != null && Reflect.has(source, property)) return true
        }
        return false
      },
      keys() {
        const keys = new Set<string | symbol>()
        for (const unresolvedSource of flattenedSources) {
          const source = resolveSource(unresolvedSource)
          if (source == null) continue
          for (const key of Reflect.ownKeys(source)) keys.add(key)
        }
        return [...keys]
      },
      prototype() {
        return getMergedPrototype(flattenedSources)
      },
    },
    propTraps,
  )
}

/**
 * Merges objects together by eagerly resolving all values into a flat object.
 *
 * Unlike `mergeProxy`, this does not preserve lazy proxy getters. Use this for
 * repeated option update paths so each merge produces a plain object instead
 * of accumulating a longer source list over time.
 */
export function flatMerge<T>(source: T): T
export function flatMerge<T, U>(source: T, source1: U): T & U
export function flatMerge<T, U, V>(source: T, source1: U, source2: V): T & U & V
export function flatMerge<T, U, V, W>(
  source: T,
  source1: U,
  source2: V,
  source3: W,
): T & U & V & W
export function flatMerge(...sources: any): any {
  const result = Object.create(getMergedPrototype(sources)) as Record<
    PropertyKey,
    unknown
  >

  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    let source = sources[sourceIndex]
    source = resolveSource(source)
    if (!source) continue

    for (const key of Reflect.ownKeys(source)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(source, key)
      if (
        sourceIndex === sources.length - 1 &&
        descriptor &&
        !('value' in descriptor)
      ) {
        Object.defineProperty(result, key, {
          ...descriptor,
          configurable: true,
        })
        continue
      }

      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        value: Reflect.get(source, key, source),
        writable: true,
      })
    }
  }

  return result
}
