import { createColumnHelper } from '../../../src'
import type { Person, PersonColumn, PersonKeys } from './types'

export function generateColumns(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<any, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as PersonKeys

    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}
