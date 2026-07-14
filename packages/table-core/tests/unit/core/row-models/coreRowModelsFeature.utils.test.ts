import { describe, expect, it, vi } from 'vitest'
import {
  aggregationFeature,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { ColumnDef } from '../../../../src'

const coreOnlyFeatures = testFeatures({})

const pipelineFeatures = testFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

function makeCoreOnlyTable() {
  const data = generateTestData(3)
  return constructTable({
    features: coreOnlyFeatures,
    data,
    columns: generateTestColumnDefs<typeof coreOnlyFeatures>(data),
  })
}

describe('row model fallback chains', () => {
  it('should fall through every stage to the core row model when no factories are registered', () => {
    const table = makeCoreOnlyTable()
    const coreRowModel = table.getCoreRowModel()

    expect(coreRowModel.rows.map((row) => row._displayIndexCache)).toEqual([
      -1, -1, -1,
    ])
    expect(table.getRowsInDisplayOrder()).toBe(coreRowModel.rows)
    expect(coreRowModel.rows.map((row) => row.getDisplayIndex())).toEqual([
      0, 1, 2,
    ])

    expect(table.getPreFilteredRowModel()).toBe(coreRowModel)
    expect(table.getFilteredRowModel()).toBe(coreRowModel)
    expect(table.getPreGroupedRowModel()).toBe(coreRowModel)
    expect(table.getGroupedRowModel()).toBe(coreRowModel)
    expect(table.getPreSortedRowModel()).toBe(coreRowModel)
    expect(table.getSortedRowModel()).toBe(coreRowModel)
    expect(table.getPreExpandedRowModel()).toBe(coreRowModel)
    expect(table.getExpandedRowModel()).toBe(coreRowModel)
    expect(table.getPrePaginatedRowModel()).toBe(coreRowModel)
    expect(table.getPaginatedRowModel()).toBe(coreRowModel)
    expect(table.getRowModel()).toBe(coreRowModel)
  })

  it('should cache the core row model factory across calls', () => {
    const coreRowModelFactory = vi.fn((_table: any) => () => ({
      rows: [],
      flatRows: [],
      rowsById: {},
    }))
    const features = testFeatures({ coreRowModel: coreRowModelFactory })
    const data = generateTestData(3)
    const table = constructTable({
      features,
      data,
      columns: generateTestColumnDefs<typeof features>(data),
    })

    table.getCoreRowModel()
    table.getCoreRowModel()
    table.getRowModel()

    expect(coreRowModelFactory).toHaveBeenCalledTimes(1)
  })
})

describe('manual processing options', () => {
  function makePipelineTable(options?: {
    manualFiltering?: boolean
    manualSorting?: boolean
  }) {
    const data = generateTestData(5)
    return constructTable({
      features: pipelineFeatures,
      data,
      columns: generateTestColumnDefs<typeof pipelineFeatures>(data),
      initialState: {
        columnFilters: [{ id: 'firstName', value: 'zzz-no-match' }],
        sorting: [{ id: 'firstName', desc: false }],
      },
      ...options,
    })
  }

  it('manualFiltering should bypass a registered filtered row model', () => {
    const table = makePipelineTable({ manualFiltering: true })

    expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
    expect(table.getFilteredRowModel().rows).toHaveLength(5)
  })

  it('manualSorting should bypass a registered sorted row model', () => {
    const table = makePipelineTable({
      manualFiltering: true,
      manualSorting: true,
    })

    expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())
  })

  it('registered factories should apply when manual options are off', () => {
    const table = makePipelineTable()

    expect(table.getFilteredRowModel().rows).toHaveLength(0)
    expect(table.getFilteredRowModel()).not.toBe(table.getPreFilteredRowModel())
  })
})

