import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  coreFeatures,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowSortingFeature,
  sortFns,
} from '../../../src'
import { storeReactivityBindings } from '../../../src/store-reactivity-bindings'
import { serializeRowModel } from '../../../src/worker/serializeRowModel'
import { rebuildRowModel } from '../../../src/worker/rebuildRowModel'
import { makeObjectMap } from '../../../src/utils'
import type { Table_Internal } from '../../../src'

type Person = {
  firstName: string
  age: number
  visits: number
  status: 'single' | 'complicated' | 'relationship'
}

const STATUSES = ['single', 'complicated', 'relationship'] as const

function makeData(count: number): Array<Person> {
  return Array.from({ length: count }, (_, i) => ({
    firstName: `person-${String(i).padStart(3, '0')}`,
    age: (i * 7) % 40,
    visits: (i * 13) % 100,
    status: STATUSES[i % 3]!,
  }))
}

const columns: any = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'age', header: 'Age', aggregationFn: 'mean' },
  { accessorKey: 'visits', header: 'Visits', aggregationFn: 'sum' },
  { accessorKey: 'status', header: 'Status' },
]

// Columns with an explicit aggregation, mirroring initTableWorker's selection.
const aggregateColumnIds = ['age', 'visits']

function makeTable(data: Array<Person>): Table_Internal<any, Person> {
  return constructTable({
    data,
    columns,
    features: {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
      rowSortingFeature,
      columnFilteringFeature,
      globalFilteringFeature,
      columnGroupingFeature,
      filteredRowModel: createFilteredRowModel(),
      groupedRowModel: createGroupedRowModel(),
      sortedRowModel: createSortedRowModel(),
      sortFns,
      filterFns,
      aggregationFns,
    },
  } as any) as unknown as Table_Internal<any, Person>
}

function coreIndexMap(table: Table_Internal<any, Person>) {
  const map = makeObjectMap<number>()
  const flatRows = table.getCoreRowModel().flatRows
  for (let i = 0; i < flatRows.length; i++) {
    map[flatRows[i]!.id] = i
  }
  return map
}

/** Serialize a stage from the "worker" table, rebuild on the "main" table. */
function roundTrip(
  workerTable: Table_Internal<any, Person>,
  mainTable: Table_Internal<any, Person>,
  model: any,
  resetDepths = true,
) {
  const transfer: Array<Transferable> = []
  const payload = serializeRowModel(
    model,
    coreIndexMap(workerTable),
    aggregateColumnIds,
    transfer,
  )
  expect(payload.kind).not.toBe('unchanged')
  return {
    payload,
    rebuilt: rebuildRowModel(mainTable as any, payload as any, resetDepths),
  }
}

const ids = (rows: Array<any>) => rows.map((row) => row.id)

