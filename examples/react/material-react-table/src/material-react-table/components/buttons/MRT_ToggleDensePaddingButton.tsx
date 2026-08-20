import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ToggleDensePaddingButtonProps extends IconButtonProps {}

export const MRT_ToggleDensePaddingButton = ({
  ...rest
}: MRT_ToggleDensePaddingButtonProps) => {
  const table = useMRTContext()
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
