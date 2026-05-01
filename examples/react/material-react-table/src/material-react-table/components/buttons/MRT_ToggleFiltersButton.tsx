import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_ToggleFiltersButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleFiltersButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFiltersButtonProps<TData>) => {
  const {
    state,
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table
  const { showColumnFilters } = state

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters)
  }

  return (
    <Tooltip title={rest?.title ?? localization.showHideFilters}>
      <IconButton
        aria-label={localization.showHideFilters}
        onClick={handleToggleShowFilters}
        {...rest}
        title={undefined}
      >
        {showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
      </IconButton>
    </Tooltip>
  )
}
