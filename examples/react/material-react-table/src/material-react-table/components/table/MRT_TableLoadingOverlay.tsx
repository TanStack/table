import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { alpha } from '@mui/material/styles'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { CircularProgressProps } from '@mui/material/CircularProgress'

export interface MRT_TableLoadingOverlayProps extends CircularProgressProps {}

export const MRT_TableLoadingOverlay = ({
  ...rest
}: MRT_TableLoadingOverlayProps) => {
  const table = useMRTContext()
  const {
    options: {
      id,
      localization,
      mrtTheme: { baseBackgroundColor },
      muiCircularProgressProps,
    },
  } = table

  const circularProgressProps = {
    ...parseFromValuesOrFunc(muiCircularProgressProps, { table }),
    ...rest,
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: alpha(baseBackgroundColor, 0.5),
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        maxHeight: '100vh',
        position: 'absolute',
        right: 0,
        top: 0,
        width: '100%',
        zIndex: 3,
      }}
    >
      {circularProgressProps?.Component ?? (
        <CircularProgress
          aria-label={localization.noRecordsToDisplay}
          id={`mrt-progress-${id}`}
          {...circularProgressProps}
        />
      )}
    </Box>
  )
}
