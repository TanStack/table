import type { vi } from 'vitest'
import type { Person } from '../fixtures/data/types'

export const createArrayOfNumbers = (length: number) => {
  return Array.from({ length }, (_, i) => i)
}

export const getPeopleIds = (
  people: Array<Person>,
  usePersonId: boolean = false,
) => {
  return people.map((person, index) => (usePersonId ? person.id : `${index}`))
}

export function getUpdaterResult(mock: ReturnType<typeof vi.fn>, input: any) {
  const updaterFn = mock.mock.calls[0]?.[0]
  return updaterFn?.(input)
}
