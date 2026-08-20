import { describe, expect, it } from 'vitest'
import {
  constructTable,
  createColumnHelper,
  createExpandedRowModel,
  rowExpandingFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Row } from '../../../../src'

type Person = {
  firstName: string
  subRows?: Array<Person>
}

const features = testFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

// 3-level deterministic data: 2 roots x 2 children x 2 grandchildren
function makeNestedData(): Array<Person> {
  return [0, 1].map((i) => ({
    firstName: `parent-${i}`,
    subRows: [0, 1].map((j) => ({
      firstName: `child-${i}.${j}`,
      subRows: [0, 1].map((k) => ({
        firstName: `grandchild-${i}.${j}.${k}`,
      })),
    })),
  }))
}

function createTable(options?: {
  data?: Array<Person>
  paginateExpandedRows?: boolean
  manualExpanding?: boolean
  getIsRowExpanded?: (row: Row<typeof features, Person>) => boolean
}) {
  const columnHelper = createColumnHelper<typeof features, Person>()
  const columns: Array<ColumnDef<typeof features, Person, any>> = [
    columnHelper.accessor('firstName', { id: 'firstName' }),
  ]

  return constructTable<typeof features, Person>({
    features,
    data: options?.data ?? makeNestedData(),
    columns,
    getSubRows: (row) => row.subRows,
    // Only pass options when defined so an explicit `undefined` does not
    // override the paginateExpandedRows: true default injected by
    // rowExpandingFeature's getDefaultTableOptions
    ...(options?.paginateExpandedRows !== undefined
      ? { paginateExpandedRows: options.paginateExpandedRows }
      : {}),
    ...(options?.manualExpanding !== undefined
      ? { manualExpanding: options.manualExpanding }
      : {}),
    ...(options?.getIsRowExpanded
      ? { getIsRowExpanded: options.getIsRowExpanded }
      : {}),
  })
}

describe('createExpandedRowModel', () => {
  describe('expand all', () => {
    it('should include every subRow in depth-first display order when all rows are expanded', () => {
      const table = createTable()

      table.toggleAllRowsExpanded(true)

      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.0.0',
        '0.0.1',
        '0.1',
        '0.1.0',
        '0.1.1',
        '1',
        '1.0',
        '1.0.0',
        '1.0.1',
        '1.1',
        '1.1.0',
        '1.1.1',
      ])
    })
  })

  describe('per-id expansion', () => {
    it('should surface only direct children when a single root is expanded', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()

      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
        '1',
      ])
    })

    it('should surface grandchildren when both the root and its child are expanded', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()
      table.getRow('0.0').toggleExpanded()

      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.0.0',
        '0.0.1',
        '0.1',
        '1',
      ])
    })

    it('should not surface an expanded child while its parent is collapsed', () => {
      const table = createTable()

      // Expand '0.0' only; parent '0' stays collapsed
      table.getRow('0.0').toggleExpanded()

      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
      ])
    })
  })

  describe('options.getIsRowExpanded', () => {
    it('should drive the model output via the getIsRowExpanded option override', () => {
      // Expanded state marks '1' expanded, but the option override says only
      // '0' is expanded. The model must follow the override, not the state.
      const table = createTable({
        getIsRowExpanded: (row) => row.id === '0',
      })

      table.getRow('1').toggleExpanded()

      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.1',
        '1',
      ])
    })
  })

  describe('flatRows and rowsById passthrough', () => {
    it('should pass through the pre-expansion flatRows and rowsById unchanged', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()

      const preModel = table.getPreExpandedRowModel()
      const expandedModel = table.getExpandedRowModel()

      // Pinned current behavior: expandRows only rebuilds `rows`; `flatRows`
      // and `rowsById` are the pre-expansion full lists passed through by
      // reference (createExpandedRowModel.ts lines ~79-80).
      expect(expandedModel.flatRows).toBe(preModel.flatRows)
      expect(expandedModel.rowsById).toBe(preModel.rowsById)
      expect(expandedModel.flatRows.length).toBe(14) // all 14 rows, not just visible ones
    })
  })

  describe('empty state early returns', () => {
    it('should return the pre-model identity when nothing is expanded', () => {
      const table = createTable()

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
    })

    it('should return the pre-model identity when there is no data', () => {
      const table = createTable({ data: [] })

      table.setExpanded(true)

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
      expect(table.getExpandedRowModel().rows).toEqual([])
    })
  })

  describe('paginateExpandedRows: false', () => {
    it('should return the pre-model identity even with rows expanded', () => {
      // Documented contract: when paginateExpandedRows is false, expansion is
      // deferred to the paginated row model so expanded children do not
      // consume page slots. The expanded model is a passthrough.
      const table = createTable({ paginateExpandedRows: false })

      table.getRow('0').toggleExpanded()

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
      ])
    })
  })

  describe('manualExpanding', () => {
    it('should return the pre-model identity when manualExpanding is true', () => {
      const table = createTable({ manualExpanding: true })

      table.getRow('0').toggleExpanded()

      expect(table.getExpandedRowModel()).toBe(table.getPreExpandedRowModel())
      expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
        '0',
        '1',
      ])
    })
  })

  describe('memoization', () => {
    it('should return the same reference on repeated calls', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()

      const first = table.getExpandedRowModel()
      expect(table.getExpandedRowModel()).toBe(first)
      expect(table.getExpandedRowModel()).toBe(first)
    })

    it('should produce a new model when expanded state changes', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()
      const first = table.getExpandedRowModel()

      table.setExpanded({ '0': true, '0.0': true })
      const second = table.getExpandedRowModel()

      expect(second).not.toBe(first)
      expect(second.rows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.0.0',
        '0.0.1',
        '0.1',
        '1',
      ])
    })

    it('should not recompute when unrelated getters are called in between', () => {
      const table = createTable()

      table.getRow('0').toggleExpanded()
      const first = table.getExpandedRowModel()

      // Unrelated calls should not invalidate the memo
      table.getPreExpandedRowModel()
      table.getRowModel()
      table.getRow('1').getIsExpanded()

      expect(table.getExpandedRowModel()).toBe(first)
    })
  })
})
