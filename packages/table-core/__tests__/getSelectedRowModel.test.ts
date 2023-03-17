import { ColumnDef, getCoreRowModel, getGroupedRowModel, RowSelectionState, Table, Updater } from '../src'
import { createColumnHelper } from '../src/columnHelper'
import { createTable } from '../src/core/table'
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

describe('row selection', () => {
  let table: Table<Person>
  let data: Person[]

  beforeEach(() => {
    data = makeData(10)
    const columns = generateColumns(data)

    function setRowSelection(updater: Updater<RowSelectionState>) {
      const selectionState = updater instanceof Function
        ? updater(table.getState().rowSelection)
        : updater

      table.setOptions({
        ...table.options,
        state: {
          ...table.options.state,
          rowSelection: selectionState
        }
      })
    }

    table = createTable<Person>({
      onStateChange() {},
      onRowSelectionChange: setRowSelection,
      renderFallbackValue: '',
      data,
      state: { rowSelection: {} },
      columns,
      getCoreRowModel: getCoreRowModel(),
      enableRowSelection: true
    })
  })

  it('rows initialize to not selected', () => {
    const allRows = table.getCoreRowModel().rows
    allRows.forEach(row => expect(row.getIsSelected()).toBe(false))
  })

  it('can toggle row selection', () => {
    const firstRow = table.getCoreRowModel().rows[0]
    firstRow.toggleSelected()
    expect(firstRow.getIsSelected()).toBe(true)
    firstRow.toggleSelected()
    expect(firstRow.getIsSelected()).toBe(false)
  })

  it('cannot select row that is not selectable', () => {
    const rows = table.getCoreRowModel().rows
    const firstRow = rows[0]
    const secondRow = rows[1]
    table.options.enableRowSelection = (row) => { return row !== firstRow }

    firstRow.toggleSelected()
    expect(firstRow.getIsSelected()).toBe(false)
    secondRow.toggleSelected()
    expect(secondRow.getIsSelected()).toBe(true)
  })

  describe('group selection', () => {
    beforeEach(() => {
      data.forEach(p => (p.firstName = 'Fixed'))

      table.setOptions({
        ...table.options,
        enableRowSelection: (row) => !row.getIsGrouped(),
        enableGrouping: true,
        getGroupedRowModel: getGroupedRowModel(),
        data: [...data],
        state: {
          ...table.options.state,
          grouping: ['firstName']
        }
      })
    })

    it('can toggle grouped row selection to select and deselect subrows', () => {
      const groupedRow = table.getRowModel().rowsById['firstName:Fixed']
      const subrows = groupedRow.subRows

      groupedRow.toggleSelected(true)
      expect(groupedRow.getIsSelected()).toBe(false)
      expect(groupedRow.getIsSomeSelected()).toBe(false)
      expect(groupedRow.getIsAllSubRowsSelected()).toBe(true)
      subrows.forEach(row => expect(row.getIsSelected()).toBe(true))

      groupedRow.toggleSelected(false)
      expect(groupedRow.getIsSelected()).toBe(false)
      expect(groupedRow.getIsSomeSelected()).toBe(false)
      expect(groupedRow.getIsAllSubRowsSelected()).toBe(false)
      subrows.forEach(row => expect(row.getIsSelected()).toBe(false))
    })

    it('grouped row returns correct subrow selection state when one subrow is selected', () => {
      const groupedRow = table.getRowModel().rowsById['firstName:Fixed']
      const firstSubRow = groupedRow.subRows[0]

      firstSubRow.toggleSelected()
      expect(firstSubRow.getIsSelected()).toBe(true)
      expect(groupedRow.getIsSelected()).toBe(false)
      expect(groupedRow.getIsSomeSelected()).toBe(true)
      expect(groupedRow.getIsAllSubRowsSelected()).toBe(false)
    })
  })
})
