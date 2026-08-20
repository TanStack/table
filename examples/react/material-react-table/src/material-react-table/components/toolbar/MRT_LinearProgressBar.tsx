import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { LinearProgressProps } from '@mui/material/LinearProgress'

export interface MRT_LinearProgressBarProps extends LinearProgressProps {
  isTopToolbar: boolean
}

export const MRT_LinearProgressBar = ({
  isTopToolbar,
  ...rest
}: MRT_LinearProgressBarProps) => {
  const table = useMRTContext()
  const {
    state,
    options: { muiLinearProgressProps },
  } = table
  const { isSaving, showProgressBars } = state

  const linearProgressProps = {
    ...parseFromValuesOrFunc(muiLinearProgressProps, {
      isTopToolbar,
      table,
    }),
    ...rest,
  }

  return (
    <Collapse
      in={showProgressBars !== false && (showProgressBars || isSaving)}
      mountOnEnter
      sx={{
        bottom: isTopToolbar ? 0 : undefined,
        position: 'absolute',
        top: !isTopToolbar ? 0 : undefined,
        width: '100%',
      }}
      unmountOnExit
    >
      <LinearProgress
        aria-busy="true"
        aria-label="Loading"
        sx={{ position: 'relative' }}
        {...linearProgressProps}
      />
    </Collapse>
  )
}
