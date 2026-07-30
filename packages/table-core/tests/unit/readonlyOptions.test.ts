import { describe, expect, expectTypeOf, it } from 'vitest'
import { constructTable } from '../../src'
import { testFeatures } from '../fixtures/features'
import type { ColumnDef, ColumnDefBase_All, TableOptions } from '../../src'

interface Person {
  firstName: string
  lastName: string
  tags: ReadonlyArray<string>
}

const features = testFeatures({})

/**
 * Deeply readonly inputs, i.e. what a caller holds after `as const`, after
 * `Object.freeze`, or when reading out of an Immer/Redux-style immutable store.
 * These must be assignable to the table options without a cast.
 */
const readonlyData = [
  { firstName: 'tanner', lastName: 'linsley', tags: ['a'] },
  { firstName: 'kevin', lastName: 'vandy', tags: ['b'] },
] as const satisfies ReadonlyArray<Person>

const readonlyColumns = [
  { accessorKey: 'firstName', header: 'First' },
  {
    header: 'Name',
    // nested group children are readonly too, not just the outer array
    columns: [{ accessorKey: 'lastName', header: 'Last' }] as const,
  },
] as const satisfies ReadonlyArray<ColumnDef<typeof features, Person>>

describe('readonly table options', () => {
  it('accepts a readonly data array without a cast', () => {
    const table = constructTable({
      features,
      data: readonlyData,
      columns: [],
    })

    expect(table.getRowModel().rows).toHaveLength(2)
  })

  it('accepts readonly column defs, including readonly nested group columns', () => {
    const table = constructTable({
      features,
      data: readonlyData,
      columns: readonlyColumns,
    })

    expect(table.getAllLeafColumns().map((c) => c.id)).toEqual([
      'firstName',
      'lastName',
    ])
  })

  it('accepts a getUniqueValues that returns a readonly array', () => {
    const table = constructTable({
      features,
      data: readonlyData,
      columns: [
        {
          accessorKey: 'firstName',
          // returning `row.tags` directly, with no defensive copy
          getUniqueValues: (row) => row.tags,
        },
      ],
    })

    expect(table.getRowModel().rows[0]!.getUniqueValues('firstName')).toEqual([
      'a',
    ])
  })

  it('keeps mutable arrays assignable to every readonly input', () => {
    const mutableData: Array<Person> = [
      { firstName: 'tanner', lastName: 'linsley', tags: ['a'] },
    ]
    const mutableColumns: Array<ColumnDef<typeof features, Person>> = [
      { accessorKey: 'firstName', header: 'First' },
    ]

    const table = constructTable({
      features,
      data: mutableData,
      columns: mutableColumns,
    })

    expect(table.getRowModel().rows).toHaveLength(1)
  })

  it('declares readonly array types on the option surface', () => {
    type Options = TableOptions<typeof features, Person>

    expectTypeOf<Options['data']>().toEqualTypeOf<ReadonlyArray<Person>>()
    expectTypeOf<Options['columns']>().toEqualTypeOf<
      ReadonlyArray<ColumnDef<typeof features, Person>>
    >()
    expectTypeOf<
      NonNullable<ColumnDefBase_All<typeof features, Person>['getUniqueValues']>
    >().returns.toEqualTypeOf<ReadonlyArray<unknown>>()
  })
})
