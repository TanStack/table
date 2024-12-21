import type { Updater } from '@tanstack/table-core'

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
