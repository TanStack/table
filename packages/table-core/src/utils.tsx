import { Getter, NoInfer, PropGetterValue, TableState, Updater } from './types'

export type IsAny<T> = 0 extends 1 & T ? true : false
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type Overwrite<T, U extends { [TKey in keyof T]?: any }> = Omit<
  T,
  keyof U
> &
  U

export type DataUpdateFunction<T> = (input: T) => T

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as DataUpdateFunction<T>)(input)
    : updater
}

export function noop() {
  //
}

export function makeStateUpdater(key: keyof TableState, instance: unknown) {
  return (updater: Updater<any>) => {
    ;(instance as any).setState(<TTableState,>(old: TTableState) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, (old as any)[key]),
      }
    })
  }
}

type AnyFunction = (...args: any) => any

export function isFunction<T extends AnyFunction>(d: any): d is T {
  return d instanceof Function
}

export function flattenBy<TNode>(
  arr: TNode[],
  getChildren: (item: TNode) => TNode[]
) {
  const flat: TNode[] = []

  const recurse = (subArr: TNode[]) => {
    subArr.forEach(item => {
      flat.push(item)
      const children = getChildren(item)
      if (children?.length) {
        recurse(children)
      }
    })
  }

  recurse(arr)

  return flat
}

type PropGetterImpl = <TBaseProps, TGetter extends Getter<TBaseProps>>(
  initial: TBaseProps,
  userProps?: TGetter
) => PropGetterValue<TBaseProps, TGetter>

// @ts-ignore // Just rely on the type, not the implementation
export const propGetter: PropGetterImpl = (initial, getter) => {
  if (isFunction(getter)) {
    return getter(initial)
  }

  return {
    ...initial,
    ...(getter ?? {}),
  }
}

export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: string
    debug?: () => any
    onChange?: (result: TResult, previousResult?: TResult) => void
  }
): () => TResult {
  let deps: any[] = []
  let result: TResult | undefined

  return () => {
    let depTime: number
    if (opts.key && opts.debug) depTime = performance.now()

    const newDeps = getDeps()

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (depsChanged) {
      let oldResult = result
      let resultTime: number
      if (opts.key && opts.debug) resultTime = performance.now()
      result = fn(...newDeps)
      deps = newDeps
      opts?.onChange?.(result, oldResult)

      if (opts.key && opts.debug) {
        if (opts?.debug()) {
          const depEndTime =
            Math.round((performance.now() - depTime!) * 100) / 100
          const resultEndTime =
            Math.round((performance.now() - resultTime!) * 100) / 100
          const resultFpsPercentage = resultEndTime / 16

          const pad = (str: number | string, num: number) => {
            str = String(str)
            while (str.length < num) {
              str = ' ' + str
            }
            return str
          }

          console.info(
            `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
            `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
              0,
              Math.min(120 - 120 * resultFpsPercentage, 120)
            )}deg 100% 31%);`,
            opts?.key,
            {
              length: `${deps.length} -> ${newDeps.length}`,
              ...newDeps
                .map((_, index) => {
                  if (deps[index] !== newDeps[index]) {
                    return [index, deps[index], newDeps[index]]
                  }

                  return false
                })
                .filter(Boolean)
                .reduce(
                  (accu, [a, b]: any) => ({
                    ...accu,
                    [a]: b,
                  }),
                  {}
                ),
              parent,
            }
          )
        }
      }

      oldResult = undefined
    }

    return result!
  }
}

// export function hashString(str: string, seed = 0): string {
//   let h1 = 0xdeadbeef ^ seed,
//     h2 = 0x41c6ce57 ^ seed
//   for (let i = 0, ch; i < str.length; i++) {
//     ch = str.charCodeAt(i)
//     h1 = Math.imul(h1 ^ ch, 2654435761)
//     h2 = Math.imul(h2 ^ ch, 1597334677)
//   }
//   h1 =
//     Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
//     Math.imul(h2 ^ (h2 >>> 13), 3266489909)
//   h2 =
//     Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
//     Math.imul(h1 ^ (h1 >>> 13), 3266489909)
//   return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString()
// }
