import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ToggleGlobalFilterButtonProps extends IconButtonProps {}

export const MRT_ToggleGlobalFilterButton = ({
  ...rest
}: MRT_ToggleGlobalFilterButtonProps) => {
  const table = useMRTContext()
  const {
    state,
    options: {
      icons: { SearchIcon, SearchOffIcon },

      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table
  const { globalFilter, showGlobalFilter } = state

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter)
    queueMicrotask(() => searchInputRef.current?.focus())
  }

  return (
    <Tooltip title={rest?.title ?? localization.showHideSearch}>
      <span>
        <IconButton
          aria-label={rest?.title ?? localization.showHideSearch}
          disabled={!!globalFilter && showGlobalFilter}
          onClick={handleToggleSearch}
          {...rest}
          title={undefined}
        >
          {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
        </IconButton>
      </span>
    </Tooltip>
  )
}
