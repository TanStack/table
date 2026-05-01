import { useState } from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types'
import type { ButtonProps } from '@mui/material/Button'
import type { MouseEvent } from 'react'

export interface MRT_CopyButtonProps<
  TData extends MRT_RowData,
> extends ButtonProps {
  cell: MRT_Cell<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_CopyButton = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: MRT_CopyButtonProps<TData>) => {
  const {
    options: { localization, muiCopyButtonProps },
  } = table
  const { column, row } = cell
  const { columnDef } = column

  const [copied, setCopied] = useState(false)

  const handleCopy = (event: MouseEvent, text: unknown) => {
    event.stopPropagation()
    navigator.clipboard.writeText(text as string)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  const buttonProps = {
    ...parseFromValuesOrFunc(muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  }

  return (
    <Tooltip
      {...getCommonTooltipProps('top')}
      title={
        buttonProps?.title ??
        (copied ? localization.copiedToClipboard : localization.clickToCopy)
      }
    >
      <Button
        onClick={(e) => handleCopy(e, cell.getValue())}
        size="small"
        type="button"
        variant="text"
        {...buttonProps}
        sx={(theme) => ({
          backgroundColor: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'copy',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          letterSpacing: 'inherit',
          m: '-0.25rem',
          minWidth: 'unset',
          py: 0,
          textAlign: 'inherit',
          textTransform: 'inherit',
          ...(parseFromValuesOrFunc(buttonProps?.sx, theme) as any),
        })}
        title={undefined}
      />
    </Tooltip>
  )
}
