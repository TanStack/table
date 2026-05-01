import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_ColumnPinningButtonsProps<
  TData extends MRT_RowData,
> extends BoxProps {
  column: MRT_Column<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  table,
  ...rest
}: MRT_ColumnPinningButtonsProps<TData>) => {
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection)
  }

  return (
    <Box
      {...rest}
      sx={(theme) => ({
        minWidth: '70px',
        textAlign: 'center',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {column.getIsPinned() ? (
        <Tooltip title={localization.unpin}>
          <IconButton onClick={() => handlePinColumn(false)} size="small">
            <PushPinIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title={localization.pinToLeft}>
            <IconButton onClick={() => handlePinColumn('left')} size="small">
              <PushPinIcon
                style={{
                  transform: 'rotate(90deg)',
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.pinToRight}>
            <IconButton onClick={() => handlePinColumn('right')} size="small">
              <PushPinIcon
                style={{
                  transform: 'rotate(-90deg)',
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}
