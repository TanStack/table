import clsx from 'clsx'

import { Box  } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { parseFromValuesOrFunc } from '../../utils/utils'
import commonClasses from './common.styles.module.css'
import classes from './MRT_BottomToolbar.module.css'


import { MRT_ProgressBar } from './MRT_ProgressBar'
import { MRT_TablePagination } from './MRT_TablePagination'
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner'
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone'
import type {BoxProps} from '@mantine/core';

import type {MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>
}

export const MRT_BottomToolbar = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      enablePagination,
      mantineBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table
  const { isFullScreen } = state

  const isMobile = useMediaQuery('(max-width: 720px)')

  const toolbarProps = {
    ...parseFromValuesOrFunc(mantineBottomToolbarProps, {
      table,
    }),
    ...rest,
  }

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions

  return (
    <Box
      {...toolbarProps}
      className={clsx(
        'mrt-bottom-toolbar',
        classes.root,
        commonClasses['common-toolbar-styles'],
        isFullScreen && classes['root-fullscreen'],
        toolbarProps?.className,
      )}
      ref={(node: HTMLDivElement) => {
        if (node) {
          bottomToolbarRef.current = node
          if (toolbarProps?.ref) {
            toolbarProps.ref.current = node
          }
        }
      }}
    >
      <MRT_ProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <MRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone table={table} />
      )}
      <Box className={classes['custom-toolbar-container']}>
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}
        <Box
          className={clsx(
            classes['paginator-container'],
            stackAlertBanner && classes['paginator-container-alert-banner'],
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <MRT_TablePagination position="bottom" table={table} />
            )}
        </Box>
      </Box>
    </Box>
  )
}
