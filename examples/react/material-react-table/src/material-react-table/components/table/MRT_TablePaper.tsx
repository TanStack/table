import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar'
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar'
import { MRT_TableContainer } from './MRT_TableContainer'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { PaperProps } from '@mui/material/Paper'

export interface MRT_TablePaperProps<
  TData extends MRT_RowData,
> extends PaperProps {
  table: MRT_TableInstance<TData>
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_TablePaperProps<TData>) => {
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
          <MRT_TopToolbar table={table} />
        ))}
      <MRT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <MRT_BottomToolbar table={table} />
        ))}
    </Paper>
  )
}
