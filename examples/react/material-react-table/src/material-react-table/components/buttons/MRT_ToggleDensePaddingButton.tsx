import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_ToggleDensePaddingButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    state,
    options: {
      icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
      localization,
    },
    setDensity,
  } = table
  const { density } = state

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable'
    setDensity(nextDensity)
  }

  return (
    <Tooltip title={rest?.title ?? localization.toggleDensity}>
      <IconButton
        aria-label={localization.toggleDensity}
        onClick={handleToggleDensePadding}
        {...rest}
        title={undefined}
      >
        {density === 'compact' ? (
          <DensitySmallIcon />
        ) : density === 'comfortable' ? (
          <DensityMediumIcon />
        ) : (
          <DensityLargeIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}
