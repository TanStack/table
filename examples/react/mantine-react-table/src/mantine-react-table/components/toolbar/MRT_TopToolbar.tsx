import clsx from 'clsx'

import { Box,  Flex } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_GlobalFilterTextInput } from '../inputs/MRT_GlobalFilterTextInput'
import commonClasses from './common.styles.module.css'
import classes from './MRT_TopToolbar.module.css'


import { MRT_ProgressBar } from './MRT_ProgressBar'
import { MRT_TablePagination } from './MRT_TablePagination'
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner'
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone'
import { MRT_ToolbarInternalButtons } from './MRT_ToolbarInternalButtons'

import type {MRT_RowData, MRT_TableInstance} from '../../types';
import type {BoxProps} from '@mantine/core';

interface Props<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>
}

export const MRT_TopToolbar = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      mantineTopToolbarProps,
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

  const toolbarProps = {
    ...parseFromValuesOrFunc(mantineTopToolbarProps, { table }),
    ...rest,
  }

  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet)

  const globalFilterProps = {
    style: !isTablet
      ? {
          zIndex: 3,
        }
      : undefined,
    table,
  }

  return (
    <Box
      {...toolbarProps}
      className={clsx(
        commonClasses['common-toolbar-styles'],
        classes['root'],
        isFullScreen && classes['root-fullscreen'],
        toolbarProps?.className,
      )}
      ref={(node: HTMLDivElement) => {
        if (node) {
          topToolbarRef.current = node
          if (toolbarProps?.ref) {
            toolbarProps.ref.current = node
          }
        }
      }}
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
      <Flex
        className={clsx(
          classes['actions-container'],
          stackAlertBanner && classes['actions-container-stack-alert'],
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <MRT_GlobalFilterTextInput {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <Flex justify={'end'} wrap={'wrap-reverse'}>
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <MRT_GlobalFilterTextInput {...globalFilterProps} />
            )}
            <MRT_ToolbarInternalButtons table={table} />
          </Flex>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <MRT_GlobalFilterTextInput {...globalFilterProps} />
          )
        )}
      </Flex>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <Flex justify="end">
            <MRT_TablePagination position="top" table={table} />
          </Flex>
        )}
      <MRT_ProgressBar isTopToolbar table={table} />
    </Box>
  )
}
