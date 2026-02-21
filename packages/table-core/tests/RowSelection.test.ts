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
  return Object.keys(person).map((key) => {
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
        getSubRows: (row) => row.subRows,
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
        getSubRows: (row) => row.subRows,
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
        getSubRows: (row) => row.subRows,
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
        table,
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
        getSubRows: (row) => row.subRows,
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
        table,
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
        getSubRows: (row) => row.subRows,
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
        table,
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
        getSubRows: (row) => row.subRows,
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
        table,
      )

      expect(result).toEqual('all')
    })
    it('should return all if all selectable sub-rows are selected', () => {
      const data = makeData(3, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: (row) => row.index === 0, // only first row is selectable (of 2 sub-rows)
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
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
        table,
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
        getSubRows: (row) => row.subRows,
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
        table,
      )

      expect(result).toEqual('some')
    })
  })

  describe('getSubRowSelectionsCount', () => {
    describe('selectableCount', () => {
      it('should be 0 when there are no sub-rows', () => {
        const data = makeData(1)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectableCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectableCount).toBe(0)
      })

      it('should be 0 when all sub-rows are not selectable', () => {
        const data = makeData(1, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: (row) => row.depth === 0, // only root rows are selectable
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectableCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectableCount).toBe(0)
      })

      it('should be number of selectable sub-rows', () => {
        const data = makeData(1, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectableCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectableCount).toBe(2)
      })

      it('should include all nested selectable sub-rows', () => {
        const data = makeData(1, 2, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: (row) => row.id !== '0.0.1', // make one of the sub-rows non-selectable
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectableCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectableCount).toBe(5) // 2 direct sub-rows + 3 nested sub-rows
      })
    })

    describe('selectedCount', () => {
      it('should be 0 when there are no sub-rows', () => {
        const data = makeData(3)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectedCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectedCount).toBe(0)
      })

      it('should be 0 when all sub-rows are not selectable', () => {
        const data = makeData(1, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: (row) => row.depth === 0, // only root rows are selectable
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectedCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectedCount).toBe(0)
      })

      it('should be 0 when no sub-rows are selected', () => {
        const data = makeData(1, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: { rowSelection: {} },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectedCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectedCount).toBe(0)
      })

      it('should be number of selectable and selected sub-rows', () => {
        const data = makeData(1, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: (row) => row.id !== '0.1', // second sub-row is not selectable
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
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
        const { selectedCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectedCount).toBe(1)
      })

      it('should include all nested selectable and selected sub-rows', () => {
        const data = makeData(1, 2, 2)
        const columns = generateColumns(data)

        const table = createTable<Person>({
          enableRowSelection: (row) => row.id !== '0.0.1', // make one of the sub-rows non-selectable
          onStateChange() {},
          renderFallbackValue: '',
          data,
          getSubRows: (row) => row.subRows,
          state: {
            rowSelection: {
              '0.0': true,
              '0.0.0': true,
              '0.0.1': true,
              '0.1.1': true,
            },
          },
          columns,
          getCoreRowModel: getCoreRowModel(),
        })

        const firstRow = table.getCoreRowModel().rows[0]
        const { selectedCount } = RowSelection.getSubRowSelectionsCount(firstRow)
        expect(selectedCount).toBe(3)
      })
    });
  });

  describe('RowSelectionRow.getIsSomeSelected', () => {
    it('should return false if there are no sub-rows', () => {
      const data = makeData(2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: { rowSelection: {} },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const { rows } = table.getCoreRowModel();
      rows.forEach(row => {
        expect(row.getIsSomeSelected()).toBe(false)
      });
    })

    it('should return false if all sub-rows are not selectable', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: (row) => row.depth === 0, // only root rows selectable
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true, '0.1': true } }, // even if all sub-rows are selected, they are not selectable
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsSomeSelected()).toBe(false)
    })

    it('should return false if all selectable sub-rows are not selected', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0': true } },  // parent row's own selection does not impact outcome
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsSomeSelected()).toBe(false)
    })

    it('should return false if all selectable sub-rows are selected', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true, '0.1': true } },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsSomeSelected()).toBe(false)
    })

    it('should return true if some selectable sub-rows are selected', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true } },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsSomeSelected()).toBe(true)
    })

    it('should return true if one nested selectable sub-row is selected', () => {
      const data = makeData(1, 2, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0.0': true } },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsSomeSelected()).toBe(true)
    })
  });

  describe('RowSelectionRow.getIsAllSubRowsSelected', () => {
    it('should return false if there are no sub-rows', () => {
      const data = makeData(2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: { rowSelection: {} },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const { rows } = table.getCoreRowModel();
      rows.forEach(row => {
        expect(row.getIsAllSubRowsSelected()).toBe(false)
      });
    })

    it('should return false if all sub-rows are not selectable', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: (row) => row.depth === 0, // only root rows selectable
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: {} },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(false)
    })

    it('should return false if any selectable sub-row is not selected', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true } }, // only one of two selected
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(false)
    })

    it('should return false if any nested selectable sub-row is not selected', () => {
      const data = makeData(1, 2, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
            '0.0.0': true,
            '0.0.1': true,
            '0.1': true,
            '0.1.0': true,
            // '0.1.1' not selected
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(false)
    })

    it('should return true if all selectable sub-rows are selected', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true, '0.1': true } },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(true)
    })

    it('should return true if all selectable sub-rows including nested ones are selected', () => {
      const data = makeData(1, 2, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: true,
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: {
          rowSelection: {
            '0.0': true,
            '0.0.0': true,
            '0.0.1': true,
            '0.1': true,
            '0.1.0': true,
            '0.1.1': true,
          },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(true)
    })

    it('should return true when all selectable sub-rows are selected and some are non-selectable', () => {
      const data = makeData(1, 2)
      const columns = generateColumns(data)

      const table = createTable<Person>({
        enableRowSelection: (row) => row.id !== '0.1', // second sub-row is NOT selectable
        onStateChange() {},
        renderFallbackValue: '',
        data,
        getSubRows: (row) => row.subRows,
        state: { rowSelection: { '0.0': true } }, // only selectable sub-row selected
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      const firstRow = table.getCoreRowModel().rows[0]
      expect(firstRow.getIsAllSubRowsSelected()).toBe(true)
    })
  });
})
