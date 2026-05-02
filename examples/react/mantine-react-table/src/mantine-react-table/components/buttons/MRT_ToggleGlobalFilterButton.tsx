import { ActionIcon, Tooltip } from '@mantine/core'
import type { ActionIconProps } from '@mantine/core'

import type { HTMLPropsRef, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData>
  extends ActionIconProps, HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
  table: {
    state,
    options: {
      icons: { IconSearch, IconSearchOff },
      localization: { showHideSearch },
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { globalFilter, showGlobalFilter } = state

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  return (
    <Tooltip label={title ?? showHideSearch} withinPortal>
      <ActionIcon
        aria-label={title ?? showHideSearch}
        color="gray"
        disabled={!!globalFilter}
        onClick={handleToggleSearch}
        size="lg"
        variant="subtle"
        {...rest}
      >
        {showGlobalFilter ? <IconSearchOff /> : <IconSearch />}
      </ActionIcon>
    </Tooltip>
  )
}
