import type { NoInfer } from './utils.types'
import type { TableOptionsResolved, TableState, Updater } from './types'

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (i: T) => T)(input)
    : updater
}

export function noop() {}

export function makeStateUpdater<K extends keyof TableState>(
  key: K,
  instance: unknown,
) {
  return (updater: Updater<TableState[K]>) => {
    ;(instance as any).setState(<TTableState>(old: TTableState) => {
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

export function isNumberArray(d: any): d is Array<number> {
  return Array.isArray(d) && d.every((val) => typeof val === 'number')
}

export function flattenBy<TNode>(
  arr: Array<TNode>,
  getChildren: (item: TNode) => Array<TNode>,
) {
  const flat: Array<TNode> = []

  const recurse = (subArr: Array<TNode>) => {
    subArr.forEach((item) => {
      flat.push(item)
      const children = getChildren(item)
      if (children.length) {
        recurse(children)
      }
    })
  }

  recurse(arr)

  return flat
}

export function memo<TDeps extends ReadonlyArray<any>, TDepArgs, TResult>(
  getDeps: (depArgs?: TDepArgs) => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: any
    debug?: () => any
    onChange?: (result: TResult) => void
  },
): (depArgs?: TDepArgs) => TResult {
  let deps: Array<any> = []
  let result: TResult | undefined

  return (depArgs) => {
    let depTime: number
    if (opts.key && opts.debug) depTime = Date.now()

    const newDeps = getDeps(depArgs)

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (!depsChanged) {
      return result!
    }

    deps = newDeps

    let resultTime: number
    if (opts.key && opts.debug) resultTime = Date.now()

    result = fn(...newDeps)
    opts.onChange?.(result)

    if (opts.key && opts.debug) {
      if (opts.debug()) {
        const depEndTime = Math.round((Date.now() - depTime!) * 100) / 100
        const resultEndTime = Math.round((Date.now() - resultTime!) * 100) / 100
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
              Math.min(120 - 120 * resultFpsPercentage, 120),
            )}deg 100% 31%);`,
          opts.key,
        )
      }
    }

    return result
  }
}

export function getMemoOptions(
  tableOptions: Partial<TableOptionsResolved<any>>,
  debugLevel:
    | 'debugAll'
    | 'debugCells'
    | 'debugTable'
    | 'debugColumns'
    | 'debugRows'
    | 'debugHeaders',
  key: string,
  onChange?: (result: any) => void,
) {
  return {
    debug: () => tableOptions.debugAll ?? tableOptions[debugLevel],
    key: process.env.NODE_ENV === 'development' && key,
    onChange,
  }
}
