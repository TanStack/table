import { useEffect, useLayoutEffect, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_CellActionMenu } from '../menus/MRT_CellActionMenu'
import { MRT_EditRowModal } from '../modals/MRT_EditRowModal'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { MRT_TableLoadingOverlay } from './MRT_TableLoadingOverlay'
import { MRT_Table } from './MRT_Table'
import type { TableContainerProps } from '@mui/material/TableContainer'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface MRT_TableContainerProps extends TableContainerProps {}

export const MRT_TableContainer = ({ ...rest }: MRT_TableContainerProps) => {
  const table = useMRTContext()
  const {
    state,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableStickyHeader,
      muiTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table
  const {
    actionCell,
    creatingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = state

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay)

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

  const tableContainerProps = {
    ...parseFromValuesOrFunc(muiTableContainerProps, {
      table,
    }),
    ...rest,
  }

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
    <TableContainer
      aria-busy={loading}
      aria-describedby={loading ? 'mrt-progress' : undefined}
      {...tableContainerProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          tableContainerRef.current = node
          if (tableContainerProps?.ref) {
            // @ts-expect-error
            tableContainerProps.ref.current = node
          }
        }
      }}
      style={{
        maxHeight: isFullScreen
          ? `calc(100vh - ${totalToolbarHeight}px)`
          : undefined,
        ...tableContainerProps?.style,
      }}
      sx={(theme) => ({
        maxHeight: enableStickyHeader
          ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
          : undefined,
        maxWidth: '100%',
        overflow: 'auto',
        position: 'relative',
        ...(parseFromValuesOrFunc(tableContainerProps?.sx, theme) as any),
      })}
    >
      {loading ? <MRT_TableLoadingOverlay /> : null}
      <MRT_Table />
      {(createModalOpen || editModalOpen) && <MRT_EditRowModal open />}
      {enableCellActions && actionCell && <MRT_CellActionMenu />}
    </TableContainer>
  )
}
