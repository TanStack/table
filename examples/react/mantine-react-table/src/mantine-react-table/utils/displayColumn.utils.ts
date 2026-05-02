import { getAllLeafColumnDefs, getColumnId } from './column.utils'
import type {
  MRT_ColumnDef,
  MRT_DefinedTableOptions,
  MRT_DisplayColumnIds,
  MRT_Localization,
  MRT_RowData,
  MRT_StatefulTableOptions,
} from '../types'

export function defaultDisplayColumnProps<TData extends MRT_RowData>({
  header,
  id,
  size,
  tableOptions,
}: {
  header?: keyof MRT_Localization
  id: MRT_DisplayColumnIds
  size: number
  tableOptions: MRT_DefinedTableOptions<TData>
}): MRT_ColumnDef<TData> {
  const { defaultDisplayColumn, displayColumnDefOptions, localization } =
    tableOptions
  return {
    ...defaultDisplayColumn,
    header: header ? localization[header] : '',
    size,
    ...displayColumnDefOptions?.[id],
    id,
  }
}

export const showRowPinningColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowPinning, rowPinningDisplayMode } = tableOptions
  return !!(enableRowPinning && !rowPinningDisplayMode?.startsWith('select'))
}

export const showRowDragColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowDragging, enableRowOrdering } = tableOptions
  return !!(enableRowDragging || enableRowOrdering)
}

export const showRowExpandColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => {
  const {
    enableExpanding,
    enableGrouping,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions
  return !!(
    enableExpanding ||
    (enableGrouping && grouping?.length) ||
    renderDetailPanel
  )
}

export const showRowActionsColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => {
  const {
    createDisplayMode,
    editDisplayMode,
    enableEditing,
    enableRowActions,
    state: { creatingRow },
  } = tableOptions
  return !!(
    enableRowActions ||
    (creatingRow && createDisplayMode === 'row') ||
    (enableEditing && ['modal', 'row'].includes(editDisplayMode ?? ''))
  )
}

export const showRowSelectionColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowSelection

export const showRowNumbersColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowNumbers

export const showRowSpacerColumn = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): boolean => tableOptions.layoutMode === 'grid-no-grow'

export const getLeadingDisplayColumnIds = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
) =>
  [
    showRowPinningColumn(tableOptions) && 'mrt-row-pin',
    showRowDragColumn(tableOptions) && 'mrt-row-drag',
    tableOptions.positionActionsColumn === 'first' &&
      showRowActionsColumn(tableOptions) &&
      'mrt-row-actions',
    tableOptions.positionExpandColumn === 'first' &&
      showRowExpandColumn(tableOptions) &&
      'mrt-row-expand',
    showRowSelectionColumn(tableOptions) && 'mrt-row-select',
    showRowNumbersColumn(tableOptions) && 'mrt-row-numbers',
  ].filter(Boolean) as Array<MRT_DisplayColumnIds>

export const getTrailingDisplayColumnIds = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
) =>
  [
    tableOptions.positionActionsColumn === 'last' &&
      showRowActionsColumn(tableOptions) &&
      'mrt-row-actions',
    tableOptions.positionExpandColumn === 'last' &&
      showRowExpandColumn(tableOptions) &&
      'mrt-row-expand',
    showRowSpacerColumn(tableOptions) && 'mrt-row-spacer',
  ].filter(Boolean) as Array<MRT_DisplayColumnIds>

export const getDefaultColumnOrderIds = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
  reset = false,
) => {
  const {
    state: { columnOrder: currentColumnOrderIds = [] },
  } = tableOptions

  const leadingDisplayColIds: Array<string> =
    getLeadingDisplayColumnIds(tableOptions)
  const trailingDisplayColIds: Array<string> =
    getTrailingDisplayColumnIds(tableOptions)

  const defaultColumnDefIds = getAllLeafColumnDefs(tableOptions.columns).map(
    (columnDef) => getColumnId(columnDef),
  )

  let allLeafColumnDefIds = reset
    ? defaultColumnDefIds
    : Array.from(new Set([...currentColumnOrderIds, ...defaultColumnDefIds]))

  allLeafColumnDefIds = allLeafColumnDefIds.filter(
    (colId) =>
      !leadingDisplayColIds.includes(colId) &&
      !trailingDisplayColIds.includes(colId),
  )

  return [
    ...leadingDisplayColIds,
    ...allLeafColumnDefIds,
    ...trailingDisplayColIds,
  ]
}
