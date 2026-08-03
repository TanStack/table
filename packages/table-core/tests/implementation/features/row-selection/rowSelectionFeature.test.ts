import { describe, expect, it, vi } from 'vitest'
import {
  aggregationFns,
  rowAggregationFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  filterFns,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import * as RowSelectionUtils from '../../../../src/features/row-selection/rowSelectionFeature.utils'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import {
  generateTestData,
  getStaticTestData,
} from '../../../fixtures/data/generateTestData'
import type { Person } from '../../../fixtures/data/types'
import type { ColumnDef, Row } from '../../../../src'

const features = testFeatures({
  rowSelectionFeature,
})

function generateColumnDefs(people: Array<Person>) {
  return generateTestColumnDefs<typeof features>(people)
}

describe('rowSelectionFeature', () => {
  describe('selectRowsFn', () => {
    it('should only return rows that are selected', () => {
      const data = generateTestData(5)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0': true,
            '2': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      expect(result.rows.length).toBe(2)
      expect(result.flatRows.length).toBe(2)
      expect(result.rowsById).toHaveProperty('0')
      expect(result.rowsById).toHaveProperty('2')
    })

    it('should recurse into subRows and only return selected subRows', () => {
      const data = generateTestData(3, 2) // assuming 3 parent rows with 2 sub-rows each
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0': true,
            '0.0': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      expect(result.rows[0]?.subRows?.length).toBe(1)
      expect(result.flatRows.length).toBe(2)
      expect(result.rowsById).toHaveProperty('0')
      expect(result.rowsById).toHaveProperty('0.0')
    })

    it('should collect selected descendants of unselected parents', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0': true, // child selected, parent '0' is not
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      expect(result.rows.length).toBe(0)
      expect(result.flatRows.length).toBe(1)
      expect(result.flatRows[0]?.id).toBe('0.0')
      expect(result.rowsById).toHaveProperty('0.0')
    })

    it('should preserve three levels of selected row structure and prototypes', () => {
      const data = generateTestData(1, 1, 1)
      const columns = generateColumnDefs(data)
      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0': true,
            '0.0': true,
            '0.0.0': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)
      const selectedRoot = result.rows[0]!
      const selectedChild = selectedRoot.subRows[0]!
      const selectedGrandchild = selectedChild.subRows[0]!

      expect(result.flatRows.map((row) => row.id)).toEqual([
        '0',
        '0.0',
        '0.0.0',
      ])
      expect(Object.keys(result.rowsById)).toEqual(['0', '0.0', '0.0.0'])
      expect(selectedRoot).not.toBe(rowModel.rows[0])
      expect(selectedChild).not.toBe(rowModel.rows[0]!.subRows[0])
      expect(selectedGrandchild).toBe(rowModel.rows[0]!.subRows[0]!.subRows[0])
      expect(typeof selectedRoot.getValue).toBe('function')
      expect(typeof selectedChild.getValue).toBe('function')
      expect(typeof selectedGrandchild.getValue).toBe('function')
    })

    it('should collect a selected grandchild beneath two unselected ancestors', () => {
      const data = generateTestData(1, 1, 1)
      const columns = generateColumnDefs(data)
      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0.0': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      expect(result.rows).toEqual([])
      expect(result.flatRows.map((row) => row.id)).toEqual(['0.0.0'])
      expect(result.rowsById['0.0.0']).toBe(
        rowModel.rows[0]!.subRows[0]!.subRows[0],
      )
    })

    it('should preserve row prototype methods on cloned parent rows', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0': true,
            '0.0': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      // Selected parents with subRows are cloned; the clone must keep the
      // shared row prototype so APIs like getValue() still work
      const clonedParent = result.rows[0]!
      expect(clonedParent).not.toBe(rowModel.rows[0])
      expect(typeof clonedParent.getValue).toBe('function')
      expect(clonedParent.getValue('id')).toBe(rowModel.rows[0]!.getValue('id'))
    })

    it('should not copy memoized row APIs from the original row to cloned parent rows', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0': true,
            '0.0': true,
          },
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()
      const originalParent = rowModel.rows[0]!

      // Warm a per-row memo on the original. Clones must not copy this closure,
      // because it is bound to originalParent.
      originalParent.getAllCells()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      const clonedParent = result.rows[0]!
      expect(clonedParent).not.toBe(originalParent)
      expect(clonedParent.getAllCells()[0]!.row).toBe(clonedParent)
    })

    it('should return an empty list if no rows are selected', () => {
      const data = generateTestData(5)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {},
        },
        columns,
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelectionUtils.selectRowsFn(rowModel, table)

      expect(result.rows.length).toBe(0)
      expect(result.flatRows.length).toBe(0)
      expect(result.rowsById).toEqual({})
    })
  })
  describe('isRowSelected', () => {
    it('should return true if the row id exists in selection and is set to true', () => {
      const data = generateTestData(3)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: {
            '123': true,
            // '456': false,
          },
        },
        columns,
      })

      const row = { id: '123', data: {}, table } as any

      const result = RowSelectionUtils.isRowSelected(
        row,
        table.atoms.rowSelection?.get() ?? {},
      )
      expect(result).toEqual(true)
    })

    it('should return false if the row id exists in selection and is set to false', () => {
      const data = generateTestData(3)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: {
            '123': true,
            // '456': false,
          },
        },
        columns,
      })

      const row = { id: '456', data: {}, table } as any

      const result = RowSelectionUtils.isRowSelected(
        row,
        table.atoms.rowSelection?.get() ?? {},
      )
      expect(result).toEqual(false)
    })

    it('should return false if the row id does not exist in selection', () => {
      const data = generateTestData(3)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: {
            '123': true,
            // '456': false,
          },
        },
        columns,
      })

      const row = { id: '789', data: {}, table } as any

      const result = RowSelectionUtils.isRowSelected(
        row,
        table.atoms.rowSelection?.get() ?? {},
      )
      expect(result).toEqual(false)
    })

    it('should return false if selection is an empty object', () => {
      const data = generateTestData(3)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {},
        columns,
      })

      const row = { id: '789', data: {}, table } as any

      const result = RowSelectionUtils.isRowSelected(
        row,
        table.atoms.rowSelection?.get() ?? {},
      )
      expect(result).toEqual(false)
    })
  })
  describe('isSubRowSelected', () => {
    it('should return false if there are no sub-rows', () => {
      const data = generateTestData(3)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {},
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual(false)
    })

    it('should return false if no sub-rows are selected', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {},
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual(false)
    })

    it('should return false if no sub-rows are selectable', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: false,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {},
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual(false)
    })

    it('should return some if no children are selectable, but a grand-child is and is selected', () => {
      const data = generateTestData(3, 2, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: (row) => row.id === '0.0.1',
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: { '0.0.1': true },
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual('some')
    })

    it('should return some if some sub-rows are selected', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0': true,
          },
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual('some')
    })

    it('should return all if all sub-rows are selected', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0': true,
            '0.1': true,
          },
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual('all')
    })
    it('should return all if all selectable sub-rows are selected', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: (row: Row<typeof features, Person>) =>
          row.index === 0, // only first row is selectable (of 2 sub-rows)
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0': true, // first sub-row
          },
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual('all')
    })
    it('should return some when some nested sub-rows are selected', () => {
      const data = generateTestData(3, 2, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        getSubRows: (originalRow: Person, _idx: number) => originalRow.subRows,
        initialState: {
          rowSelection: {
            '0.0.0': true, // first nested sub-row
          },
        },
        columns,
      })

      const firstRow = table.getCoreRowModel().rows[0]!

      const result = RowSelectionUtils.isSubRowSelected(firstRow)

      expect(result).toEqual('some')
    })
  })
  describe('toggleAllRowsSelected', () => {
    // `99` is selected but absent from the row model, standing in for a row that
    // is filtered out or otherwise not present in the current pre-grouped model.
    const makeTable = () => {
      const data = generateTestData(5)
      const columns = generateColumnDefs(data)
      return constructTable<typeof features, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: { '0': true, '2': true, '99': true },
        },
        columns,
      })
    }

    it('deselects only in-model ids by default, preserving out-of-model ids', () => {
      const table = makeTable()
      table.toggleAllRowsSelected(false)
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual(['99'])
    })

    it('clears the entire selection when opts.deselectAll is true', () => {
      const table = makeTable()
      table.toggleAllRowsSelected(false, { deselectAll: true })
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual([])
    })

    it('does not clear selection when deselectAll is paired with a select', () => {
      const table = makeTable()
      // deselectAll only applies when the resolved value is a deselect
      table.toggleAllRowsSelected(true, { deselectAll: true })
      expect(table.atoms.rowSelection.get()['99']).toBe(true)
    })

    it('toggles top-level rows only when enableSubRowSelection is false', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)
      const table = constructTable<typeof features, Person>({
        features,
        enableSubRowSelection: false,
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        columns,
      })

      table.toggleAllRowsSelected()
      expect(Object.keys(table.atoms.rowSelection.get()).sort()).toEqual([
        '0',
        '1',
        '2',
      ])
      expect(table.getIsAllRowsSelected()).toBe(true)

      // The second no-value call must resolve to a deselect, proving the
      // header toggle no longer sticks when sub-rows are skipped
      table.toggleAllRowsSelected()
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual([])
    })

    it('keeps rows that cannot be selected when deselecting all', () => {
      const data = generateTestData(5)
      const columns = generateColumnDefs(data)
      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection: (row) => row.id !== '0',
        renderFallbackValue: '',
        data,
        initialState: { rowSelection: { '0': true, '1': true } },
        columns,
      })

      table.toggleAllRowsSelected(false)
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual(['0'])

      table.toggleAllRowsSelected(false, { deselectAll: true })
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual([])
    })
  })

  describe('deselectParents', () => {
    it('prunes stale parent ids through a select-parent-then-deselect-children sequence', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)
      const table = constructTable<typeof features, Person>({
        features,
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        columns,
      })
      const parent = table.getRow('0')

      parent.toggleSelected(true)
      expect(Object.keys(table.atoms.rowSelection.get()).sort()).toEqual([
        '0',
        '0.0',
        '0.1',
      ])

      table.getRow('0.0').toggleSelected(false, { deselectParents: true })
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual(['0.1'])
      expect(parent.getIsSelected()).toBe(false)
      expect(parent.getIsSomeSelected()).toBe(true)

      table.getRow('0.1').toggleSelected(false, { deselectParents: true })
      expect(Object.keys(table.atoms.rowSelection.get())).toEqual([])
      expect(parent.getIsSomeSelected()).toBe(false)
    })
  })
  describe('memoization', () => {
    // The `enableRowSelection` predicate is invoked by `row_getCanSelect` for
    // rows the scan actually has to evaluate, so its call count is a proxy for
    // how many times the selection getters walk the row model. Selected rows
    // skip the predicate entirely via the `isRowSelected` short-circuit, so
    // the probe uses a partial selection that forces the scan to reach an
    // unselected row.
    it('memoizes getIsAllRowsSelected until selection or row model changes', () => {
      const data = generateTestData(10)
      const columns = generateColumnDefs(data)
      const enableRowSelection = vi.fn(() => true)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: Object.fromEntries(
            data.slice(0, 9).map((_, index) => [String(index), true]),
          ),
        },
        columns,
      })

      expect(table.getIsAllRowsSelected()).toBe(false)
      const callsAfterFirst = enableRowSelection.mock.calls.length
      expect(callsAfterFirst).toBeGreaterThan(0)

      // Repeated calls with unchanged deps must not re-walk the row model
      table.getIsAllRowsSelected()
      table.getIsAllRowsSelected()
      expect(enableRowSelection.mock.calls.length).toBe(callsAfterFirst)

      // Changing the selection invalidates the memo and recomputes
      table.setRowSelection({ '0': true })
      expect(table.getIsAllRowsSelected()).toBe(false)
      expect(enableRowSelection.mock.calls.length).toBeGreaterThan(
        callsAfterFirst,
      )
    })

    it('skips the enableRowSelection predicate for already-selected rows', () => {
      const data = generateTestData(10)
      const columns = generateColumnDefs(data)
      const enableRowSelection = vi.fn(() => true)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: Object.fromEntries(
            data.map((_, index) => [String(index), true]),
          ),
        },
        columns,
      })

      // Every row is selected, so the all-selected scan never needs to ask
      // whether a row is selectable
      expect(table.getIsAllRowsSelected()).toBe(true)
      expect(enableRowSelection).not.toHaveBeenCalled()
    })

    it('recomputes getIsAllRowsSelected when enableSubRowSelection changes', () => {
      const data = generateTestData(3, 2)
      const columns = generateColumnDefs(data)

      const table = constructTable<typeof features, Person>({
        features,
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        initialState: {
          rowSelection: { '0': true, '1': true, '2': true },
        },
        columns,
      })

      // Sub-rows are unselected, so all-selected is false by default
      expect(table.getIsAllRowsSelected()).toBe(false)

      table.setOptions((prev) => ({ ...prev, enableSubRowSelection: false }))

      // The option is a memo dep, so the getter must recompute
      expect(table.getIsAllRowsSelected()).toBe(true)
    })

    it('memoizes getIsSomePageRowsSelected until selection changes', () => {
      const data = generateTestData(10)
      const columns = generateColumnDefs(data)
      const enableRowSelection = vi.fn(() => true)

      const table = constructTable<typeof features, Person>({
        features,
        enableRowSelection,
        renderFallbackValue: '',
        data,
        initialState: {
          rowSelection: { '0': true },
        },
        columns,
      })

      expect(table.getIsSomePageRowsSelected()).toBe(true)
      const callsAfterFirst = enableRowSelection.mock.calls.length

      table.getIsSomePageRowsSelected()
      table.getIsSomePageRowsSelected()
      expect(enableRowSelection.mock.calls.length).toBe(callsAfterFirst)

      table.setRowSelection({})
      expect(table.getIsSomePageRowsSelected()).toBe(false)
      expect(enableRowSelection.mock.calls.length).toBeGreaterThan(
        callsAfterFirst,
      )
    })
  })

  describe('selected row models source the correct pipeline models', () => {
    // Full pipeline: filtered -> grouped -> sorted, matching v8's sourcing of
    // getFilteredSelectedRowModel (filtered) and getGroupedSelectedRowModel (sorted).
    const pipelineFeatures = testFeatures({
      rowAggregationFeature,
      aggregationFns,
      columnFilteringFeature,
      columnGroupingFeature,
      filterFns,
      filteredRowModel: createFilteredRowModel(),
      groupedRowModel: createGroupedRowModel(),
      rowSelectionFeature,
      rowSortingFeature,
      sortFns,
      sortedRowModel: createSortedRowModel(),
    })

    // Static data: row ids default to index — '0' relationship, '1' complicated, '2' single
    const pipelineColumns: Array<
      ColumnDef<typeof pipelineFeatures, Person, any>
    > = [
      { accessorKey: 'firstName', id: 'firstName' },
      { accessorKey: 'status', filterFn: 'equalsString', id: 'status' },
    ]

    function makePipelineTable(
      initialState: Record<string, unknown>,
      features = pipelineFeatures,
    ) {
      return constructTable<typeof pipelineFeatures, Person>({
        features,
        enableRowSelection: true,
        renderFallbackValue: '',
        data: getStaticTestData(),
        columns: pipelineColumns,
        initialState,
      })
    }

    it('getFilteredSelectedRowModel excludes selected rows that are filtered out', () => {
      const table = makePipelineTable({
        columnFilters: [{ id: 'status', value: 'single' }],
        rowSelection: { '0': true, '2': true },
      })

      // Row '0' (relationship) fails the filter; row '2' (single) passes
      const filteredSelected = table.getFilteredSelectedRowModel()
      expect(filteredSelected.rows.map((row) => row.id)).toEqual(['2'])
      expect(filteredSelected.flatRows.length).toBe(1)
      expect(filteredSelected.rowsById).toHaveProperty('2')
      expect(filteredSelected.rowsById).not.toHaveProperty('0')

      // Sanity: the plain selected model stays core-sourced and keeps both rows
      expect(table.getSelectedRowModel().flatRows.length).toBe(2)
    })

    it('getGroupedSelectedRowModel returns a selected group row', () => {
      const table = makePipelineTable({
        grouping: ['status'],
        rowSelection: { 'status:single': true },
      })

      const groupedSelected = table.getGroupedSelectedRowModel()
      expect(groupedSelected.rows.length).toBe(1)
      expect(groupedSelected.rows[0]!.id).toBe('status:single')
      // The group's only leaf ('2') is unselected, so it is not collected
      expect(groupedSelected.flatRows.map((row) => row.id)).toEqual([
        'status:single',
      ])
    })

    it('getGroupedSelectedRowModel collects a selected leaf under an unselected group', () => {
      const table = makePipelineTable({
        grouping: ['status'],
        rowSelection: { '2': true },
      })

      const groupedSelected = table.getGroupedSelectedRowModel()
      // No top-level group row is selected...
      expect(groupedSelected.rows).toEqual([])
      // ...but the selected leaf is still collected from the grouped tree
      expect(groupedSelected.flatRows.map((row) => row.id)).toEqual(['2'])
    })

    it('getGroupedSelectedRowModel falls back through the row-model chain when sorting is not registered', () => {
      const {
        rowSortingFeature: _sorting,
        sortFns: _sortFns,
        sortedRowModel: _sorted,
        ...rest
      } = pipelineFeatures
      const table = makePipelineTable(
        {
          grouping: ['status'],
          rowSelection: { 'status:single': true },
        },
        rest as typeof pipelineFeatures,
      )

      const groupedSelected = table.getGroupedSelectedRowModel()
      expect(groupedSelected.rows.length).toBe(1)
      expect(groupedSelected.rows[0]!.id).toBe('status:single')
    })
  })
})
