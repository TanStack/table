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
