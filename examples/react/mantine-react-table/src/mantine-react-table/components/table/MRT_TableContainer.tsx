import clsx from 'clsx'


import { useEffect, useLayoutEffect, useState } from 'react'

import { Box,  LoadingOverlay } from '@mantine/core'


import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_EditRowModal } from '../modals/MRT_EditRowModal'
import { MRT_Table } from './MRT_Table'
import classes from './MRT_TableContainer.module.css'
import type {MRT_RowData, MRT_TableInstance} from '../../types';
import type {BoxProps} from '@mantine/core';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface Props<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>
}

export const MRT_TableContainer = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableStickyHeader,
      mantineLoadingOverlayProps,
      mantineTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table
  const {
    creatingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = state

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

  const tableContainerProps = {
    ...parseFromValuesOrFunc(mantineTableContainerProps, { table }),
    ...rest,
  }
  const loadingOverlayProps = parseFromValuesOrFunc(
    mantineLoadingOverlayProps,
    { table },
  )

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? (topToolbarRef.current?.offsetHeight ?? 0)
        : 0

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
        : 0

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight)
  })

  const createModalOpen = createDisplayMode === 'modal' && creatingRow
  const editModalOpen = editDisplayMode === 'modal' && editingRow

  return (
    <Box
      {...tableContainerProps}
      __vars={{
        '--mrt-top-toolbar-height': `${totalToolbarHeight}`,
        ...tableContainerProps?.__vars,
      }}
      className={clsx(
        'mrt-table-container',
        classes.root,
        enableStickyHeader && classes['root-sticky'],
        isFullScreen && classes['root-fullscreen'],
        tableContainerProps?.className,
      )}
      ref={(node: HTMLDivElement) => {
        if (node) {
          tableContainerRef.current = node
          if (tableContainerProps?.ref) {
            // @ts-ignore
            tableContainerProps.ref.current = node
          }
        }
      }}
    >
      <LoadingOverlay
        visible={isLoading || showLoadingOverlay}
        zIndex={2}
        {...loadingOverlayProps}
      />
      <MRT_Table table={table} />
      {(createModalOpen || editModalOpen) && (
        <MRT_EditRowModal open table={table} />
      )}
    </Box>
  )
}
