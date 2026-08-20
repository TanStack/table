import type { Updater } from '@tanstack/table-core'

/**
 * Creates a small Svelte 5 state holder that accepts TanStack Table updaters.
 *
 * This is useful when a table state slice should be owned outside the table
 * with `$state`, but still needs to accept both value and functional updater
 * forms from `on[State]Change` callbacks.
 *
 * @example
 * ```ts
 * const [pagination, setPagination] = createTableState({
 *   pageIndex: 0,
 *   pageSize: 10,
 * })
 * ```
 */
export function createTableState<TState>(
  initialValue: TState,
): [() => TState, (updater: Updater<TState>) => void] {
  let value = $state(initialValue)

  return [
    () => value,
    (updater: Updater<TState>) => {
      if (updater instanceof Function) value = updater(value)
      else value = updater
    },
  ]
}
