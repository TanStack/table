import { createColumnHelper } from '../../../src'
import type { Person, PersonColumn, PersonKeys } from './types'
import type { RowData, TableFeatures } from '../../../src'

export function generateTestColumnDefs<
  TFeatures extends TableFeatures,
  TData extends RowData = Person,
>(people: Array<TData>): Array<PersonColumn<TFeatures, TData>> {
  const columnHelper = createColumnHelper<TFeatures, TData>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as PersonKeys

    return columnHelper.accessor(typedKey as any, { id: typedKey } as any)
  })
}
