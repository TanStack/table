import Box from '@mui/material/Box'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_FilterTextField } from './MRT_FilterTextField'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_FilterRangeFieldsProps<
  TData extends MRT_RowData,
> extends BoxProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_FilterRangeFields = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_FilterRangeFieldsProps<TData>) => {
  return (
    <Box
      {...rest}
      sx={(theme) => ({
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr 1fr',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {[0, 1].map((rangeFilterIndex) => (
        <MRT_FilterTextField
          header={header}
          key={rangeFilterIndex}
          rangeFilterIndex={rangeFilterIndex}
          table={table}
        />
      ))}
    </Box>
  )
}
