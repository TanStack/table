import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ExpandAllButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    state,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      muiExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table
  const { density, isLoading } = state

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiExpandAllButtonProps, {
      table,
    }),
    ...rest,
  }

  const isAllRowsExpanded = getIsAllRowsExpanded()

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      title={
        iconButtonProps?.title ??
        (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)
      }
    >
      <span>
        <IconButton
          aria-label={localization.expandAll}
          disabled={
            isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())
          }
          onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
          {...iconButtonProps}
          sx={(theme) => ({
            height: density === 'compact' ? '1.75rem' : '2.25rem',
            mt: density !== 'compact' ? '-0.25rem' : undefined,
            width: density === 'compact' ? '1.75rem' : '2.25rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.sx, theme) as any),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <KeyboardDoubleArrowDownIcon
              style={{
                transform: `rotate(${
                  isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0
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
