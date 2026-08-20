import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar'
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { MRT_TableContainer } from './MRT_TableContainer'
import type { PaperProps } from '@mui/material/Paper'

export interface MRT_TablePaperProps extends PaperProps {}

export const MRT_TablePaper = ({ ...rest }: MRT_TablePaperProps) => {
  const table = useMRTContext()
  const {
    state,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      mrtTheme: { baseBackgroundColor },
      muiTablePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table
  const { isFullScreen } = state

  const paperProps = {
    ...parseFromValuesOrFunc(muiTablePaperProps, { table }),
    ...rest,
  }

  const theme = useTheme()

  return (
    <Paper
      elevation={2}
      onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
      {...paperProps}
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref
        if (paperProps?.ref) {
          // @ts-expect-error
          paperProps.ref.current = ref
        }
      }}
      style={{
        ...(isFullScreen
          ? {
              bottom: 0,
              height: '100dvh',
              left: 0,
              margin: 0,
              maxHeight: '100dvh',
              maxWidth: '100dvw',
              padding: 0,
              position: 'fixed',
              right: 0,
              top: 0,
              width: '100dvw',
              zIndex: theme.zIndex.modal,
            }
          : {}),
        ...paperProps?.style,
      }}
      sx={(theme) => ({
        backgroundColor: baseBackgroundColor,
        backgroundImage: 'unset',
        overflow: 'hidden',
        transition: 'all 100ms ease-in-out',
        ...(parseFromValuesOrFunc(paperProps?.sx, theme) as any),
      })}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <MRT_TopToolbar />
        ))}
      <MRT_TableContainer />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <MRT_BottomToolbar />
        ))}
    </Paper>
  )
}
