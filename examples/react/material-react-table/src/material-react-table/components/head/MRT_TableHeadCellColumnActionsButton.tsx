import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MouseEvent } from 'react'

export interface MRT_TableHeadCellColumnActionsButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellColumnActionsButton = <
  TData extends MRT_RowData,
>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: {
      icons: { MoreVertIcon },
      localization,
      muiColumnActionsButtonProps,
    },
  } = table
  const { column } = header
  const { columnDef } = column

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...rest,
  }

  return (
    <>
      <Tooltip
        {...getCommonTooltipProps('top')}
        title={iconButtonProps?.title ?? localization.columnActions}
      >
        <IconButton
          aria-label={localization.columnActions}
          onClick={handleClick}
          size="small"
          {...iconButtonProps}
          sx={(theme) => ({
            '&:hover': {
              opacity: 1,
            },
            height: '2rem',
            m: '-8px -4px',
            opacity: 0.3,
            transition: 'all 150ms',
            width: '2rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.sx, theme) as any),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <MoreVertIcon style={{ transform: 'scale(0.9)' }} />
          )}
        </IconButton>
      </Tooltip>
      {anchorEl && (
        <MRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  )
}
