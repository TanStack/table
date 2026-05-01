import Collapse from '@mui/material/Collapse'
import { getColumnFilterInfo } from '../../utils/column.utils'
import { MRT_FilterCheckbox } from '../inputs/MRT_FilterCheckbox'
import { MRT_FilterRangeFields } from '../inputs/MRT_FilterRangeFields'
import { MRT_FilterRangeSlider } from '../inputs/MRT_FilterRangeSlider'
import { MRT_FilterTextField } from '../inputs/MRT_FilterTextField'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { CollapseProps } from '@mui/material/Collapse'

export interface MRT_TableHeadCellFilterContainerProps<
  TData extends MRT_RowData,
> extends CollapseProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellFilterContainer = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellFilterContainerProps<TData>) => {
  const {
    state,
    options: { columnFilterDisplayMode },
  } = table
  const { showColumnFilters } = state
  const { column } = header
  const { columnDef } = column
  const { isRangeFilter } = getColumnFilterInfo({ header, table })

  return (
    <Collapse
      in={showColumnFilters || columnFilterDisplayMode === 'popover'}
      mountOnEnter
      unmountOnExit
      {...rest}
    >
      {columnDef.filterVariant === 'checkbox' ? (
        <MRT_FilterCheckbox column={column} table={table} />
      ) : columnDef.filterVariant === 'range-slider' ? (
        <MRT_FilterRangeSlider header={header} table={table} />
      ) : isRangeFilter ? (
        <MRT_FilterRangeFields header={header} table={table} />
      ) : (
        <MRT_FilterTextField header={header} table={table} />
      )}
    </Collapse>
  )
}
