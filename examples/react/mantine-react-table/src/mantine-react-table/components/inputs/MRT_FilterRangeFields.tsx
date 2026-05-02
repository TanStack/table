import clsx from 'clsx'

import { Box  } from '@mantine/core'
import classes from './MRT_FilterRangeFields.module.css'


import { MRT_FilterTextInput } from './MRT_FilterTextInput'
import type {BoxProps} from '@mantine/core';

import type {MRT_Header, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<TData extends MRT_RowData> extends BoxProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_FilterRangeFields = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  return (
    <Box
      {...rest}
      className={clsx('mrt-filter-range-fields', classes.root, rest.className)}
    >
      <MRT_FilterTextInput header={header} rangeFilterIndex={0} table={table} />
      <MRT_FilterTextInput header={header} rangeFilterIndex={1} table={table} />
    </Box>
  )
}
