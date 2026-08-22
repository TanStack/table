import { describe, expectTypeOf, it } from 'vitest'
import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '../src'
import type { CellContext, ReactTable } from '../src'

type Person = {
  firstName: string
}

const features = tableFeatures({
  rowPaginationFeature,
})

describe('react context types', () => {
  it('types cell and header contexts with ReactTable', () => {
    const columnHelper = createColumnHelper<typeof features, Person>()

    type CellTable = CellContext<
      typeof features,
      Person,
      string
    >['table']

    expectTypeOf<CellTable>().toEqualTypeOf<
      ReactTable<typeof features, Person>
    >()

    const columns = columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: ({ table }) => {
          expectTypeOf(table).toEqualTypeOf<
            ReactTable<typeof features, Person>
          >()
          return table.state
        },
      }),
    ])

    expectTypeOf(columns).toBeArray()
    expectTypeOf(useTable).toBeFunction()
  })
})
