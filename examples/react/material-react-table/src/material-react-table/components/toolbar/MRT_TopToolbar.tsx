import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getCommonToolbarStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_GlobalFilterTextField } from '../inputs/MRT_GlobalFilterTextField'
import { MRT_LinearProgressBar } from './MRT_LinearProgressBar'
import { MRT_TablePagination } from './MRT_TablePagination'
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner'
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone'
import { MRT_ToolbarInternalButtons } from './MRT_ToolbarInternalButtons'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_TopToolbarProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>
}

export const MRT_TopToolbar = <TData extends MRT_RowData>({
  table,
}: MRT_TopToolbarProps<TData>) => {
  const {
    state,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      muiTopToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table

  const { isFullScreen, showGlobalFilter } = state

  const isMobile = useMediaQuery('(max-width:720px)')
  const isTablet = useMediaQuery('(max-width:1024px)')

  const toolbarProps = parseFromValuesOrFunc(muiTopToolbarProps, { table })

  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet)

  const globalFilterProps = {
    sx: !isTablet
      ? {
          zIndex: 2,
        }
      : undefined,
    table,
  }

  return (
    <Box
      {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref
        if (toolbarProps?.ref) {
          // @ts-expect-error
          toolbarProps.ref.current = ref
        }
      }}
      sx={(theme) => ({
        ...getCommonToolbarStyles({ table, theme }),
        position: isFullScreen ? 'sticky' : 'relative',
        top: isFullScreen ? '0' : undefined,
        ...(parseFromValuesOrFunc(toolbarProps?.sx, theme) as any),
      })}
    >
      {positionToolbarAlertBanner === 'top' && (
        <MRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone table={table} />
      )}
      <Box
        sx={{
          alignItems: 'flex-start',
          boxSizing: 'border-box',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'space-between',
          p: '0.5rem',
          position: stackAlertBanner ? 'relative' : 'absolute',
          right: 0,
          top: 0,
          width: '100%',
        }}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <MRT_GlobalFilterTextField {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap-reverse',
              gap: '0.5rem',
              justifyContent: 'flex-end',
            }}
          >
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <MRT_GlobalFilterTextField {...globalFilterProps} />
            )}
            <MRT_ToolbarInternalButtons table={table} />
          </Box>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <MRT_GlobalFilterTextField {...globalFilterProps} />
          )
        )}
      </Box>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <MRT_TablePagination position="top" table={table} />
        )}
      <MRT_LinearProgressBar isTopToolbar table={table} />
    </Box>
  )
}
