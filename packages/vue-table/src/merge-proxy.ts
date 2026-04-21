function trueFn() {
  return true
}

const $PROXY = Symbol('merge-proxy')
const $SOURCES = Symbol('merge-proxy-sources')

// https://github.com/solidjs/solid/blob/c20ca4fd8c36bc0522fedb2c7f38a110b7ee2663/packages/solid/src/render/component.ts#L51-L118
const propTraps: ProxyHandler<{
  get: (k: string | number | symbol) => any
  has: (k: string | number | symbol) => boolean
  keys: () => Array<string>
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
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property)
      },
      set: trueFn,
      deleteProperty: trueFn,
    }
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
  return 'value' in s ? s.value : s
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
          const v = resolveSource(flattenedSources[i])[property]
          if (v !== undefined) return v
        }
      },
      has(property: string | number | symbol) {
        for (let i = flattenedSources.length - 1; i >= 0; i--) {
          if (property in resolveSource(flattenedSources[i])) return true
        }
        return false
      },
      keys() {
        const keys = []
        for (const source of flattenedSources)
          keys.push(...Object.keys(resolveSource(source)))
        return [...Array.from(new Set(keys))]
      },
    },
    propTraps,
  )
}
