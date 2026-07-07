import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Person } from '../../../fixtures/data/types'

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
    const coreRowModelFactory = vi.fn((table: any) => () => ({
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
