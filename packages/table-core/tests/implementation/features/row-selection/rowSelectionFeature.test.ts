import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  coreFeatures,
  createColumnHelper,
  rowSelectionFeature,
} from '../../../../src'
import * as RowSelectionUtils from '../../../../src/features/row-selection/rowSelectionFeature.utils'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { Person } from '../../../fixtures/data/types'
import type { ColumnDef, Row, Table_Internal } from '../../../../src'

// TODO: bring up to new test structure

const features = {
  ...coreFeatures,
  rowSelectionFeature,
  coreReactivityFeature: storeReactivityBindings(),
}

type personKeys = keyof Person
type PersonColumn = ColumnDef<typeof features, Person, any>

function generateColumnDefs(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<typeof features, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
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

      const result = RowSelectionUtils.selectRowsFn(
        rowModel,
        table as Table_Internal<typeof features, Person>,
      )

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

      const result = RowSelectionUtils.selectRowsFn(
        rowModel,
        table as Table_Internal<typeof features, Person>,
      )

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

      const result = RowSelectionUtils.selectRowsFn(
        rowModel,
        table as Table_Internal<typeof features, Person>,
      )

      expect(result.rows.length).toBe(0)
      expect(result.flatRows.length).toBe(1)
      expect(result.flatRows[0]?.id).toBe('0.0')
      expect(result.rowsById).toHaveProperty('0.0')
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

      const result = RowSelectionUtils.selectRowsFn(
        rowModel,
        table as Table_Internal<typeof features, Person>,
      )

      // Selected parents with subRows are cloned; the clone must keep the
      // shared row prototype so APIs like getValue() still work
      const clonedParent = result.rows[0]!
      expect(clonedParent).not.toBe(rowModel.rows[0])
      expect(typeof clonedParent.getValue).toBe('function')
      expect(clonedParent.getValue('id')).toBe(rowModel.rows[0]!.getValue('id'))
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

      const result = RowSelectionUtils.selectRowsFn(
        rowModel,
        table as Table_Internal<typeof features, Person>,
      )

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
  })
  describe('memoization', () => {
    // The `enableRowSelection` predicate is invoked once per row by
    // `row_getCanSelect`, so its call count is a proxy for how many times the
    // selection getters actually walk the row model.
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
            data.map((_, index) => [String(index), true]),
          ),
        },
        columns,
      })

      expect(table.getIsAllRowsSelected()).toBe(true)
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
})
