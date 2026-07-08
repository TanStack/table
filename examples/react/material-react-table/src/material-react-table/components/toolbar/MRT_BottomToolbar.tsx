import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getCommonToolbarStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { MRT_LinearProgressBar } from './MRT_LinearProgressBar'
import { MRT_TablePagination } from './MRT_TablePagination'
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner'
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_BottomToolbarProps extends BoxProps {}

export const MRT_BottomToolbar = ({ ...rest }: MRT_BottomToolbarProps) => {
  const table = useMRTContext()
  const {
    state,
    options: {
      enablePagination,
      muiBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table
  const { isFullScreen } = state

  const isMobile = useMediaQuery('(max-width:720px)')

  const toolbarProps = {
    ...parseFromValuesOrFunc(muiBottomToolbarProps, { table }),
    ...rest,
  }

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions

  return (
    <Box
      {...toolbarProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          bottomToolbarRef.current = node
          if (toolbarProps?.ref) {
            // @ts-expect-error
            toolbarProps.ref.current = node
          }
        }
      }}
      sx={(theme) => ({
        ...getCommonToolbarStyles({ table, theme }),
        bottom: isFullScreen ? '0' : undefined,
        boxShadow: `0 1px 2px -1px ${alpha(
          theme.palette.grey[700],
          0.5,
        )} inset`,
        left: 0,
        position: isFullScreen ? 'fixed' : 'relative',
        right: 0,
        ...(parseFromValuesOrFunc(toolbarProps?.sx, theme) as any),
      })}
    >
      <MRT_LinearProgressBar isTopToolbar={false} />
      {positionToolbarAlertBanner === 'bottom' && (
        <MRT_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone />
      )}
      <Box
        sx={{
          alignItems: 'center',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          p: '0.5rem',
          width: '100%',
        }}
      >
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: stackAlertBanner ? 'relative' : 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <MRT_TablePagination position="bottom" />
            )}
        </Box>
      </Box>
    </Box>
  )
}
