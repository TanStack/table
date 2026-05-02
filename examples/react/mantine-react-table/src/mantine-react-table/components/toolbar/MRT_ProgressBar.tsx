import clsx from 'clsx'


import { Collapse, Progress  } from '@mantine/core'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MRT_ProgressBar.module.css'
import type {ProgressProps} from '@mantine/core';

import type {MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<TData extends MRT_RowData> extends Partial<ProgressProps> {
  isTopToolbar: boolean
  table: MRT_TableInstance<TData>
}

export const MRT_ProgressBar = <TData extends MRT_RowData>({
  isTopToolbar,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: { mantineProgressProps },
  } = table
  const { isSaving, showProgressBars } = state

  const linearProgressProps = {
    ...parseFromValuesOrFunc(mantineProgressProps, {
      isTopToolbar,
      table,
    }),
    ...rest,
  }

  return (
    <Collapse
      className={clsx(
        classes.collapse,
        isTopToolbar && classes['collapse-top'],
      )}
      expanded={isSaving || showProgressBars}
    >
      <Progress
        animated
        aria-busy="true"
        aria-label="Loading"
        radius={0}
        value={100}
        {...linearProgressProps}
      />
    </Collapse>
  )
}
