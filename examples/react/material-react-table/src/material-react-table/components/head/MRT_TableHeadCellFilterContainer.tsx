import Collapse from '@mui/material/Collapse'
import { getColumnFilterInfo } from '../../utils/column.utils'
import { MRT_FilterCheckbox } from '../inputs/MRT_FilterCheckbox'
import { MRT_FilterRangeFields } from '../inputs/MRT_FilterRangeFields'
import { MRT_FilterRangeSlider } from '../inputs/MRT_FilterRangeSlider'
import { MRT_FilterTextField } from '../inputs/MRT_FilterTextField'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { MRT_Header, MRT_RowData } from '../../types'
import type { CollapseProps } from '@mui/material/Collapse'

export interface MRT_TableHeadCellFilterContainerProps<
  TData extends MRT_RowData,
> extends CollapseProps {
  header: MRT_Header<TData>
}

export const MRT_TableHeadCellFilterContainer = <TData extends MRT_RowData>({
  header,
  ...rest
}: MRT_TableHeadCellFilterContainerProps<TData>) => {
  const table = useMRTContext<TData>()
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
        <MRT_FilterCheckbox column={column} />
      ) : columnDef.filterVariant === 'range-slider' ? (
        <MRT_FilterRangeSlider header={header} />
      ) : isRangeFilter ? (
        <MRT_FilterRangeFields header={header} />
      ) : (
        <MRT_FilterTextField header={header} />
      )}
    </Collapse>
  )
}
