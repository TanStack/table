import Box from '@mui/material/Box'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_RowPinButton } from '../buttons/MRT_RowPinButton'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_TableBodyRowPinButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableBodyRowPinButton = <TData extends MRT_RowData>({
  row,
  table,
  ...rest
}: MRT_TableBodyRowPinButtonProps<TData>) => {
  const {
    state,
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table
  const { density } = state

  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any)

  if (!canPin) return null

  const rowPinButtonProps = {
    row,
    table,
    ...rest,
  }

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: density === 'compact' ? 'row' : 'column',
        }}
      >
        <MRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <MRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </Box>
    )
  }

  return (
    <MRT_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  )
}
