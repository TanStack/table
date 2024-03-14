import type { Updater } from '@tanstack/svelte-table'

export function createTableState<T>(
  initialValue: T
): [() => T, (updater: Updater<T>) => void] {
  let value = $state(initialValue)

  return [
    () => value,
    (updater: Updater<T>) => {
      if (updater instanceof Function) value = updater(value)
      else value = updater
    },
  ]
}
