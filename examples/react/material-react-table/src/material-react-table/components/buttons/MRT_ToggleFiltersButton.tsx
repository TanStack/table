import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ToggleFiltersButtonProps extends IconButtonProps {}

export const MRT_ToggleFiltersButton = ({
  ...rest
}: MRT_ToggleFiltersButtonProps) => {
  const table = useMRTContext()
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
