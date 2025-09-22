import { describe, expect, it } from 'vitest'
import {
  ColumnDef,
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '../src'
import * as RowSelection from '../src/features/RowSelection'
import { makeData, Person } from './makeTestData'

type personKeys = keyof Person
type PersonColumn = ColumnDef<Person, string | number | Person[] | undefined>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<Person>()
  const person = people[0]
  return Object.keys(person).map(key => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

describe('RowSelection', () => {
  describe('selectRowsFn', () => {
    it('should only return rows that are selected', () => {
      const data = makeData(5)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0': true,
            '2': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelection.selectRowsFn(table, rowModel)

      expect(result.rows.length).toBe(2)
      expect(result.flatRows.length).toBe(2)
      expect(result.rowsById).toHaveProperty('0')
      expect(result.rowsById).toHaveProperty('2')
    })

    it('should recurse into subRows and only return selected subRows', () => {
      const data = makeData(3, 2) // assuming 3 parent rows with 2 sub-rows each
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0': true,
            '0.0': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelection.selectRowsFn(table, rowModel)

      expect(result.rows[0].subRows.length).toBe(1)
      expect(result.flatRows.length).toBe(2)
      expect(result.rowsById).toHaveProperty('0')
      expect(result.rowsById).toHaveProperty('0.0')
    })

    it('should return an empty list if no rows are selected', () => {
      const data = makeData(5)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {},
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
      const rowModel = table.getCoreRowModel()

      const result = RowSelection.selectRowsFn(table, rowModel)

      expect(result.rows.length).toBe(0)
      expect(result.flatRows.length).toBe(0)
      expect(result.rowsById).toEqual({})
    })
  })
  describe('isRowSelected', () => {
    it('should return true if the row id exists in selection and is set to true', () => {
      const row = { id: '123', data: {} } as any
      const selection: Record<string, boolean> = {
        '123': true,
        '456': false,
      }

      const result = RowSelection.isRowSelected(row, selection)
      expect(result).toEqual(true)
    })

    it('should return false if the row id exists in selection and is set to false', () => {
      const row = { id: '456', data: {} } as any
      const selection: Record<string, boolean> = {
        '123': true,
        '456': false,
      }

      const result = RowSelection.isRowSelected(row, selection)
      expect(result).toEqual(false)
    })

    it('should return false if the row id does not exist in selection', () => {
      const row = { id: '789', data: {} } as any
      const selection: Record<string, boolean> = {
        '123': true,
        '456': false,
      }

      const result = RowSelection.isRowSelected(row, selection)
      expect(result).toEqual(false)
    })

    it('should return false if selection is an empty object', () => {
      const row = { id: '789', data: {} } as any
      const selection: Record<string, boolean> = {}

      const result = RowSelection.isRowSelected(row, selection)
      expect(result).toEqual(false)
    })
  })
  describe('isSubRowSelected', () => {
    it('should return false if there are no sub-rows', () => {
      const data = makeData(3)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: {},
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual(false)
    })

    it('should return false if no sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {},
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual(false)
    })

    it('should return some if some sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('some')
    })

    it('should return all if all sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
            '0.1': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('all')
    })
    it('should return all if all selectable sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: row => row.index === 0, // only first row is selectable (of 2 sub-rows)
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0': true, // first sub-row
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('all')
    })
    it('should return some when some nested sub-rows are selected', () => {
      const data = makeData(3, 2, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: row => row.subRows,
        state: {
          rowSelection: {
            '0.0.0': true, // first nested sub-row
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]

      const result = RowSelection.isSubRowSelected(
        firstRow,
        table.getState().rowSelection,
        table
      )

      expect(result).toEqual('some')
    })
  })

  describe('Parent-Child Selection Behavior', () => {
    describe('getIsSelected for parent rows', () => {
      it('should return false when no children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {},
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(false)
      })

      it('should return false when some children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0': true, // first child
              '0.1': true, // second child
              // third child not selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(false)
      })

      it('should return true when all children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0': true, // first child
              '0.1': true, // second child
              '0.2': true, // third child
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(true)
      })

      it('should return true when parent is explicitly selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0': true, // parent explicitly selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(true)
      })

      it('should return true when parent is explicitly selected and all children are also selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0': true,   // parent explicitly selected
              '0.0': true, // first child
              '0.1': true, // second child
              '0.2': true, // third child
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(true)
      })
    })



    describe('Checkbox UI behavior integration', () => {
      function getCheckboxState(row: any) {
        const isChecked = row.getIsSelected()
        const isIndeterminate = row.getIsSomeSelected()
        
        if (isChecked) return 'checked'
        if (isIndeterminate) return 'indeterminate'
        return 'unchecked'
      }

      it('should show unchecked when no children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {},
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(getCheckboxState(parentRow)).toBe('unchecked')
      })

      it('should show indeterminate when some children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0': true, // first child
              '0.1': true, // second child
              // third child not selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(getCheckboxState(parentRow)).toBe('indeterminate')
      })

      it('should show checked when all children are selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0': true, // first child
              '0.1': true, // second child
              '0.2': true, // third child
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(getCheckboxState(parentRow)).toBe('checked')
      })

      it('should show checked when parent is explicitly selected', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0': true, // parent explicitly selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(getCheckboxState(parentRow)).toBe('checked')
      })
    })

    describe('Edge case scenarios', () => {
      it('Parent should be checked when all children are selected individually', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: { '0.0': true, '0.1': true, '0.2': true },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        expect(parentRow.getIsSelected()).toBe(true) // Auto-selected because all children selected
        expect(parentRow.getIsSomeSelected()).toBe(false)
      })

      it('Parent explicitly selected but some children deselected should show indeterminate', () => {
        const data = makeData(1, 1, 3) // 3-level hierarchy
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0': true,     // 2nd level explicitly selected
              '0.0.1': true,   // Some children selected
              '0.0.2': true,   
              // '0.0.0' NOT selected - creates indeterminate state
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const secondLevelRow = table.getCoreRowModel().rows[0].subRows[0]

        expect(secondLevelRow.getIsSelected()).toBe(false) // Indeterminate, not selected
        expect(secondLevelRow.getIsSomeSelected()).toBe(true)
      })

      it('Multi-level hierarchy propagates indeterminate state correctly', () => {
        const data = makeData(1, 1, 3) // Root > Level2 > 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0.0.0': true, // Only one grandchild selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const rootRow = table.getCoreRowModel().rows[0]
        const level2Row = rootRow.subRows[0]
        
        // Both parent levels should be indeterminate
        expect(level2Row.getIsSelected()).toBe(false)
        expect(level2Row.getIsSomeSelected()).toBe(true)
        expect(rootRow.getIsSelected()).toBe(false)
        expect(rootRow.getIsSomeSelected()).toBe(true)
      })
    })

    describe('Backward compatibility when enableSubRowSelection is disabled', () => {
      it('should use original logic when enableSubRowSelection is false', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: false, // Disabled
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0': true,    // Parent explicitly selected
              '0.0': true,  // Some children selected
              '0.1': true,
              // '0.2' not selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        
        // With enableSubRowSelection: false, parent should return direct selection (true)
        // This is the original behavior - no enhanced indeterminate logic
        expect(parentRow.getIsSelected()).toBe(true)
        expect(parentRow.getIsSomeSelected()).toBe(true) // Uses original isSubRowSelected logic
      })

      it('should not auto-update parent state when enableSubRowSelection is false', () => {
        const data = makeData(1, 3) // 1 parent with 3 children
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: false,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {},
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const parentRow = table.getCoreRowModel().rows[0]
        const firstChild = parentRow.subRows[0]
        const secondChild = parentRow.subRows[1]
        const thirdChild = parentRow.subRows[2]

        // Select all children
        firstChild.toggleSelected(true)
        secondChild.toggleSelected(true)
        thirdChild.toggleSelected(true)

        // With enableSubRowSelection: false, parent should NOT be auto-selected
        // This preserves the original behavior
        expect(parentRow.getIsSelected()).toBe(false)
      })

      it('should handle function-based enableSubRowSelection correctly', () => {
        const data = makeData(2, 2) // 2 parents with 2 children each
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          enableSubRowSelection: (row) => row.id === '0', // Only enable for first parent
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: row => row.subRows,
          state: {
            rowSelection: {
              '0': true,    // First parent selected
              '0.0': true,  // Some children selected
              '1': true,    // Second parent selected
              '1.0': true,  // Some children selected
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstParent = table.getCoreRowModel().rows[0]  // enableSubRowSelection: true
        const secondParent = table.getCoreRowModel().rows[1] // enableSubRowSelection: false

        // First parent uses enhanced logic (indeterminate when partial selection)
        expect(firstParent.getIsSelected()).toBe(false) // Enhanced logic: indeterminate
        expect(firstParent.getIsSomeSelected()).toBe(true)

        // Second parent uses original logic (direct selection)
        expect(secondParent.getIsSelected()).toBe(true) // Original logic: direct selection
        expect(secondParent.getIsSomeSelected()).toBe(true)
      })
    })
  })
})