describe('serializeRowModel -> rebuildRowModel round trip', () => {
  it('round-trips a flat sorted model as a transferable permutation', () => {
    const data = makeData(12)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).sorting.set([{ id: 'age', desc: true }])

    const model = (workerTable as any).getSortedRowModel()
    const { payload, rebuilt } = roundTrip(workerTable, mainTable, model)

    expect(payload.kind).toBe('flat')
    expect(ids(rebuilt.rows)).toEqual(ids(model.rows))
    // rows are the main table's own core rows, not clones
    expect(rebuilt.rows[0]!).toBe(
      mainTable.getCoreRowModel().flatRows[Number(model.rows[0].id)],
    )
    expect(rebuilt.rowsById).toBe(mainTable.getCoreRowModel().rowsById)
  })

  it('round-trips a filtered model', () => {
    const data = makeData(12)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).columnFilters.set([
      { id: 'status', value: 'single' },
    ])

    const model = (workerTable as any).getFilteredRowModel()
    const { payload, rebuilt } = roundTrip(workerTable, mainTable, model)

    expect(payload.kind).toBe('flat')
    expect(model.rows.length).toBeGreaterThan(0)
    expect(model.rows.length).toBeLessThan(data.length)
    expect(ids(rebuilt.rows)).toEqual(ids(model.rows))
  })

  it('round-trips a grouped model as a tree with aggregates', () => {
    const data = makeData(12)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).grouping.set(['status'])

    const model = (workerTable as any).getGroupedRowModel()
    const { payload, rebuilt } = roundTrip(workerTable, mainTable, model)

    expect(payload.kind).toBe('tree')
    expect(ids(rebuilt.rows)).toEqual(ids(model.rows))

    for (let i = 0; i < model.rows.length; i++) {
      const syncGroup = model.rows[i]
      const rebuiltGroup = rebuilt.rows[i]! as any
      expect(rebuiltGroup.groupingColumnId).toBe('status')
      expect(rebuiltGroup.groupingValue).toBe(syncGroup.groupingValue)
      // explicit-aggregate columns match the sync model exactly
      expect(rebuiltGroup.getValue('age')).toBe(syncGroup.getValue('age'))
      expect(rebuiltGroup.getValue('visits')).toBe(syncGroup.getValue('visits'))
      // the group's own column serializes its display value
      expect(rebuiltGroup.getValue('status')).toBe(syncGroup.getValue('status'))
      // non-aggregated columns are undefined (explicit-columns policy)
      expect(rebuiltGroup.getValue('firstName')).toBeUndefined()
      // leaf structure: depth 1, parent set, ids match
      expect(ids(rebuiltGroup.subRows)).toEqual(ids(syncGroup.subRows))
      for (const leaf of rebuiltGroup.subRows) {
        expect(leaf.depth).toBe(1)
        expect(leaf.parentId).toBe(rebuiltGroup.id)
      }
      expect(rebuiltGroup.leafRows.length).toBe(syncGroup.leafRows.length)
      // rowsById resolves both group ids and (via prototype chain) leaf ids
      expect(rebuilt.rowsById[rebuiltGroup.id]).toBe(rebuiltGroup)
      expect(rebuilt.rowsById[rebuiltGroup.subRows[0]!.id]).toBeDefined()
    }
  })

  it('round-trips a sorted model as a tree when grouping is active', () => {
    const data = makeData(12)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).grouping.set(['status'])
    ;(workerTable.baseAtoms as any).sorting.set([{ id: 'age', desc: false }])

    const model = (workerTable as any).getSortedRowModel()
    const { payload, rebuilt } = roundTrip(workerTable, mainTable, model)

    expect(payload.kind).toBe('tree')
    expect(ids(rebuilt.rows)).toEqual(ids(model.rows))
    // leaves within each group are in the worker's sorted order
    for (let i = 0; i < model.rows.length; i++) {
      expect(ids(rebuilt.rows[i]!.subRows)).toEqual(ids(model.rows[i].subRows))
    }
  })

  it('round-trips multi-column grouping (nested tree)', () => {
    const data = makeData(18)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).grouping.set(['status', 'age'])

    const model = (workerTable as any).getGroupedRowModel()
    const { rebuilt } = roundTrip(workerTable, mainTable, model)

    expect(ids(rebuilt.rows)).toEqual(ids(model.rows))
    const firstGroup = rebuilt.rows[0]!
    const firstSubGroup = firstGroup.subRows[0]!
    expect(firstSubGroup.groupingColumnId).toBe('age')
    expect(firstSubGroup.depth).toBe(1)
    const firstLeaf = firstSubGroup.subRows[0]!
    expect(firstLeaf.depth).toBe(2)
    expect(firstLeaf.parentId).toBe(firstSubGroup.id)
  })

  it('does not reset depths when rebuilding a filtered payload (regression)', () => {
    const data = makeData(12)
    const workerTable = makeTable(data)
    const mainTable = makeTable(data)
    ;(workerTable.baseAtoms as any).grouping.set(['status'])

    // Tree rebuild assigns leaf depths on the main table's shared row objects
    const grouped = (workerTable as any).getGroupedRowModel()
    const { rebuilt: rebuiltTree } = roundTrip(workerTable, mainTable, grouped)
    const someLeaf = rebuiltTree.rows[0]!.subRows[0]!
    expect(someLeaf.depth).toBe(1)

    // A filtered (flat) rebuild afterward must not zero those depths
    const filtered = (workerTable as any).getFilteredRowModel()
    roundTrip(workerTable, mainTable, filtered, false)
    expect(someLeaf.depth).toBe(1)

    // ...while a grouped-or-later flat passthrough does reset them
    roundTrip(workerTable, mainTable, filtered, true)
    expect(someLeaf.depth).toBe(0)
  })
})
