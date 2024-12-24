import { createColumnHelper } from '../../../src'
import type { Person, PersonColumn, PersonKeys } from './types'
import type { TableFeatures } from '../../../src'

export function generateTestColumnDefs<TFeatures extends TableFeatures>(
  people: Array<Person>,
): Array<PersonColumn<TFeatures>> {
  const columnHelper = createColumnHelper<TFeatures, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as PersonKeys

    return columnHelper.accessor(typedKey, { id: typedKey } as any)
  })
}
