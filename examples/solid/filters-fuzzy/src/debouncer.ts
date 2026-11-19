import { onCleanup } from 'solid-js'

/**
 * A small debouncer for this example. It stands in for
 * `@tanstack/solid-pacer`'s `createDebouncer` until Pacer supports Solid 2.
 */
export function createDebouncer<TArgs extends Array<any>>(
  fn: (...args: TArgs) => void,
  options: { wait: number | (() => number) },
) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  const cancel = () => clearTimeout(timeout)
  onCleanup(cancel)
  return {
    maybeExecute: (...args: TArgs) => {
      cancel()
      const wait =
        typeof options.wait === 'function' ? options.wait() : options.wait
      timeout = setTimeout(() => fn(...args), wait)
    },
    cancel,
  }
}
