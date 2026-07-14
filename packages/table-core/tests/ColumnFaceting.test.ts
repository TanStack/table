import { describe, expect, it, vi } from 'vitest'
import { ColumnDef, createTable, getCoreRowModel } from '../src'

type Person = {
  name: string
}

const data: Person[] = [{ name: 'Alice' }]
const columns: ColumnDef<Person>[] = [{ accessorKey: 'name' }]

function createFacetedValuesFactory(value: string) {
  return vi.fn(() => () => new Map([[value, 1]]))
}

describe('ColumnFaceting', () => {
  it('updates custom faceted unique values when the option changes', () => {
    const initialFactory = createFacetedValuesFactory('initial')
    const updatedFactory = createFacetedValuesFactory('updated')
    const table = createTable<Person>({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getFacetedUniqueValues: initialFactory,
      onStateChange() {},
      renderFallbackValue: null,
      state: {},
    })
    const column = table.getColumn('name')!

    expect(column.getFacetedUniqueValues()).toEqual(new Map([['initial', 1]]))
    expect(table.getGlobalFacetedUniqueValues()).toEqual(
      new Map([['initial', 1]]),
    )

    table.setOptions((options) => ({
      ...options,
      getFacetedUniqueValues: updatedFactory,
    }))

    expect(column.getFacetedUniqueValues()).toEqual(new Map([['updated', 1]]))
    expect(table.getGlobalFacetedUniqueValues()).toEqual(
      new Map([['updated', 1]]),
    )
    expect(column.getFacetedUniqueValues()).toEqual(new Map([['updated', 1]]))
    expect(table.getGlobalFacetedUniqueValues()).toEqual(
      new Map([['updated', 1]]),
    )
    expect(initialFactory).toHaveBeenCalledTimes(2)
    expect(updatedFactory).toHaveBeenCalledTimes(2)
  })
})
