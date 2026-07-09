import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Column, MRT_RowData } from '../../types'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_ColumnPinningButtonsProps<
  TData extends MRT_RowData,
> extends BoxProps {
  column: MRT_Column<TData>
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  ...rest
}: MRT_ColumnPinningButtonsProps<TData>) => {
  const table = useMRTContext<TData>()
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table

  const handlePinColumn = (pinDirection: 'start' | 'end' | false) => {
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
            <IconButton onClick={() => handlePinColumn('start')} size="small">
              <PushPinIcon
                style={{
                  transform: 'rotate(90deg)',
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.pinToRight}>
            <IconButton onClick={() => handlePinColumn('end')} size="small">
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
