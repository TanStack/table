import {
  ColumnDef,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
} from '../src'

describe('Sorting', () => {
    describe('alphanumeric sort booleans ascending', () => {
      it('should return rows in correct ascending order', () => {
        const data = [
          { value: false },
          { value: true },
          { value: false },
          { value: true },
        ]
        const columns: ColumnDef<{value: boolean}>[] = [{
          accessorKey: "value",
          header: "Value",
          sortingFn: "alphanumeric"
        }]

        const table = createTable({
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: { sorting: [{
            id: "value",
            desc: false,
          }]},
          columns,
          getCoreRowModel: getCoreRowModel(),
          getSortedRowModel: getSortedRowModel(),
        })

        const rowModel = table.getSortedRowModel()

        expect(rowModel.rows[0].getValue("value")).toBe(false)
        expect(rowModel.rows[1].getValue("value")).toBe(false)
        expect(rowModel.rows[2].getValue("value")).toBe(true)
        expect(rowModel.rows[3].getValue("value")).toBe(true)
      })
    })

  describe('alphanumeric sort floats ascending', () => {
    it('should return rows in correct ascending order', () => {
      const data = [
        { value: 0.85 },
        { value: 0.001000000047 },
        { value: 0.2000016 },
        { value: 0.002002 },
      ]
      const columns: ColumnDef<{value: number}>[] = [{
        accessorKey: "value",
        header: "Value",
        sortingFn: "alphanumeric"
      }]

      const table = createTable({
        onStateChange() {},
        renderFallbackValue: '',
        data,
        state: { sorting: [{
          id: "value",
          desc: false,
        }]},
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
      })

      const rowModel = table.getSortedRowModel()

      expect(rowModel.rows[0].getValue("value")).toBe(0.001000000047)
      expect(rowModel.rows[1].getValue("value")).toBe(0.002002)
      expect(rowModel.rows[2].getValue("value")).toBe(0.2000016)
      expect(rowModel.rows[3].getValue("value")).toBe(0.85)
    })
  })
})
