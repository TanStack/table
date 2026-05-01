import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MouseEvent } from 'react'

export interface MRT_ExpandButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  row: MRT_Row<TData>
  staticRowIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
}: MRT_ExpandButtonProps<TData>) => {
  const theme = useTheme()
  const {
    state,
    options: {
      icons: { ExpandMoreIcon },
      localization,
      muiExpandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table
  const { density } = state

  const iconButtonProps = parseFromValuesOrFunc(muiExpandButtonProps, {
    row,
    staticRowIndex,
    table,
  })

  const canExpand = row.getCanExpand()
  const isExpanded = row.getIsExpanded()

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    row.toggleExpanded()
    iconButtonProps?.onClick?.(event)
  }

  const detailPanel = !!renderDetailPanel?.({ row, table })

  return (
    <Tooltip
      disableHoverListener={!canExpand && !detailPanel}
      {...getCommonTooltipProps()}
      title={
        iconButtonProps?.title ??
        (isExpanded ? localization.collapse : localization.expand)
      }
    >
      <span>
        <IconButton
          aria-label={localization.expand}
          disabled={!canExpand && !detailPanel}
          {...iconButtonProps}
          onClick={handleToggleExpand}
          sx={(theme) => ({
            height: density === 'compact' ? '1.75rem' : '2.25rem',
            opacity: !canExpand && !detailPanel ? 0.3 : 1,
            [theme.direction === 'rtl' || positionExpandColumn === 'last'
              ? 'mr'
              : 'ml']: `${row.depth * 16}px`,
            width: density === 'compact' ? '1.75rem' : '2.25rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.sx, theme) as any),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <ExpandMoreIcon
              style={{
                transform: `rotate(${
                  !canExpand && !renderDetailPanel
                    ? positionExpandColumn === 'last' ||
                      theme.direction === 'rtl'
                      ? 90
                      : -90
                    : isExpanded
                      ? -180
                      : 0
                }deg)`,
                transition: 'transform 150ms',
              }}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  )
}
