import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { LinearProgressProps } from '@mui/material/LinearProgress'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_LinearProgressBarProps<
  TData extends MRT_RowData,
> extends LinearProgressProps {
  isTopToolbar: boolean
  table: MRT_TableInstance<TData>
}

export const MRT_LinearProgressBar = <TData extends MRT_RowData>({
  isTopToolbar,
  table,
  ...rest
}: MRT_LinearProgressBarProps<TData>) => {
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
