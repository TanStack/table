import Box from '@mui/material/Box'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ShowHideColumnsButton } from '../buttons/MRT_ShowHideColumnsButton'
import { MRT_ToggleDensePaddingButton } from '../buttons/MRT_ToggleDensePaddingButton'
import { MRT_ToggleFiltersButton } from '../buttons/MRT_ToggleFiltersButton'
import { MRT_ToggleFullScreenButton } from '../buttons/MRT_ToggleFullScreenButton'
import { MRT_ToggleGlobalFilterButton } from '../buttons/MRT_ToggleGlobalFilterButton'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_ToolbarInternalButtonsProps extends BoxProps {}

export const MRT_ToolbarInternalButtons = ({
  ...rest
}: MRT_ToolbarInternalButtonsProps) => {
  const table = useMRTContext()
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table

  return (
    <Box
      {...rest}
      sx={(theme) => ({
        alignItems: 'center',
        display: 'flex',
        zIndex: 3,
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {renderToolbarInternalActions?.({
        table,
      }) ?? (
        <>
          {enableFilters &&
            enableGlobalFilter &&
            !initialState?.showGlobalFilter && <MRT_ToggleGlobalFilterButton />}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && (
              <MRT_ToggleFiltersButton />
            )}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <MRT_ShowHideColumnsButton />
          )}
          {enableDensityToggle && <MRT_ToggleDensePaddingButton />}
          {enableFullScreenToggle && <MRT_ToggleFullScreenButton />}
        </>
      )}
    </Box>
  )
}
