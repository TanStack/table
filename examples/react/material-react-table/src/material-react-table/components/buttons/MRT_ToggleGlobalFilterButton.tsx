import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_ToggleGlobalFilterButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleGlobalFilterButtonProps<TData>) => {
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
