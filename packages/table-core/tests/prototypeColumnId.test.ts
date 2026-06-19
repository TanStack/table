import { describe, expect, it } from 'vitest'
import { ColumnDef, getCoreRowModel } from '../src'
import { createTable } from '../src/core/table'

type Row = Record<string, string>

// Column ids that collide with Object.prototype members used to poison the
// per-row value caches (see Row.getValue / _valuesCache). These must be
// treated as plain data keys, not as inherited methods.
const PROTOTYPE_IDS = [
  'hasOwnProperty',
  'toString',
  'constructor',
  'valueOf',
  '__proto__',
  'isPrototypeOf',
]

function makeTable(data: Row[]) {
  const columns: ColumnDef<Row>[] = PROTOTYPE_IDS.map((id) => ({
    id,
    accessorFn: (row) => row[id],
  }))

  return createTable<Row>({
    onStateChange() {},
    renderFallbackValue: '',
    data,
    state: {},
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
}

describe('prototype-named column ids', () => {
  it('does not throw and returns the correct value from getValue', () => {
    const data: Row[] = [
      Object.fromEntries(PROTOTYPE_IDS.map((id) => [id, `${id}-value`])),
    ]
    const table = makeTable(data)
    const row = table.getCoreRowModel().rows[0]!

    for (const id of PROTOTYPE_IDS) {
      // First read populates the cache, the second reads it back. Neither
      // should throw, and both should yield the user-supplied value.
      expect(() => row.getValue(id)).not.toThrow()
      expect(row.getValue(id)).toBe(`${id}-value`)
      expect(row.getValue(id)).toBe(`${id}-value`)
    }
  })

  it('does not let a cached hasOwnProperty value break later getValue calls', () => {
    const data: Row[] = [
      Object.fromEntries(PROTOTYPE_IDS.map((id) => [id, `${id}-value`])),
    ]
    const table = makeTable(data)
    const row = table.getCoreRowModel().rows[0]!

    // Reading the hasOwnProperty column used to overwrite the inherited method
    // on the cache, breaking every subsequent getValue on the row.
    expect(row.getValue('hasOwnProperty')).toBe('hasOwnProperty-value')
    expect(() => row.getValue('toString')).not.toThrow()
    expect(row.getValue('toString')).toBe('toString-value')
  })

  it('returns unique values for prototype-named column ids', () => {
    const data: Row[] = [
      Object.fromEntries(PROTOTYPE_IDS.map((id) => [id, `${id}-value`])),
    ]
    const table = makeTable(data)
    const row = table.getCoreRowModel().rows[0]!

    for (const id of PROTOTYPE_IDS) {
      expect(() => row.getUniqueValues(id)).not.toThrow()
      expect(row.getUniqueValues(id)).toEqual([`${id}-value`])
    }
  })
})
