import clsx from 'clsx'

import { Paper } from '@mantine/core'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar'
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar'
import { MRT_TableContainer } from './MRT_TableContainer'
import classes from './MRT_TablePaper.module.css'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { PaperProps } from '@mantine/core'

interface Props<TData extends MRT_RowData> extends PaperProps {
  table: MRT_TableInstance<TData>
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      mantinePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table
  const { isFullScreen } = state

  const tablePaperProps = {
    ...parseFromValuesOrFunc(mantinePaperProps, { table }),
    ...rest,
  }

  return (
    <Paper
      shadow="xs"
      withBorder
      {...tablePaperProps}
      className={clsx(
        'mrt-table-paper',
        classes.root,
        isFullScreen && 'mrt-table-paper-fullscreen',
        tablePaperProps?.className,
      )}
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref
        if (tablePaperProps?.ref) {
          tablePaperProps.ref.current = ref
        }
      }}
      // rare case where we should use inline styles to guarantee highest specificity
      style={(theme) => ({
        zIndex: isFullScreen ? 200 : undefined,
        ...parseFromValuesOrFunc(tablePaperProps?.style, theme),
        ...(isFullScreen
          ? {
              border: 0,
              borderRadius: 0,
              bottom: 0,
              height: '100vh',
              left: 0,
              margin: 0,
              maxHeight: '100vh',
              maxWidth: '100vw',
              padding: 0,
              position: 'fixed',
              right: 0,
              top: 0,
              width: '100vw',
            }
          : null),
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
