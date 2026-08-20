import { describe, expect, it } from 'vitest'
import {
  constructTable,
  createColumnHelper,
  createExpandedRowModel,
  createPaginatedRowModel,
  rowExpandingFeature,
  rowPaginationFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  subRows?: Array<Person>
}

// rowExpandingFeature is registered so that its getDefaultTableOptions
// injects the paginateExpandedRows: true default used by the paginated model.
const features = testFeatures({
  rowExpandingFeature,
  rowPaginationFeature,
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

function makeFlatData(count: number): Array<Person> {
  return Array.from({ length: count }, (_, i) => ({
    firstName: `person-${i}`,
  }))
}

// 3 parents, each with 2 children
function makeNestedData(): Array<Person> {
  return [0, 1, 2].map((i) => ({
    firstName: `parent-${i}`,
    subRows: [0, 1].map((j) => ({ firstName: `child-${i}.${j}` })),
  }))
}

function createTable(options?: {
  data?: Array<Person>
  pageIndex?: number
  pageSize?: number
  paginateExpandedRows?: boolean
  manualPagination?: boolean
}) {
  const columnHelper = createColumnHelper<typeof features, Person>()
  const columns: Array<ColumnDef<typeof features, Person, any>> = [
    columnHelper.accessor('firstName', { id: 'firstName' }),
  ]

  return constructTable<typeof features, Person>({
    features,
    data: options?.data ?? makeFlatData(5),
    columns,
    getSubRows: (row) => row.subRows,
    // Only pass options when defined so an explicit `undefined` does not
    // override the paginateExpandedRows: true default injected by
    // rowExpandingFeature's getDefaultTableOptions
    ...(options?.paginateExpandedRows !== undefined
      ? { paginateExpandedRows: options.paginateExpandedRows }
      : {}),
    ...(options?.manualPagination !== undefined
      ? { manualPagination: options.manualPagination }
      : {}),
    initialState: {
      pagination: {
        pageIndex: options?.pageIndex ?? 0,
        pageSize: options?.pageSize ?? 2,
      },
    },
  })
}

describe('createPaginatedRowModel', () => {
  describe('slice math', () => {
    it('should return the first page for pageIndex 0', () => {
      const table = createTable({ pageSize: 2, pageIndex: 0 })

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
      ])
    })

    it('should return a last partial page', () => {
      const table = createTable({ pageSize: 2, pageIndex: 2 })

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '4',
      ])
    })

    it('should return full pages at an exact page boundary (rows % pageSize === 0)', () => {
      const table = createTable({
        data: makeFlatData(4),
        pageSize: 2,
        pageIndex: 1,
      })

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '2',
        '3',
      ])
    })

    it('should return no rows for an out-of-range pageIndex', () => {
      const table = createTable({ pageSize: 2, pageIndex: 5 })

      expect(table.getPaginatedRowModel().rows).toEqual([])
    })

    it('should return all rows when pageSize is larger than the dataset', () => {
      const table = createTable({ pageSize: 10, pageIndex: 0 })

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
        '3',
        '4',
      ])
    })

    it('should return all rows when pageSize is Infinity', () => {
      const table = createTable({ pageSize: Infinity, pageIndex: 0 })

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
        '3',
        '4',
      ])
    })
  })

  describe('empty pre-paginated model', () => {
    it('should return the pre-model identity when there is no data', () => {
      const table = createTable({ data: [] })

      expect(table.getPaginatedRowModel()).toBe(table.getPrePaginatedRowModel())
      expect(table.getPaginatedRowModel().rows).toEqual([])
    })
  })

  describe('paginateExpandedRows: true (default)', () => {
    it('should let expanded children consume page slots and spill across page boundaries', () => {
      const table = createTable({ data: makeNestedData(), pageSize: 3 })

      table.getRow('0').toggleExpanded()

      // Pre-paginated expanded order: 0, 0.0, 0.1, 1, 2
      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
      ])

      table.setPageIndex(1)

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '1',
        '2',
      ])
    })
  })

  describe('paginateExpandedRows: false', () => {
    it('should slice unexpanded rows then append expanded children without consuming page slots', () => {
      const table = createTable({
        data: makeNestedData(),
        pageSize: 2,
        paginateExpandedRows: false,
      })

      table.getRow('0').toggleExpanded()
      table.getRow('1').toggleExpanded()

      // Page 0 slice from the unexpanded rows is ['0', '1']; both parents are
      // expanded, so their children are inserted inline without shrinking the
      // number of parents on the page.
      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
        '1',
        '1.0',
        '1.1',
      ])

      table.setPageIndex(1)

      // Page 1 slice from unexpanded rows is ['2'], which is collapsed
      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '2',
      ])
    })

    it('should append expanded children when pageSize is Infinity', () => {
      const table = createTable({
        data: makeNestedData(),
        pageSize: Infinity,
        paginateExpandedRows: false,
      })

      table.getRow('0').toggleExpanded()

      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
        '1',
        '2',
      ])
    })
  })

  describe('flatRows rebuild', () => {
    it('should rebuild flatRows from the page rows including all subRows regardless of expanded state', () => {
      const table = createTable({ data: makeNestedData(), pageSize: 2 })

      // Nothing is expanded, yet flatRows includes the subRows of every row
      // on the page. Pinned current behavior: _createPaginatedRowModel
      // discards the pre-model flatRows and rebuilds them by walking every
      // subRow of the page rows (createPaginatedRowModel.ts lines ~71-80).
      expect(
        table.getPaginatedRowModel().flatRows.map((row) => row.id),
      ).toEqual(['0', '0.0', '0.1', '1', '1.0', '1.1'])
    })

    it('should not duplicate expanded sub-rows in flatRows (default paginateExpandedRows)', () => {
      const table = createTable({ data: makeNestedData(), pageSize: 3 })

      table.getRow('0').toggleExpanded()

      // The page slice is ['0', '0.0', '0.1']; the sub-rows appear both
      // inline and under their parent's subRows, but flatRows must list each
      // row exactly once
      expect(
        table.getPaginatedRowModel().flatRows.map((row) => row.id),
      ).toEqual(['0', '0.0', '0.1'])
    })

    it('should not duplicate expanded sub-rows in flatRows with paginateExpandedRows: false', () => {
      const table = createTable({
        data: makeNestedData(),
        pageSize: 2,
        paginateExpandedRows: false,
      })

      table.getRow('0').toggleExpanded()

      // Page rows are ['0', '0.0', '0.1', '1']; collapsed sub-rows of '1'
      // still join flatRows once via the subRows walk
      expect(
        table.getPaginatedRowModel().flatRows.map((row) => row.id),
      ).toEqual(['0', '0.0', '0.1', '1', '1.0', '1.1'])
    })
  })

  describe('rowsById passthrough', () => {
    it('should pass through the whole pre-model rowsById map, not just the page', () => {
      const table = createTable({ data: makeNestedData(), pageSize: 2 })

      const preModel = table.getPrePaginatedRowModel()
      const paginatedModel = table.getPaginatedRowModel()

      // Pinned current behavior: rowsById is the pre-pagination map passed
      // through by reference, so it contains rows that are not on the page.
      expect(paginatedModel.rowsById).toBe(preModel.rowsById)
      expect(paginatedModel.rowsById['2']).toBeDefined()
    })
  })

  describe('manualPagination', () => {
    it('should return the pre-model identity when manualPagination is true', () => {
      const table = createTable({
        pageSize: 2,
        pageIndex: 1,
        manualPagination: true,
      })

      expect(table.getPaginatedRowModel()).toBe(table.getPrePaginatedRowModel())
      expect(table.getPaginatedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
        '2',
        '3',
        '4',
      ])
    })

    it('should include expanded children when expanded rows bypass manual pagination', () => {
      const table = createTable({
        data: makeNestedData(),
        manualPagination: true,
        paginateExpandedRows: false,
      })

      table.getRow('0').toggleExpanded()

      expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
        '1',
        '2',
      ])
    })
  })
})
