import { describe, expect, it } from 'vitest'
import {
  columnSizingFeature,
  constructTable,
  coreFeatures,
  createCoreRowModel,
} from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'

const features = {
  ...coreFeatures,
  columnSizingFeature,
  coreReactivityFeature: storeReactivityBindings(),
}

type Item = { id: string; a: string; b: string; c: string; d: string }

const data: Array<Item> = [
  { id: '1', a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
  { id: '2', a: 'a2', b: 'b2', c: 'c2', d: 'd2' },
]

function makeTable(opts: {
  columns: Array<any>
  columnSizing?: Record<string, number>
}): any {
  return constructTable({
    features: { ...features, coreRowModel: createCoreRowModel() },
    columns: opts.columns,
    data,
    state: opts.columnSizing ? { columnSizing: opts.columnSizing } : undefined,
  } as any)
}

describe('header_getSize', () => {
  it('returns default size for a leaf header', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a' }],
    })
    const header = table.getHeaderGroups()[0].headers[0]
    expect(header.getSize()).toBe(150)
  })

  it('returns columnDef.size for a leaf header', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 200 }],
    })
    const header = table.getHeaderGroups()[0].headers[0]
    expect(header.getSize()).toBe(200)
  })

  it('returns sum of subHeader sizes for a parent header', () => {
    const table = makeTable({
      columns: [
        {
          id: 'group',
          header: 'Group',
          columns: [
            { id: 'a', accessorKey: 'a', size: 100 },
            { id: 'b', accessorKey: 'b', size: 200 },
          ],
        },
      ],
    })
    const groupRow = table.getHeaderGroups()[0]
    const groupHeader = groupRow.headers[0]
    expect(groupHeader.getSize()).toBe(300)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
      columnSizing: { a: 250 },
    })
    const header = table.getHeaderGroups()[0].headers[0]
    expect(header.getSize()).toBe(250)
  })
})

describe('header_getStart', () => {
  it('returns 0 for the first header', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const headers = table.getHeaderGroups()[0].headers
    expect(headers[0].getStart()).toBe(0)
  })

  it('returns size of preceding header for the second header', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const headers = table.getHeaderGroups()[0].headers
    expect(headers[1].getStart()).toBe(100)
  })

  it('returns running sum of preceding sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const headers = table.getHeaderGroups()[0].headers
    expect(headers[0].getStart()).toBe(0)
    expect(headers[1].getStart()).toBe(100)
    expect(headers[2].getStart()).toBe(300)
    expect(headers[3].getStart()).toBe(350)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
      columnSizing: { a: 75 },
    })
    const headers = table.getHeaderGroups()[0].headers
    expect(headers[1].getStart()).toBe(75)
  })

  it('updates getStart when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let headers = table.getHeaderGroups()[0].headers
    expect(headers[1].getStart()).toBe(100)

    table.setColumnSizing({ a: 500 })
    headers = table.getHeaderGroups()[0].headers
    expect(headers[1].getStart()).toBe(500)
  })

  it('returns running sum across nested header groups (parent row)', () => {
    const table = makeTable({
      columns: [
        {
          id: 'g1',
          header: 'g1',
          columns: [
            { id: 'a', accessorKey: 'a', size: 100 },
            { id: 'b', accessorKey: 'b', size: 200 },
          ],
        },
        {
          id: 'g2',
          header: 'g2',
          columns: [
            { id: 'c', accessorKey: 'c', size: 50 },
            { id: 'd', accessorKey: 'd', size: 75 },
          ],
        },
      ],
    })
    const groups = table.getHeaderGroups()
    const parentRow = groups[0].headers
    expect(parentRow[0].getStart()).toBe(0)
    // group 2 starts after group 1 (100 + 200)
    expect(parentRow[1].getStart()).toBe(300)

    const leafRow = groups[1].headers
    expect(leafRow[0].getStart()).toBe(0)
    expect(leafRow[1].getStart()).toBe(100)
    expect(leafRow[2].getStart()).toBe(300)
    expect(leafRow[3].getStart()).toBe(350)
  })

  it('returns 0 for a single-header group', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
    })
    const headers = table.getHeaderGroups()[0].headers
    expect(headers[0].getStart()).toBe(0)
  })
})

describe('column_getStart', () => {
  it('returns 0 for the first column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0].getStart()).toBe(0)
  })

  it('returns size of preceding column for the second column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[1].getStart()).toBe(100)
  })

  it('returns running sum of preceding column sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0].getStart()).toBe(0)
    expect(cols[1].getStart()).toBe(100)
    expect(cols[2].getStart()).toBe(300)
    expect(cols[3].getStart()).toBe(350)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
      columnSizing: { a: 75, b: 30 },
    })
    const cols = table.getAllLeafColumns()
    expect(cols[2].getStart()).toBe(105)
  })

  it('updates getStart when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let cols = table.getAllLeafColumns()
    expect(cols[1].getStart()).toBe(100)

    table.setColumnSizing({ a: 500 })
    cols = table.getAllLeafColumns()
    expect(cols[1].getStart()).toBe(500)
  })
})

describe('column_getAfter', () => {
  it('returns 0 for the last column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[1].getAfter()).toBe(0)
  })

  it('returns size of following column for the second-to-last column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0].getAfter()).toBe(200)
  })

  it('returns running sum of following column sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0].getAfter()).toBe(325)
    expect(cols[1].getAfter()).toBe(125)
    expect(cols[2].getAfter()).toBe(75)
    expect(cols[3].getAfter()).toBe(0)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
      columnSizing: { b: 30, c: 25 },
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0].getAfter()).toBe(55)
  })

  it('updates getAfter when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let cols = table.getAllLeafColumns()
    expect(cols[0].getAfter()).toBe(200)

    table.setColumnSizing({ b: 500 })
    cols = table.getAllLeafColumns()
    expect(cols[0].getAfter()).toBe(500)
  })
})
