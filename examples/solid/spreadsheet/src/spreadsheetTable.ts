import {
  cellSelectionFeature,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPinningFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from '@tanstack/solid-table'
import type {
  Cell,
  Column,
  Header,
  Row,
  RowData,
  RowModel,
  SolidTable,
  Table,
  TableFeatures,
} from '@tanstack/solid-table'
import type { SpreadsheetColumnMeta, SpreadsheetRow } from './spreadsheetModel'

function createSpreadsheetSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData & { kind: 'field-header' | 'data' },
>() {
  const createBaseRowModel = createSortedRowModel<TFeatures, TData>()

  return (table: Table<TFeatures, TData>) => {
    const getBaseRowModel = createBaseRowModel(table)

    return (): RowModel<TFeatures, TData> => {
      const model = getBaseRowModel()
      const headerIndex = model.rows.findIndex(
        (row) => row.original.kind === 'field-header',
      )
      if (headerIndex <= 0) return model

      const header = model.rows[headerIndex]
      const rows = [
        header,
        ...model.rows.slice(0, headerIndex),
        ...model.rows.slice(headerIndex + 1),
      ]
      const flatHeaderIndex = model.flatRows.indexOf(header)
      const flatRows =
        flatHeaderIndex <= 0
          ? model.flatRows
          : [
              header,
              ...model.flatRows.slice(0, flatHeaderIndex),
              ...model.flatRows.slice(flatHeaderIndex + 1),
            ]

      return { ...model, rows, flatRows }
    }
  }
}

export const spreadsheetFeatures = tableFeatures({
  cellSelectionFeature,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  rowPinningFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSpreadsheetSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    text: sortFn_text,
  },
  columnMeta: metaHelper<SpreadsheetColumnMeta>(),
})

export type SpreadsheetFeatures = typeof spreadsheetFeatures
export type SpreadsheetTable = SolidTable<SpreadsheetFeatures, SpreadsheetRow>
export type SpreadsheetTableRow = Row<SpreadsheetFeatures, SpreadsheetRow>
export type SpreadsheetTableColumn = Column<
  SpreadsheetFeatures,
  SpreadsheetRow,
  unknown
>
export type SpreadsheetTableHeader = Header<
  SpreadsheetFeatures,
  SpreadsheetRow,
  unknown
>
export type SpreadsheetTableCell = Cell<
  SpreadsheetFeatures,
  SpreadsheetRow,
  unknown
>
