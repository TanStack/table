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
  })
})
