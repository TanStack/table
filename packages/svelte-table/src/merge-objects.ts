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
  const target = {}
  for (let source of sources) {
    if (typeof source === 'function') source = source()
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source)
      for (const key in descriptors) {
        if (key in target) continue
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let v,
                s = sources[i]
              if (typeof s === 'function') s = s()
              // eslint-disable-next-line prefer-const
              v = (s || {})[key]
              if (v !== undefined) return v
            }
          },
        })
      }
    }
  }
  return target
}

/**
 * Merges objects together by eagerly resolving all values into a flat object.
 *
 * Unlike `mergeObjects`, this does NOT preserve getters — values are read once
 * and stored as plain data properties. This prevents the getter-chain
 * accumulation that causes O(N) lookups when the result is repeatedly passed
 * back as a source in subsequent merges (e.g., inside `$effect.pre` loops).
 *
 * Later sources take precedence; `undefined` values do not override.
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
  const result: Record<PropertyKey, unknown> = {}
  for (let source of sources) {
    if (typeof source === 'function') source = source()
    if (!source) continue
    for (const key of Reflect.ownKeys(source)) {
      const value = (source as Record<PropertyKey, unknown>)[key]
      if (value !== undefined) {
        result[key as string] = value
      }
    }
  }
  return result
}