describe('manual option matrix (all six pipeline stages)', () => {
  type Item = {
    name: string
    status: string
    subRows?: Array<Item>
  }

  const matrixFeatures = testFeatures({
    aggregationFeature,
    columnFilteringFeature,
    columnGroupingFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    groupedRowModel: createGroupedRowModel(),
    sortedRowModel: createSortedRowModel(),
    expandedRowModel: createExpandedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    aggregationFns,
    filterFns,
    sortFns,
  })

  const matrixColumns: Array<ColumnDef<typeof matrixFeatures, Item, any>> = [
    { accessorKey: 'name', id: 'name' },
    { accessorKey: 'status', id: 'status' },
  ]

  // 5 root rows, one with a nested child. Row '4' is removed by the filter.
  function makeMatrixData(): Array<Item> {
    return [
      { name: 'echo', status: 'group-a' },
      { name: 'alpha', status: 'group-b' },
      { name: 'delta', status: 'group-a' },
      {
        name: 'bravo',
        status: 'group-b',
        subRows: [{ name: 'bravo-child', status: 'group-b' }],
      },
      { name: 'charlie', status: 'excluded' },
    ]
  }

  type ManualOptions = {
    manualFiltering?: boolean
    manualGrouping?: boolean
    manualSorting?: boolean
    manualExpanding?: boolean
    manualPagination?: boolean
  }

  // Every stage has active state so each stage would transform the rows
  // whenever it is not bypassed
  function makeMatrixTable(options?: ManualOptions) {
    return constructTable<typeof matrixFeatures, Item>({
      features: matrixFeatures,
      data: makeMatrixData(),
      columns: matrixColumns,
      getSubRows: (row) => row.subRows,
      initialState: {
        columnFilters: [{ id: 'status', value: 'group' }],
        grouping: ['status'],
        sorting: [{ id: 'name', desc: false }],
        expanded: true,
        pagination: { pageIndex: 0, pageSize: 2 },
      },
      ...options,
    })
  }

  describe('one manual option at a time', () => {
    it('manualFiltering should bypass filtering while grouping still groups the unfiltered rows', () => {
      const table = makeMatrixTable({ manualFiltering: true })

      expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
      expect(table.getFilteredRowModel().rows).toHaveLength(5)

      // Downstream grouping runs on the bypassed (unfiltered) model, so the
      // 'excluded' status still forms a group
      const groupedIds = table.getGroupedRowModel().rows.map((row) => row.id)
      expect(groupedIds).toEqual([
        'status:group-a',
        'status:group-b',
        'status:excluded',
      ])
    })

    it('manualGrouping should bypass grouping while sorting still sorts the filtered leaf rows', () => {
      const table = makeMatrixTable({ manualGrouping: true })

      expect(table.getGroupedRowModel()).toBe(table.getPreGroupedRowModel())
      expect(table.getGroupedRowModel()).toBe(table.getFilteredRowModel())

      // Downstream sorting runs directly on the filtered flat rows
      expect(
        table.getSortedRowModel().rows.map((row) => row.original.name),
      ).toEqual(['alpha', 'bravo', 'delta', 'echo'])
    })

    it('manualSorting should bypass sorting while expanding still flattens the grouped rows', () => {
      const table = makeMatrixTable({ manualSorting: true })

      expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())
      expect(table.getSortedRowModel()).toBe(table.getGroupedRowModel())

      // Downstream expanding runs on the unsorted grouped model: groups stay
      // in insertion order and leaves stay in original data order
      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        'status:group-a',
        '0',
        '2',
        'status:group-b',
        '1',
        '3',
        '3.0',
      ])
    })

    it('manualExpanding should bypass expanding while pagination still slices the unexpanded rows', () => {
      const table = makeMatrixTable({ manualExpanding: true })

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
      expect(table.getExpandedRowModel()).toBe(table.getSortedRowModel())

      // Downstream pagination sees only the 2 unexpanded group rows, no leaves
      const pageRows = table.getPaginatedRowModel().rows
      expect(pageRows).toHaveLength(2)
      expect(pageRows.every((row) => row.id.startsWith('status:'))).toBe(true)
    })

    it('manualPagination should bypass pagination so the final row model keeps every expanded row', () => {
      const table = makeMatrixTable({ manualPagination: true })

      expect(table.getPaginatedRowModel()).toBe(table.getPrePaginatedRowModel())
      expect(table.getRowModel()).toBe(table.getExpandedRowModel())

      // pageSize is 2 but all 7 expanded rows (2 groups + 4 leaves + 1 child)
      // survive because pagination is bypassed
      expect(table.getRowModel().rows).toHaveLength(7)
    })
  })

  describe('all manual options at once', () => {
    it('should make the final row model identity-equal to the core row model', () => {
      const table = makeMatrixTable({
        manualFiltering: true,
        manualGrouping: true,
        manualSorting: true,
        manualExpanding: true,
        manualPagination: true,
      })

      expect(table.getRowModel()).toBe(table.getCoreRowModel())
      expect(table.getFilteredRowModel()).toBe(table.getCoreRowModel())
      expect(table.getGroupedRowModel()).toBe(table.getCoreRowModel())
      expect(table.getSortedRowModel()).toBe(table.getCoreRowModel())
      expect(table.getExpandedRowModel()).toBe(table.getCoreRowModel())
      expect(table.getPaginatedRowModel()).toBe(table.getCoreRowModel())
      expect(table.getRowModel().rows).toHaveLength(5)
    })
  })

  describe('instantiate-then-bypass ordering', () => {
    it('should instantiate a registered factory even when its manual option bypasses the result', () => {
      const stubModel = { rows: [], flatRows: [], rowsById: {} }
      const rowModelFn = vi.fn(() => stubModel)
      const filteredRowModelFactory = vi.fn((_table: any) => rowModelFn)
      const features = testFeatures({
        columnFilteringFeature,
        filteredRowModel: filteredRowModelFactory,
        filterFns,
      })
      const data = generateTestData(3)
      const table = constructTable({
        features,
        data,
        columns: generateTestColumnDefs<typeof features>(data),
        manualFiltering: true,
        initialState: {
          columnFilters: [{ id: 'firstName', value: 'zzz-no-match' }],
        },
      })

      // The getter instantiates and caches the factory BEFORE checking the
      // manual option, so the factory runs even though its output is unused
      expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
      table.getFilteredRowModel()

      expect(filteredRowModelFactory).toHaveBeenCalledTimes(1)
      // ...but the returned row-model fn itself is never invoked while manual
      expect(rowModelFn).not.toHaveBeenCalled()

      // Because the factory was already instantiated, toggling manual off at
      // runtime immediately applies the registered stage
      table.setOptions((prev) => ({ ...prev, manualFiltering: false }))

      expect(table.getFilteredRowModel()).toBe(stubModel)
      expect(rowModelFn).toHaveBeenCalledTimes(1)
      expect(filteredRowModelFactory).toHaveBeenCalledTimes(1)
    })
  })

  describe('runtime toggling via setOptions', () => {
    it('manualFiltering toggle should switch between identity and applied filtering', () => {
      const table = makeMatrixTable({ manualFiltering: true })

      expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
      expect(table.getFilteredRowModel().rows).toHaveLength(5)

      table.setOptions((prev) => ({ ...prev, manualFiltering: false }))

      expect(table.getFilteredRowModel()).not.toBe(
        table.getPreFilteredRowModel(),
      )
      expect(table.getFilteredRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
        '3',
      ])

      table.setOptions((prev) => ({ ...prev, manualFiltering: true }))

      expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
    })

    it('manualGrouping toggle should switch between identity and applied grouping', () => {
      const table = makeMatrixTable({ manualGrouping: true })

      expect(table.getGroupedRowModel()).toBe(table.getPreGroupedRowModel())

      table.setOptions((prev) => ({ ...prev, manualGrouping: false }))

      expect(table.getGroupedRowModel()).not.toBe(table.getPreGroupedRowModel())
      expect(table.getGroupedRowModel().rows.map((row) => row.id)).toEqual([
        'status:group-a',
        'status:group-b',
      ])

      table.setOptions((prev) => ({ ...prev, manualGrouping: true }))

      expect(table.getGroupedRowModel()).toBe(table.getPreGroupedRowModel())
    })

    it('manualSorting toggle should switch between identity and applied sorting', () => {
      // Deeper sorting toggle behavior is covered in the row-sorting
      // implementation tests; this is just the matrix identity check
      const table = makeMatrixTable({
        manualGrouping: true,
        manualSorting: true,
      })

      expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())

      table.setOptions((prev) => ({ ...prev, manualSorting: false }))

      expect(table.getSortedRowModel()).not.toBe(table.getPreSortedRowModel())
      expect(
        table.getSortedRowModel().rows.map((row) => row.original.name),
      ).toEqual(['alpha', 'bravo', 'delta', 'echo'])

      table.setOptions((prev) => ({ ...prev, manualSorting: true }))

      expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())
    })

    it('manualExpanding toggle should switch between identity and applied expanding', () => {
      const table = makeMatrixTable({ manualExpanding: true })

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
      expect(table.getExpandedRowModel().rows).toHaveLength(2)

      table.setOptions((prev) => ({ ...prev, manualExpanding: false }))

      expect(table.getExpandedRowModel()).not.toBe(
        table.getPreExpandedRowModel(),
      )
      // 2 group rows + 4 leaves + 1 nested child
      expect(table.getExpandedRowModel().rows).toHaveLength(7)

      table.setOptions((prev) => ({ ...prev, manualExpanding: true }))

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
    })

    it('manualPagination toggle should switch between identity and applied pagination', () => {
      const table = makeMatrixTable({ manualPagination: true })

      expect(table.getPaginatedRowModel()).toBe(table.getPrePaginatedRowModel())
      expect(table.getPaginatedRowModel().rows).toHaveLength(7)

      table.setOptions((prev) => ({ ...prev, manualPagination: false }))

      expect(table.getPaginatedRowModel()).not.toBe(
        table.getPrePaginatedRowModel(),
      )
      expect(table.getPaginatedRowModel().rows).toHaveLength(2)

      table.setOptions((prev) => ({ ...prev, manualPagination: true }))

      expect(table.getPaginatedRowModel()).toBe(table.getPrePaginatedRowModel())
    })
  })
})
