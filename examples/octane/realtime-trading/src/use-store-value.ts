import { useEffect, useState } from 'octane'

interface SubscribableValue<T> {
  get: () => T
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void }
}

export function useStoreValue<T>(source: SubscribableValue<T>): T {
  const [value, setValue] = useState(() => source.get())
  useEffect(() => {
    setValue(source.get())
    const subscription = source.subscribe((nextValue) => setValue(nextValue))
    return () => subscription.unsubscribe()
  }, [source])
  return value
}

export function useStoreSelector<T, TSelected>(
  source: SubscribableValue<T>,
  selector: (value: T) => TSelected,
  compare: (previous: TSelected, next: TSelected) => boolean,
): TSelected {
  const [selected, setSelected] = useState(() => selector(source.get()))
  useEffect(() => {
    const update = (value: T): void => {
      const next = selector(value)
      setSelected((previous) => (compare(previous, next) ? previous : next))
    }

    update(source.get())
    const subscription = source.subscribe(update)
    return () => subscription.unsubscribe()
  }, [compare, selector, source])
  return selected
}

export function shallowEqual<T>(previous: T, next: T): boolean {
  if (Object.is(previous, next)) return true
  if (
    typeof previous !== 'object' ||
    previous === null ||
    typeof next !== 'object' ||
    next === null
  ) {
    return false
  }

  const previousRecord = previous as Record<string, unknown>
  const nextRecord = next as Record<string, unknown>
  const previousKeys = Object.keys(previousRecord)
  const nextKeys = Object.keys(nextRecord)
  return (
    previousKeys.length === nextKeys.length &&
    previousKeys.every((key) => Object.is(previousRecord[key], nextRecord[key]))
  )
}
