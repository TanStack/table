import clsx from 'clsx'


import {
  CopyButton,
  Tooltip,
  UnstyledButton
  
} from '@mantine/core'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MRT_CopyButton.module.css'
import type {ReactNode} from 'react';

import type {UnstyledButtonProps} from '@mantine/core';

import type {MRT_Cell, MRT_CellValue, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<
  TData extends MRT_RowData,
  TValue = MRT_CellValue,
> extends UnstyledButtonProps {
  cell: MRT_Cell<TData, TValue>
  children: ReactNode
  table: MRT_TableInstance<TData>
}

export const MRT_CopyButton = <TData extends MRT_RowData>({
  cell,
  children,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      localization: { clickToCopy, copiedToClipboard },
      mantineCopyButtonProps,
    },
  } = table
  const { column, row } = cell
  const { columnDef } = column

  const arg = { cell, column, row, table }
  const buttonProps = {
    ...parseFromValuesOrFunc(mantineCopyButtonProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineCopyButtonProps, arg),
    ...rest,
  }

  return (
    <CopyButton value={cell.getValue<string>()}>
      {({ copied, copy }) => (
        <Tooltip
          color={copied ? 'green' : undefined}
          label={
            buttonProps?.title ?? (copied ? copiedToClipboard : clickToCopy)
          }
          openDelay={1000}
          withinPortal
        >
          <UnstyledButton
            {...buttonProps}
            className={clsx(
              'mrt-copy-button',
              classes.root,
              buttonProps?.className,
            )}
            onClick={(e) => {
              e.stopPropagation()
              copy()
            }}
            role="presentation"
            title={undefined}
          >
            {children}
          </UnstyledButton>
        </Tooltip>
      )}
    </CopyButton>
  )
}
