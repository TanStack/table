/**
 * Merges objects together while keeping their getters alive.
 * Taken from SolidJS: {https://github.com/solidjs/solid/blob/24abc825c0996fd2bc8c1de1491efe9a7e743aff/packages/solid/src/server/rendering.ts#L82-L115}
 * */
export function mergeObjects<T>(source: T): T
export function mergeObjects<T, U>(source: T, source1: U): T & U
export function mergeObjects<T, U, V>(
  source: T,
  source1: U,
  source2: V,
): T & U & V
export function mergeObjects<T, U, V, W>(
  source: T,
  source1: U,
  source2: V,
  source3: W,
): T & U & V & W
export function mergeObjects(...sources: any): any {
  const target = Object.create(getMergedPrototype(sources))
  const keys = new Set<PropertyKey>()

  for (const unresolvedSource of sources) {
    const source = resolveSource(unresolvedSource)
    if (source == null) continue
    for (const key of Reflect.ownKeys(source)) keys.add(key)
  }

  for (const key of keys) {
    let enumerable = false
    for (let i = sources.length - 1; i >= 0; i--) {
      const source = resolveSource(sources[i])
      const descriptor =
        source == null
          ? undefined
          : Reflect.getOwnPropertyDescriptor(source, key)
      if (descriptor) {
        enumerable = descriptor.enumerable ?? false
        break
      }
    }

    Object.defineProperty(target, key, {
      configurable: true,
      enumerable,
      get() {
        for (let i = sources.length - 1; i >= 0; i--) {
          const source = resolveSource(sources[i])
          if (source != null && Reflect.has(source, key)) {
            return Reflect.get(source, key, source)
          }
        }
      },
    })
  }

  return target
}

function resolveSource(source: any) {
  return typeof source === 'function' ? source() : source
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
    if (prototype !== Object.prototype) {
      return prototype
    }
  }

  return fallback
}

/**
 * Merges objects together by eagerly resolving all values into a flat object.
 *
 * Unlike `mergeObjects`, this does NOT preserve getters — values are read once
 * and stored as plain data properties. This prevents the getter-chain
 * accumulation that causes O(N) lookups when the result is repeatedly passed
 * back as a source in subsequent merges (e.g., inside `$effect.pre` loops).
 *
 * Later sources take precedence, including an explicitly present `undefined`.
 *
 * @see https://github.com/TanStack/table/issues/6235
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
  for (const unresolvedSource of sources) {
    const source = resolveSource(unresolvedSource)
    if (source == null) continue
    for (const key of Reflect.ownKeys(source)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(source, key)
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
