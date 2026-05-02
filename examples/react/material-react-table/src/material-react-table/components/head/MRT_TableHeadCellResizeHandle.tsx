import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { DividerProps } from '@mui/material/Divider'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_TableHeadCellResizeHandleProps<
  TData extends MRT_RowData,
> extends DividerProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    state,
    options: { columnResizeDirection, columnResizeMode },
    setColumnResizing,
  } = table
  const { density } = state
  const { column } = header

  const handler = header.getResizeHandler()

  const mx =
    density === 'compact'
      ? '-8px'
      : density === 'comfortable'
        ? '-16px'
        : '-24px'

  const lr = column.columnDef.columnDefType === 'display' ? '4px' : '0'

  return (
    <Box
      className="Mui-TableHeadCell-ResizeHandle-Wrapper"
      onDoubleClick={() => {
        setColumnResizing((old) => ({
          ...old,
          isResizingColumn: false,
        }))
        column.resetSize()
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          column.getIsResizing() && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (state.columnResizing.deltaOffset ?? 0)
              }px)`
            : undefined,
      }}
      sx={(theme) => ({
        '&:active > hr': {
          backgroundColor: theme.palette.info.main,
          opacity:
            header.subHeaders.length || columnResizeMode === 'onEnd' ? 1 : 0,
        },
        cursor: 'col-resize',
        left: columnResizeDirection === 'rtl' ? lr : undefined,
        ml: columnResizeDirection === 'rtl' ? mx : undefined,
        mr: columnResizeDirection === 'ltr' ? mx : undefined,
        position: 'absolute',
        px: '4px',
        right: columnResizeDirection === 'ltr' ? lr : undefined,
      })}
    >
      <Divider
        className="Mui-TableHeadCell-ResizeHandle-Divider"
        flexItem
        orientation="vertical"
        sx={(theme) => ({
          borderRadius: '2px',
          borderWidth: '2px',
          height: '24px',
          touchAction: 'none',
          transform: 'translateX(4px)',
          transition: column.getIsResizing()
            ? undefined
            : 'all 150ms ease-in-out',
          userSelect: 'none',
          zIndex: 4,
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
      />
    </Box>
  )
}
